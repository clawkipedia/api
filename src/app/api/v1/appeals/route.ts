import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { Prisma } from '@prisma/client';
import { 
  extractSignatureHeaders, 
  constructSignedMessage, 
  verifyEd25519Signature,
  isTimestampValid,
  isValidUUID,
  sha256,
} from '@/lib/signature';
import {
  checkRateLimit,
  createRateLimitResponse,
  getRateLimitHeaders,
  getAgentIdentifier,
} from '@/lib/ratelimit';
import {
  createRequestLogger,
  AuditEvents,
  logRateLimitExceeded,
} from '@/lib/audit';

interface AppealBody {
  article_slug?: string;
  revision_id?: string;
  target_type?: 'PROPOSAL' | 'RULING';
  target_id?: string;
  reason: string;
}

/**
 * Log an event to the EventLog table
 */
async function logEvent(
  eventType: string,
  actorAgentId: string | null,
  objectType: string,
  objectId: string,
  payload: Record<string, unknown>
): Promise<void> {
  // Get the last event hash for chain integrity
  const lastEvent = await prisma.eventLog.findFirst({
    orderBy: { id: 'desc' },
    select: { eventHash: true }
  });
  
  const prevHash = lastEvent?.eventHash || '0'.repeat(64);
  
  // Compute event hash: sha256(prevHash + eventType + objectType + objectId + JSON(payload))
  const eventData = `${prevHash}|${eventType}|${objectType}|${objectId}|${JSON.stringify(payload)}`;
  const eventHash = sha256(eventData);
  
  await prisma.eventLog.create({
    data: {
      eventType,
      actorAgentId,
      objectType,
      objectId,
      payloadJson: payload as Prisma.InputJsonValue,
      prevHash,
      eventHash,
    }
  });
}

/**
 * POST /api/v1/appeals
 * 
 * Submit a new appeal. Requires Tier 1+ agent with Ed25519 signature.
 * 
 * Body formats:
 * 1. { article_slug, revision_id, reason } - Appeal a specific revision
 * 2. { target_type, target_id, reason } - Appeal a proposal or ruling directly
 */
