import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

interface MoltbookAgent {
  id: string;
  name: string;
  is_claimed: boolean;
  claimed_at: string | null;
  owner?: {
    xHandle: string;
    xName: string;
  };
}

interface MoltbookResponse {
  success: boolean;
  agent?: MoltbookAgent;
  error?: string;
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { moltbookHandle } = body;

    if (!moltbookHandle) {
      return NextResponse.json(
        { error: 'moltbookHandle is required' },
        { status: 400 }
      );
    }

    // Check agent exists
    const agent = await prisma.agent.findUnique({
      where: { id },
    });

    if (!agent) {
      return NextResponse.json(
        { error: 'Agent not found' },
        { status: 404 }
      );
    }

    // Fetch from Moltbook API
    const moltbookRes = await fetch(
      `https://www.moltbook.com/api/v1/agents/${encodeURIComponent(moltbookHandle)}`
    );

    if (!moltbookRes.ok) {
      return NextResponse.json(
        { error: 'Failed to fetch from Moltbook', details: await moltbookRes.text() },
        { status: 502 }
      );
    }

    const moltbookData: MoltbookResponse = await moltbookRes.json();

    if (!moltbookData.success || !moltbookData.agent) {
      return NextResponse.json(
        { error: 'Agent not found on Moltbook' },
        { status: 404 }
      );
    }

    const moltAgent = moltbookData.agent;

    // Verify claimed status
    if (!moltAgent.is_claimed) {
      return NextResponse.json(
        { error: 'Agent not claimed on Moltbook', verified: false },
        { status: 400 }
      );
    }

    // Verify X handle exists
    if (!moltAgent.owner?.xHandle) {
      return NextResponse.json(
        { error: 'No X verification found on Moltbook', verified: false },
        { status: 400 }
      );
    }

    // Update agent with verification
    const updatedAgent = await prisma.agent.update({
      where: { id },
      data: {
        moltbookVerified: true,
        moltbookHandle: moltbookHandle,
        xHandle: moltAgent.owner.xHandle,
        verifiedAt: new Date(),
      },
    });

    return NextResponse.json({
      verified: true,
      agent: {
        id: updatedAgent.id,
        handle: updatedAgent.handle,
        moltbookVerified: updatedAgent.moltbookVerified,
        moltbookHandle: updatedAgent.moltbookHandle,
        xHandle: updatedAgent.xHandle,
        verifiedAt: updatedAgent.verifiedAt,
      },
      moltbook: {
        name: moltAgent.name,
        xHandle: moltAgent.owner.xHandle,
        xName: moltAgent.owner.xName,
        claimedAt: moltAgent.claimed_at,
      },
    });
  } catch (error) {
    console.error('Moltbook verification error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    
    const agent = await prisma.agent.findUnique({
      where: { id },
      select: {
        id: true,
        handle: true,
        moltbookVerified: true,
        moltbookHandle: true,
        xHandle: true,
        verifiedAt: true,
      },
    });

    if (!agent) {
      return NextResponse.json(
        { error: 'Agent not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      verified: agent.moltbookVerified,
      agent,
    });
  } catch (error) {
    console.error('Verification check error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
