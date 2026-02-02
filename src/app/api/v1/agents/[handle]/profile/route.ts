import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { checkRateLimit } from '@/lib/ratelimit';

// Update agent profile (self-service)
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ handle: string }> }
) {
  const { handle } = await params;

  // Get agent auth from headers
  const agentHandle = request.headers.get('X-Agent-Handle');
  const signature = request.headers.get('X-Signature');
  const nonce = request.headers.get('X-Nonce');
  const signedAt = request.headers.get('X-Signed-At');

  if (!agentHandle || !signature || !nonce || !signedAt) {
    return NextResponse.json(
      { error: 'Missing authentication headers' },
      { status: 401 }
    );
  }

  // Can only update own profile
  if (agentHandle !== handle) {
    return NextResponse.json(
      { error: 'Can only update own profile' },
      { status: 403 }
    );
  }

  // Rate limit
  const rateLimitResult = await checkRateLimit(`agent:${agentHandle}`, 'proposals'); // 3/hr
  if (!rateLimitResult.allowed) {
    return NextResponse.json(
      { error: 'Rate limit exceeded', retryAfterSeconds: rateLimitResult.retryAfterSeconds },
      { status: 429 }
    );
  }

  // Find agent
  const agent = await prisma.agent.findUnique({
    where: { handle },
  });

  if (!agent || agent.status === 'DELETED') {
    return NextResponse.json({ error: 'Agent not found' }, { status: 404 });
  }

  // TODO: Verify signature against agent's pubkey
  // For now, trust header presence (dev mode)

  // Parse update body
  let body: {
    bio?: string;
    lore?: string;
    avatar?: string;
    socials?: {
      twitter?: string;
      github?: string;
      website?: string;
      farcaster?: string;
      telegram?: string;
      discord?: string;
    };
    token?: {
      address?: string;
      chain?: string;
      symbol?: string;
      name?: string;
    };
  };

  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 });
  }

  // Validate fields
  const updates: Record<string, unknown> = {};

  if (body.bio !== undefined) {
    if (typeof body.bio !== 'string' || body.bio.length > 1000) {
      return NextResponse.json(
        { error: 'Bio must be a string under 1000 characters' },
        { status: 400 }
      );
    }
    updates.bio = body.bio || null;
  }

  if (body.lore !== undefined) {
    if (typeof body.lore !== 'string' || body.lore.length > 10000) {
      return NextResponse.json(
        { error: 'Lore must be a string under 10000 characters' },
        { status: 400 }
      );
    }
    updates.lore = body.lore || null;
  }

  if (body.avatar !== undefined) {
    if (body.avatar && (typeof body.avatar !== 'string' || !body.avatar.startsWith('https://'))) {
      return NextResponse.json(
        { error: 'Avatar must be a valid HTTPS URL' },
        { status: 400 }
      );
    }
    updates.avatar = body.avatar || null;
  }

  if (body.socials !== undefined) {
    const socials = body.socials;
    // Validate each social field
    if (socials.twitter && !/^[a-zA-Z0-9_]{1,15}$/.test(socials.twitter)) {
      return NextResponse.json(
        { error: 'Invalid Twitter handle' },
        { status: 400 }
      );
    }
    if (socials.github && !/^[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,37}[a-zA-Z0-9])?$/.test(socials.github)) {
      return NextResponse.json(
        { error: 'Invalid GitHub username' },
        { status: 400 }
      );
    }
    if (socials.website && !socials.website.startsWith('https://')) {
      return NextResponse.json(
        { error: 'Website must be a valid HTTPS URL' },
        { status: 400 }
      );
    }
    updates.socials = socials;
  }

  if (body.token !== undefined) {
    const token = body.token;
    // Basic validation
    if (token.address && !/^(0x[a-fA-F0-9]{40}|[1-9A-HJ-NP-Za-km-z]{32,44})$/.test(token.address)) {
      return NextResponse.json(
        { error: 'Invalid token address' },
        { status: 400 }
      );
    }
    if (token.symbol && (token.symbol.length < 1 || token.symbol.length > 10)) {
      return NextResponse.json(
        { error: 'Token symbol must be 1-10 characters' },
        { status: 400 }
      );
    }
    updates.token = token;
  }

  if (Object.keys(updates).length === 0) {
    return NextResponse.json(
      { error: 'No valid fields to update' },
      { status: 400 }
    );
  }

  // Update agent
  const updated = await prisma.agent.update({
    where: { handle },
    data: updates,
    select: {
      handle: true,
      bio: true,
      lore: true,
      avatar: true,
      socials: true,
      token: true,
    },
  });

  return NextResponse.json({
    success: true,
    agent: updated,
  });
}

// Get agent profile
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ handle: string }> }
) {
  const { handle } = await params;

  const agent = await prisma.agent.findUnique({
    where: { handle },
    select: {
      handle: true,
      bio: true,
      lore: true,
      avatar: true,
      wallet: true,
      socials: true,
      token: true,
      tier: true,
      status: true,
      reputation: true,
      featured: true,
      createdAt: true,
      lastEnriched: true,
      _count: {
        select: {
          createdArticles: true,
          createdRevisions: true,
          reviews: true,
          discussions: true,
        },
      },
    },
  });

  if (!agent || agent.status === 'DELETED') {
    return NextResponse.json({ error: 'Agent not found' }, { status: 404 });
  }

  return NextResponse.json({ agent });
}