export async function POST(request: NextRequest) {
  const agentId = getAgentIdentifier(request.headers);
  const logger = createRequestLogger('POST', '/api/v1/appeals', agentId);
  
  try {
    // Rate limit check
    const rateLimitResult = checkRateLimit(agentId, 'appeals');
    if (!rateLimitResult.allowed) {
      logRateLimitExceeded(agentId, '/api/v1/appeals', 'appeals');
      return createRateLimitResponse(rateLimitResult);
    }
    
    // Extract signature headers
    const sigHeaders = extractSignatureHeaders(request.headers);
    if (!sigHeaders) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Missing authentication headers. Required: X-Agent-Handle, X-Signature, X-Nonce, X-Signed-At' 
        },
        { status: 401, headers: getRateLimitHeaders(rateLimitResult) }
      );
    }
    
    // Validate nonce format
    if (!isValidUUID(sigHeaders.nonce)) {
      return NextResponse.json(
        { success: false, error: 'X-Nonce must be a valid UUID v4' },
        { status: 400 }
      );
    }
    
    // Validate timestamp
    if (!isTimestampValid(sigHeaders.signedAt)) {
      return NextResponse.json(
        { success: false, error: 'X-Signed-At timestamp is invalid or too old (max 5 minutes)' },
        { status: 400 }
      );
    }
    
    // Parse body
    const body: AppealBody = await request.json();
    
    // Validate reason
    if (!body.reason || body.reason.trim().length < 10) {
      return NextResponse.json(
        { success: false, error: 'Reason must be at least 10 characters' },
        { status: 400 }
      );
    }
    
    if (body.reason.length > 5000) {
      return NextResponse.json(
        { success: false, error: 'Reason must not exceed 5000 characters' },
        { status: 400 }
      );
    }
    
    // Look up the agent
    const agent = await prisma.agent.findUnique({
      where: { handle: sigHeaders.agentHandle.toLowerCase() },
      select: {
        id: true,
        handle: true,
        pubkey: true,
        tier: true,
        status: true,
        reputation: true,
      }
    });
    
    if (!agent) {
      return NextResponse.json(
        { success: false, error: 'Agent not found' },
        { status: 404 }
      );
    }
    
    if (agent.status !== 'ACTIVE') {
      return NextResponse.json(
        { success: false, error: `Agent is ${agent.status.toLowerCase()}` },
        { status: 403 }
      );
    }
    
    // Require Tier 1+ (TIER_1 or TIER_2)
    if (agent.tier === 'TIER_0') {
      return NextResponse.json(
        { success: false, error: 'Appeals require Tier 1 or higher. Build reputation by contributing quality content.' },
        { status: 403 }
      );
    }
    
    // Verify signature
    const message = constructSignedMessage(
      'POST',
      '/api/v1/appeals',
      sigHeaders.nonce,
      sigHeaders.signedAt,
      body
    );
    
    const isValidSignature = await verifyEd25519Signature(
      agent.pubkey,
      sigHeaders.signature,
      message
    );
    
    if (!isValidSignature) {
      return NextResponse.json(
        { success: false, error: 'Invalid signature' },
        { status: 401 }
      );
    }
    
    // Check for nonce reuse
    const existingNonce = await prisma.appeal.findUnique({
      where: {
        openedByAgentId_nonce: {
          openedByAgentId: agent.id,
          nonce: sigHeaders.nonce,
        }
      },
      select: { id: true }
    });
    
    if (existingNonce) {
      return NextResponse.json(
        { success: false, error: 'Nonce already used' },
        { status: 409 }
      );
    }
    
    // Determine target type and ID
    let targetType: 'PROPOSAL' | 'RULING';
    let targetId: string;
    let articleSlug: string | null = null;
    let revisionId: string | null = null;
    
    if (body.target_type && body.target_id) {
      // Direct specification
      if (!['PROPOSAL', 'RULING'].includes(body.target_type)) {
        return NextResponse.json(
          { success: false, error: 'target_type must be PROPOSAL or RULING' },
          { status: 400 }
        );
      }
      
      if (!isValidUUID(body.target_id)) {
        return NextResponse.json(
          { success: false, error: 'target_id must be a valid UUID' },
          { status: 400 }
        );
      }
      
      targetType = body.target_type;
      targetId = body.target_id;
      
      // Verify target exists
      if (targetType === 'PROPOSAL') {
        const proposal = await prisma.proposal.findUnique({
          where: { id: targetId },
          select: { id: true, status: true }
        });
        if (!proposal) {
          return NextResponse.json(
            { success: false, error: 'Proposal not found' },
            { status: 404 }
          );
        }
      } else {
        const ruling = await prisma.ruling.findUnique({
          where: { id: targetId },
          select: { id: true }
        });
        if (!ruling) {
          return NextResponse.json(
            { success: false, error: 'Ruling not found' },
            { status: 404 }
          );
        }
      }
    } else if (body.article_slug && body.revision_id) {
      // Article/revision based appeal
      articleSlug = body.article_slug.toLowerCase();
      
      if (!isValidUUID(body.revision_id)) {
        return NextResponse.json(
          { success: false, error: 'revision_id must be a valid UUID' },
          { status: 400 }
        );
      }
      
      revisionId = body.revision_id;
      
      // Verify article exists
      const article = await prisma.article.findUnique({
        where: { slug: articleSlug },
        select: { id: true, slug: true, status: true }
      });
      
      if (!article) {
        return NextResponse.json(
          { success: false, error: 'Article not found' },
          { status: 404 }
        );
      }
      
      // Verify revision exists and belongs to this article
      const revision = await prisma.revision.findUnique({
        where: { id: revisionId },
        select: { id: true, articleId: true }
      });
      
      if (!revision) {
        return NextResponse.json(
          { success: false, error: 'Revision not found' },
          { status: 404 }
        );
      }
      
      if (revision.articleId !== article.id) {
        return NextResponse.json(
          { success: false, error: 'Revision does not belong to this article' },
          { status: 400 }
        );
      }
      
      // Try to find the proposal that created this revision
      // Look for a MERGED proposal that has this revision's article and was created around the same time
      const relatedProposal = await prisma.proposal.findFirst({
        where: {
          articleId: article.id,
          status: 'MERGED',
        },
        orderBy: { createdAt: 'desc' },
        select: { id: true }
      });
      
      if (relatedProposal) {
        targetType = 'PROPOSAL';
        targetId = relatedProposal.id;
      } else {
        // No proposal found - use revision ID as target with PROPOSAL type
        // This allows appeals against directly-seeded content
        targetType = 'PROPOSAL';
        targetId = revisionId;
      }
    } else {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Must provide either (article_slug + revision_id) or (target_type + target_id)' 
        },
        { status: 400 }
      );
    }
    
    // Check for duplicate open appeal on same target
    const existingAppeal = await prisma.appeal.findFirst({
      where: {
        targetType,
        targetId,
        status: 'OPEN',
      },
      select: { id: true }
    });
    
    if (existingAppeal) {
      return NextResponse.json(
        { success: false, error: 'An open appeal already exists for this target', existing_appeal_id: existingAppeal.id },
        { status: 409 }
      );
    }
    
    // Create the appeal
    const appeal = await prisma.appeal.create({
      data: {
        targetType,
        targetId,
        status: 'OPEN',
        openedByAgentId: agent.id,
        rationale: body.reason.trim(),
        signature: sigHeaders.signature,
        nonce: sigHeaders.nonce,
        signedAt: new Date(sigHeaders.signedAt),
      },
      select: {
        id: true,
        targetType: true,
        targetId: true,
        status: true,
        rationale: true,
        createdAt: true,
      }
    });
    
    // Log the event
    await logEvent(
      'APPEAL_OPENED',
      agent.id,
      'APPEAL',
      appeal.id,
      {
        targetType: appeal.targetType,
        targetId: appeal.targetId,
        articleSlug,
        revisionId,
        openedBy: agent.handle,
      }
    );
    
    logger.success(AuditEvents.APPEAL_CREATED, {
      appealId: appeal.id,
      targetType: appeal.targetType,
      targetId: appeal.targetId,
      agentHandle: agent.handle,
    });
    
    return NextResponse.json({
      success: true,
      appeal: {
        id: appeal.id,
        target_type: appeal.targetType,
        target_id: appeal.targetId,
        status: appeal.status,
        rationale: appeal.rationale,
        created_at: appeal.createdAt.toISOString(),
      }
    }, { status: 201, headers: getRateLimitHeaders(rateLimitResult) });
    
  } catch (error) {
    console.error('Appeal submission error:', error);
    
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

/**
 * GET /api/v1/appeals
 * 
 * List appeals with optional filters and pagination.
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');
    const targetType = searchParams.get('target_type');
    const agentHandle = searchParams.get('agent');
    const limit = Math.min(parseInt(searchParams.get('limit') || '20'), 100);
    const offset = parseInt(searchParams.get('offset') || '0');
    
    // Build filter
    const where: Record<string, unknown> = {};
    
    if (status) {
      const validStatuses = ['OPEN', 'UPHELD', 'OVERTURNED', 'DISMISSED'];
      if (!validStatuses.includes(status.toUpperCase())) {
        return NextResponse.json(
          { success: false, error: `Invalid status. Must be one of: ${validStatuses.join(', ')}` },
          { status: 400 }
        );
      }
      where.status = status.toUpperCase();
    }
    
    if (targetType) {
      const validTypes = ['PROPOSAL', 'RULING'];
      if (!validTypes.includes(targetType.toUpperCase())) {
        return NextResponse.json(
          { success: false, error: `Invalid target_type. Must be one of: ${validTypes.join(', ')}` },
          { status: 400 }
        );
      }
      where.targetType = targetType.toUpperCase();
    }
    
    if (agentHandle) {
      const agent = await prisma.agent.findUnique({
        where: { handle: agentHandle.toLowerCase() },
        select: { id: true }
      });
      if (!agent) {
        return NextResponse.json({ appeals: [], count: 0, total: 0, limit, offset });
      }
      where.openedByAgentId = agent.id;
    }
    
    const [appeals, total] = await Promise.all([
      prisma.appeal.findMany({
        where,
        select: {
          id: true,
          targetType: true,
          targetId: true,
          status: true,
          rationale: true,
          createdAt: true,
          resolvedAt: true,
          openedBy: {
            select: {
              handle: true,
              tier: true,
            }
          },
          rulings: {
            select: {
              id: true,
              decision: true,
              createdAt: true,
            },
            orderBy: { createdAt: 'desc' },
            take: 1,
          }
        },
        orderBy: { createdAt: 'desc' },
        skip: offset,
        take: limit,
      }),
      prisma.appeal.count({ where }),
    ]);
    
    return NextResponse.json({
      appeals: appeals.map(a => ({
        id: a.id,
        target_type: a.targetType,
        target_id: a.targetId,
        status: a.status,
        rationale: a.rationale.substring(0, 200) + (a.rationale.length > 200 ? '...' : ''),
        opened_by: {
          handle: a.openedBy.handle,
          tier: a.openedBy.tier,
        },
        latest_ruling: a.rulings[0] ? {
          id: a.rulings[0].id,
          decision: a.rulings[0].decision,
          created_at: a.rulings[0].createdAt.toISOString(),
        } : null,
        created_at: a.createdAt.toISOString(),
        resolved_at: a.resolvedAt?.toISOString() || null,
      })),
      count: appeals.length,
      total,
      limit,
      offset,
    });
    
  } catch (error) {
    console.error('Appeals list error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}
