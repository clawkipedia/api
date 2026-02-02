// Agent enrichment orchestrator
import { prisma } from '../prisma';
import { fetchTokenData } from './token';
import { fetchWebsiteData } from './website';
import type { AgentMetadata, AgentSocials, EnrichmentResult } from './types';
import type { Prisma } from '@prisma/client';

export * from './types';

export async function enrichAgent(agentId: string): Promise<EnrichmentResult> {
  try {
    const agent = await prisma.agent.findUnique({
      where: { id: agentId },
      select: {
        id: true,
        handle: true,
        token: true,
        socials: true,
        metadata: true,
      },
    });

    if (!agent) {
      return { success: false, error: 'Agent not found' };
    }

    const existingMetadata = (agent.metadata as AgentMetadata) || {};
    const socials = (agent.socials as AgentSocials) || {};
    const token = agent.token as { address?: string; chain?: string } | null;

    const newMetadata: AgentMetadata = {
      ...existingMetadata,
      lastScraped: new Date().toISOString(),
    };

    // Enrich token data if token address is set
    if (token?.address && token?.chain) {
      const tokenData = await fetchTokenData(token.address, token.chain);
      if (tokenData) {
        newMetadata.token = tokenData;
      }
    }

    // Enrich website data if website is set
    if (socials.website) {
      const websiteData = await fetchWebsiteData(socials.website);
      if (websiteData) {
        newMetadata.website = websiteData;
      }
    }

    // Update agent with new metadata
    await prisma.agent.update({
      where: { id: agentId },
      data: {
        metadata: newMetadata as Prisma.InputJsonValue,
        lastEnriched: new Date(),
      },
    });

    return { success: true, metadata: newMetadata };
  } catch (error) {
    console.error('Agent enrichment failed:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}

export async function enrichAllAgents(options?: {
  onlyFeatured?: boolean;
  maxAge?: number; // hours since last enrichment
}): Promise<{ enriched: number; errors: number }> {
  const { onlyFeatured = false, maxAge = 24 } = options || {};

  const maxAgeDate = new Date();
  maxAgeDate.setHours(maxAgeDate.getHours() - maxAge);

  const agents = await prisma.agent.findMany({
    where: {
      status: 'ACTIVE',
      ...(onlyFeatured ? { featured: true } : {}),
      OR: [
        { lastEnriched: null },
        { lastEnriched: { lt: maxAgeDate } },
      ],
    },
    select: { id: true },
    take: 50, // Limit batch size
  });

  let enriched = 0;
  let errors = 0;

  for (const agent of agents) {
    const result = await enrichAgent(agent.id);
    if (result.success) {
      enriched++;
    } else {
      errors++;
    }

    // Rate limiting - wait between enrichments
    await new Promise((resolve) => setTimeout(resolve, 500));
  }

  return { enriched, errors };
}
