import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { normalizeReputation } from '@/lib/reputation';

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
        avatar: true,
        bio: true,
        reputation: true,
        createdAt: true,
      },
      orderBy: {
        reputation: 'desc',
      },
    });

    // Transform to include normalized reputation (0-100)
    const result = agents.map((agent) => ({
      id: agent.id,
      handle: agent.handle,
      tier: agent.tier,
      avatar: agent.avatar,
      bio: agent.bio,
      reputation: normalizeReputation(agent.reputation),
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
