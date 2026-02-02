import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import {
  checkRateLimit,
  createRateLimitResponse,
  getRateLimitHeaders,
  getAgentIdentifier,
} from '@/lib/ratelimit';
import {
  agentRegisterSchema,
  validateInput,
  createValidationErrorResponse,
} from '@/lib/validation';
import {
  createRequestLogger,
  AuditEvents,
  logRateLimitExceeded,
} from '@/lib/audit';

/**
 * POST /api/v1/agents/register
 * 
 * Register a new agent with Ed25519 public key.
 * New agents start at TIER_0 with ACTIVE status.
 */
export async function POST(request: NextRequest) {
  const clientId = getAgentIdentifier(request.headers);
  const logger = createRequestLogger('POST', '/api/v1/agents/register', clientId);
  
  try {
    // Rate limit check (stricter for registration)
    const rateLimitResult = checkRateLimit(clientId, 'register');
    if (!rateLimitResult.allowed) {
      logRateLimitExceeded(clientId, '/api/v1/agents/register', 'register');
      return createRateLimitResponse(rateLimitResult);
    }
    
    // Parse and validate body
    const rawBody = await request.json();
    const validation = validateInput(agentRegisterSchema, rawBody);
    if (!validation.success) {
      return createValidationErrorResponse(validation);
    }
    const body = validation.data!;
    
    // Additional validation: verify pubkey bytes (Zod regex ensures format)
    try {
      const keyBytes = Buffer.from(body.pubkey, 'base64');
      if (keyBytes.length !== 32) {
        return NextResponse.json(
          { success: false, error: 'pubkey must be a 32-byte Ed25519 public key (base64-encoded)' },
          { status: 400, headers: getRateLimitHeaders(rateLimitResult) }
        );
      }
    } catch {
      return NextResponse.json(
        { success: false, error: 'pubkey must be valid base64' },
        { status: 400, headers: getRateLimitHeaders(rateLimitResult) }
      );
    }
    
    // Check for existing handle or pubkey
    const existing = await prisma.agent.findFirst({
      where: {
        OR: [
          { handle: body.handle.toLowerCase() },
          { pubkey: body.pubkey }
        ]
      },
      select: { handle: true, pubkey: true }
    });
    
    if (existing) {
      if (existing.handle === body.handle.toLowerCase()) {
        return NextResponse.json(
          { success: false, error: 'Handle already registered' },
          { status: 409, headers: getRateLimitHeaders(rateLimitResult) }
        );
      }
      return NextResponse.json(
        { success: false, error: 'Public key already registered to another agent' },
        { status: 409, headers: getRateLimitHeaders(rateLimitResult) }
      );
    }
    
    // Create the agent
    const agent = await prisma.agent.create({
      data: {
        handle: body.handle.toLowerCase(),
        pubkey: body.pubkey,
        wallet: body.wallet || null,
        bio: body.bio || null,
        token: body.token || undefined,
        tier: 'TIER_0',
        status: 'ACTIVE',
      },
      select: {
        id: true,
        handle: true,
        tier: true,
        status: true,
        wallet: true,
        createdAt: true,
      }
    });
    
    logger.success(AuditEvents.AGENT_REGISTERED, {
      agentId: agent.id,
      handle: agent.handle,
    });
    
    return NextResponse.json({
      success: true,
      agent: {
        id: agent.id,
        handle: agent.handle,
        tier: agent.tier,
        status: agent.status,
        wallet: agent.wallet,
        created_at: agent.createdAt.toISOString(),
      }
    }, { status: 201, headers: getRateLimitHeaders(rateLimitResult) });
    
  } catch (error) {
    console.error('Agent registration error:', error);
    
    if (error instanceof SyntaxError) {
      return NextResponse.json(
        { success: false, error: 'Invalid JSON body' },
        { status: 400 }
      );
    }
    
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}
