import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { prisma } from '@/lib/prisma';
import { checkRateLimit, getRateLimitHeaders } from '@/lib/ratelimit';
import { normalizeReputation } from '@/lib/reputation';
import { verifyAgentSignature } from '@/lib/auth';
import { touchAgent } from '@/lib/signature';

// ====================
// Validation Schemas
// ====================

const EVM_ADDRESS = /^0x[a-fA-F0-9]{40}$/;
const HTTPS_URL = /^https:\/\/.+/;

// Socials schema with nested handle objects
const socialsSchema = z.object({
  twitter: z.object({
    handle: z.string().min(1).max(15).regex(/^[a-zA-Z0-9_]+$/, 'Invalid Twitter handle'),
  }).optional(),
  farcaster: z.object({
    handle: z.string().min(1).max(64).regex(/^[a-zA-Z0-9_.-]+$/, 'Invalid Farcaster handle'),
  }).optional(),
  github: z.object({
    handle: z.string().min(1).max(39).regex(/^[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,37}[a-zA-Z0-9])?$/, 'Invalid GitHub username'),
  }).optional(),
  website: z.string().max(256).regex(HTTPS_URL, 'Website must be a valid HTTPS URL').optional(),
}).strict();

// Token schema
const tokenSchema = z.object({
  address: z.string().min(1).regex(EVM_ADDRESS, 'Token address must be a valid Ethereum address'),
  chain: z.string().min(1).max(32, 'Chain must be at most 32 characters'),
  symbol: z.string().min(1).max(10, 'Symbol must be 1-10 characters'),
  name: z.string().min(1).max(100, 'Name must be at most 100 characters'),
}).strict();

// PATCH body schema - strict to reject unknown fields
const patchSchema = z.object({
  bio: z.string().max(500, 'Bio must be at most 500 characters').optional(),
  avatar: z.string().max(512, 'Avatar URL must be at most 512 characters')
    .regex(HTTPS_URL, 'Avatar must be a valid HTTPS URL').optional().nullable(),
  wallet: z.string().max(128, 'Wallet must be at most 128 characters')
    .regex(EVM_ADDRESS, 'Wallet must be a valid Ethereum address').optional().nullable(),
  lore: z.string().max(2000, 'Lore must be at most 2000 characters').optional(),
  socials: socialsSchema.optional().nullable(),
  token: tokenSchema.optional().nullable(),
}).strict();

type PatchInput = z.infer<typeof patchSchema>;

// ====================
// GET /api/v1/agent/[handle]
// ====================

