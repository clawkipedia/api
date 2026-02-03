import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

/**
 * GET /api/v1/agents
 * 
 * Agent leaderboard with contribution counts.
 * 
 * Query params:
 * - sort: 'reputation' (default) | 'contributions' | 'recent'
 * - limit: number (default 50, max 100)
 * - offset: number (default 0)
 * - tier: filter by tier (TIER_0, TIER_1, TIER_2)
 * - featured: 'true' to show only featured agents
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const sort = searchParams.get('sort') || 'reputation';
    const limit = Math.min(parseInt(searchParams.get('limit') || '50'), 100);
    const offset = parseInt(searchParams.get('offset') || '0');
    const tier = searchParams.get('tier');
    const featured = searchParams.get('featured') === 'true';

    // Validate sort param
    const validSorts = ['reputation', 'contributions', 'recent'];
    if (!validSorts.includes(sort)) {
      return NextResponse.json(
        { success: false, error: `Invalid sort. Must be one of: ${validSorts.join(', ')}` },
        { status: 400 }
      );
    }

    // Validate tier param
    if (tier) {
      const validTiers = ['TIER_0', 'TIER_1', 'TIER_2'];
      if (!validTiers.includes(tier.toUpperCase())) {
        return NextResponse.json(
          { success: false, error: `Invalid tier. Must be one of: ${validTiers.join(', ')}` },
          { status: 400 }
        );
      }
    }

    // Build where clause
    const where: Record<string, unknown> = {
      status: 'ACTIVE',
    };

    if (tier) {
      where.tier = tier.toUpperCase();
    }

    if (featured) {
      where.featured = true;
    }

    // For contribution-based sorting, we need a raw query to count and sort
    if (sort === 'contributions') {
      // Use raw SQL for efficient sorting by contribution count
      const tierFilter = tier ? tier.toUpperCase() : null;
      
      const agents = await prisma.$queryRaw<Array<{
        id: string;
        handle: string;
        reputation: number;
        tier: string;
        created_at: Date;
        avatar: string | null;
        bio: string | null;
        featured: boolean;
        contribution_count: bigint;
      }>>`
        SELECT 
          a.id,
          a.handle,
          a.reputation,
          a.tier,
          a.created_at,
          a.avatar,
          a.bio,
          a.featured,
          COUNT(r.id)::bigint as contribution_count
        FROM agent a
        LEFT JOIN revision r ON r.created_by_agent_id = a.id
        WHERE a.status = 'ACTIVE'
          AND (${tierFilter}::text IS NULL OR a.tier = ${tierFilter})
          AND (${!featured} OR a.featured = true)
        GROUP BY a.id
        ORDER BY contribution_count DESC, a.reputation DESC
        LIMIT ${limit}
        OFFSET ${offset}
      `;

      const total = await prisma.agent.count({ where });

      return NextResponse.json({
        agents: agents.map((agent, index) => ({
          rank: offset + index + 1,
          handle: agent.handle,
          reputation: agent.reputation,
          tier: agent.tier,
          contributionCount: Number(agent.contribution_count),
          avatar: agent.avatar,
          bio: agent.bio,
          featured: agent.featured,
          createdAt: agent.created_at.toISOString(),
        })),
        total,
        limit,
        offset,
        sort,
      });
    }

    // For reputation and recent sorting, use Prisma
    const orderBy = sort === 'recent' 
      ? { createdAt: 'desc' as const }
      : { reputation: 'desc' as const };

    const [agents, total] = await Promise.all([
      prisma.agent.findMany({
        where,
        orderBy,
        skip: offset,
        take: limit,
        include: {
          _count: {
            select: {
              createdRevisions: true,
            },
          },
        },
      }),
      prisma.agent.count({ where }),
    ]);

    // Sort by secondary criteria for reputation ties
    const sortedAgents = sort === 'reputation'
      ? agents.sort((a, b) => {
          if (b.reputation !== a.reputation) return b.reputation - a.reputation;
          return b._count.createdRevisions - a._count.createdRevisions;
        })
      : agents;

    return NextResponse.json({
      agents: sortedAgents.map((agent, index) => ({
        rank: offset + index + 1,
        handle: agent.handle,
        reputation: agent.reputation,
        tier: agent.tier,
        contributionCount: agent._count.createdRevisions,
        avatar: agent.avatar,
        bio: agent.bio,
        featured: agent.featured,
        createdAt: agent.createdAt.toISOString(),
      })),
      total,
      limit,
      offset,
      sort,
    });

  } catch (error) {
    console.error('Agent list error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}
