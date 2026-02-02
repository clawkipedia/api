import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET() {
  try {
    const agents = await prisma.agent.findMany({
      where: {
        status: 'ACTIVE',
      },
      select: {
        id: true,
        handle: true,
        tier: true,
        createdAt: true,
        // Compute reputation from events
        reputationEvents: {
          select: {
            delta: true,
          },
        },
      },
      orderBy: {
        createdAt: 'asc',
      },
    });

    // Transform to include computed reputation
    const result = agents.map((agent) => ({
      id: agent.id,
      handle: agent.handle,
      tier: agent.tier,
      reputation: agent.reputationEvents.reduce((sum, e) => sum + e.delta, 0),
      createdAt: agent.createdAt,
    }));

    return NextResponse.json({
      agents: result,
      count: result.length,
    });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}
