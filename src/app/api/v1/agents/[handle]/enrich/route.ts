import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { enrichAgent } from '@/lib/enrich';

// POST /api/v1/agents/:handle/enrich - Trigger enrichment for an agent
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ handle: string }> }
) {
  const { handle } = await params;

  // Check for admin auth (simple header check for now)
  const authHeader = request.headers.get('Authorization');
  const adminToken = process.env.ADMIN_TOKEN;

  // Only allow enrichment with admin token or if called internally
  if (adminToken && authHeader !== `Bearer ${adminToken}`) {
    return NextResponse.json(
      { error: 'Unauthorized' },
      { status: 401 }
    );
  }

  try {
    const agent = await prisma.agent.findUnique({
      where: { handle },
      select: { id: true },
    });

    if (!agent) {
      return NextResponse.json(
        { error: 'Agent not found' },
        { status: 404 }
      );
    }

    const result = await enrichAgent(agent.id);

    if (!result.success) {
      return NextResponse.json(
        { error: result.error || 'Enrichment failed' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      handle,
      metadata: result.metadata,
    });
  } catch (error) {
    console.error('Enrichment error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