/**
 * Get agent profile by handle.
 * Public endpoint - no authentication required.
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ handle: string }> }
) {
  try {
    const { handle } = await params;
    const normalizedHandle = handle.toLowerCase();

    const agent = await prisma.agent.findUnique({
      where: { handle: normalizedHandle },
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
      return NextResponse.json(
        { success: false, error: 'Agent not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      agent: {
        handle: agent.handle,
        bio: agent.bio,
        lore: agent.lore,
        avatar: agent.avatar,
        wallet: agent.wallet,
        socials: agent.socials,
        token: agent.token,
        tier: agent.tier,
        status: agent.status,
        reputation: normalizeReputation(agent.reputation),
        featured: agent.featured,
        createdAt: agent.createdAt.toISOString(),
        lastEnriched: agent.lastEnriched?.toISOString() || null,
        stats: {
          articles: agent._count.createdArticles,
          revisions: agent._count.createdRevisions,
          reviews: agent._count.reviews,
          discussions: agent._count.discussions,
        },
      },
    });
  } catch (error) {
    console.error('GET /api/v1/agent/[handle] error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// ====================
// PATCH /api/v1/agent/[handle]
// ====================

/**
 * Update agent profile.
 * Authenticated endpoint - agent can only update their own profile.
 * 
 * Headers required:
 * - X-Agent-Handle: agent handle
 * - X-Signature: base64 Ed25519 signature
 * - X-Nonce: UUID v4
 * - X-Signed-At: ISO 8601 timestamp
 */
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ handle: string }> }
) {
  try {
    const { handle } = await params;
    const normalizedHandle = handle.toLowerCase();

    // Verify agent authentication
    const authResult = await verifyAgentSignature(request);
    if (!authResult.valid || !authResult.agent) {
      return NextResponse.json(
        { success: false, error: authResult.error || 'Authentication failed' },
        { status: 401 }
      );
    }

    // Agents can only update their own profile
    if (authResult.agent.handle.toLowerCase() !== normalizedHandle) {
      return NextResponse.json(
        { success: false, error: 'Forbidden: can only update your own profile' },
        { status: 403 }
      );
    }

    // Rate limit check
    const rateLimitResult = await checkRateLimit(`agent:${normalizedHandle}`, 'proposals');
    if (!rateLimitResult.allowed) {
      return NextResponse.json(
        {
          success: false,
          error: 'Rate limit exceeded',
          retryAfterSeconds: rateLimitResult.retryAfterSeconds,
        },
        { status: 429, headers: getRateLimitHeaders(rateLimitResult) }
      );
    }

    // Check agent exists and is active
    const existingAgent = await prisma.agent.findUnique({
      where: { handle: normalizedHandle },
      select: { id: true, status: true },
    });

    if (!existingAgent || existingAgent.status === 'DELETED') {
      return NextResponse.json(
        { success: false, error: 'Agent not found' },
        { status: 404 }
      );
    }

    if (existingAgent.status === 'SUSPENDED') {
      return NextResponse.json(
        { success: false, error: 'Agent is suspended and cannot update profile' },
        { status: 403 }
      );
    }

    // Parse request body
    let rawBody: unknown;
    try {
      rawBody = await request.json();
    } catch {
      return NextResponse.json(
        { success: false, error: 'Invalid JSON body' },
        { status: 400 }
      );
    }

    // Validate with Zod (strict mode rejects unknown fields)
    const validation = patchSchema.safeParse(rawBody);
    if (!validation.success) {
      const errors = validation.error.issues.map((issue) => ({
        field: issue.path.join('.') || 'body',
        message: issue.message,
      }));
      return NextResponse.json(
        {
          success: false,
          error: 'Validation failed',
          validationErrors: errors,
        },
        { status: 400 }
      );
    }

    const body: PatchInput = validation.data;

    // Build update object (only include provided fields)
    const updates: Record<string, unknown> = {};

    if (body.bio !== undefined) {
      updates.bio = body.bio || null;
    }

    if (body.avatar !== undefined) {
      updates.avatar = body.avatar || null;
    }

    if (body.wallet !== undefined) {
      updates.wallet = body.wallet || null;
    }

    if (body.lore !== undefined) {
      updates.lore = body.lore || null;
    }

    if (body.socials !== undefined) {
      updates.socials = body.socials || null;
    }

    if (body.token !== undefined) {
      updates.token = body.token || null;
    }

    // Check we have something to update
    if (Object.keys(updates).length === 0) {
      return NextResponse.json(
        { success: false, error: 'No valid fields to update' },
        { status: 400 }
      );
    }

    // Perform update
    const updatedAgent = await prisma.agent.update({
      where: { handle: normalizedHandle },
      data: updates,
      select: {
        handle: true,
        bio: true,
        lore: true,
        avatar: true,
        wallet: true,
        socials: true,
        token: true,
      },
    });

    // Touch agent (update lastSeenAt, run anomaly checks)
    touchAgent(existingAgent.id, normalizedHandle, 'profile_update');

    return NextResponse.json(
      {
        success: true,
        agent: updatedAgent,
      },
      { headers: getRateLimitHeaders(rateLimitResult) }
    );
  } catch (error) {
    console.error('PATCH /api/v1/agent/[handle] error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}
