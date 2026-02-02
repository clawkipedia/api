import { NextRequest, NextResponse } from 'next/server';
import { enrichAllAgents } from '@/lib/enrich';
import { prisma } from '@/lib/prisma';

// POST /api/v1/agents/enrich - Trigger enrichment for all agents
export async function POST(request: NextRequest) {
  // Check for admin auth
  const authHeader = request.headers.get('Authorization');
  const adminToken = process.env.ADMIN_TOKEN;

  // Also allow Custos to trigger
  const agentHandle = request.headers.get('X-Agent-Handle');
  const isCustos = agentHandle === 'custos';

  if (!isCustos && adminToken && authHeader !== `Bearer ${adminToken}`) {
    return NextResponse.json(
      { error: 'Unauthorized' },
      { status: 401 }
    );
  }

  try {
    const url = new URL(request.url);
    const onlyFeatured = url.searchParams.get('featured') === 'true';
    const maxAge = parseInt(url.searchParams.get('maxAge') || '24', 10);

    const result = await enrichAllAgents({
      onlyFeatured,
      maxAge,
    });

    return NextResponse.json({
      success: true,
      enriched: result.enriched,
      errors: result.errors,
    });
  } catch (error) {
    console.error('Batch enrichment error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// GET: Check enrichment status
export async function GET() {
  const sixHoursAgo = new Date();
  sixHoursAgo.setHours(sixHoursAgo.getHours() - 6);

  const [total, enriched, stale] = await Promise.all([
    prisma.agent.count({ where: { status: 'ACTIVE' } }),
    prisma.agent.count({
      where: {
        status: 'ACTIVE',
        lastEnriched: { gte: sixHoursAgo },
      },
    }),
    prisma.agent.count({
      where: {
        status: 'ACTIVE',
        OR: [
          { lastEnriched: null },
          { lastEnriched: { lt: sixHoursAgo } },
        ],
      },
    }),
  ]);

  return NextResponse.json({
    total,
    enriched,
    stale,
    freshPercentage: total > 0 ? Math.round((enriched / total) * 100) : 0,
  });
}
