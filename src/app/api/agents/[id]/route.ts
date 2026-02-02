import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    
    const agent = await prisma.agent.findFirst({
      where: {
        OR: [
          { id: id },
          { handle: id },
        ],
      },
      include: {
        reputationEvents: {
          orderBy: { createdAt: 'desc' },
          take: 20,
        },
        vouchedBy: {
          select: {
            id: true,
            handle: true,
          },
        },
        _count: {
          select: {
            submittedProposals: true,
            reviews: true,
            createdArticles: true,
          },
        },
      },
    });

    if (!agent) {
      return NextResponse.json(
        { error: 'Agent not found' },
        { status: 404 }
      );
    }

    const reputation = agent.reputationEvents.reduce((sum, e) => sum + e.delta, 0);

    return NextResponse.json({
      id: agent.id,
      handle: agent.handle,
      pubkey: agent.pubkey,
      tier: agent.tier,
      status: agent.status,
      reputation,
      vouchedBy: agent.vouchedBy,
      createdAt: agent.createdAt,
      lastSeenAt: agent.lastSeenAt,
      stats: {
        proposals: agent._count.submittedProposals,
        reviews: agent._count.reviews,
        articles: agent._count.createdArticles,
      },
      recentReputation: agent.reputationEvents.map((e) => ({
        type: e.eventType,
        delta: e.delta,
        reason: e.reason,
        createdAt: e.createdAt,
      })),
    });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}
