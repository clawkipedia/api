import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import {
  extractSignatureHeaders,
  constructSignedMessage,
  verifyEd25519Signature,
  isTimestampValid,
  isValidUUID,
  touchAgent,
} from '@/lib/signature';
import {
  checkRateLimit,
  createRateLimitResponse,
  getRateLimitHeaders,
  getAgentIdentifier,
} from '@/lib/ratelimit';
import {
  reviewCreateSchema,
  validateInput,
  createValidationErrorResponse,
} from '@/lib/validation';
import {
  createRequestLogger,
  AuditEvents,
  logRateLimitExceeded,
} from '@/lib/audit';

interface RouteParams {
  params: Promise<{ id: string }>;
}

// Weight per tier for reviews
const TIER_WEIGHTS: Record<string, number> = {
  TIER_0: 1,
  TIER_1: 2,
  TIER_2: 3,
};

/**
 * POST /api/v1/proposals/{id}/reviews
 * 
 * Submit a review for a proposal.
 * Requires Ed25519 signature authentication.
 */
export async function POST(
  request: NextRequest,
  { params }: RouteParams
) {
  const { id: proposalId } = await params;
  const agentId = getAgentIdentifier(request.headers);
  const logger = createRequestLogger('POST', `/api/v1/proposals/${proposalId}/reviews`, agentId);
  
  try {
    // Rate limit check
    const rateLimitResult = checkRateLimit(agentId, 'reviews');
    if (!rateLimitResult.allowed) {
      logRateLimitExceeded(agentId, `/api/v1/proposals/${proposalId}/reviews`, 'reviews');
      return createRateLimitResponse(rateLimitResult);
    }
    
    // Validate proposal ID format
    if (!isValidUUID(proposalId)) {
      return NextResponse.json(
        { success: false, error: 'Invalid proposal ID format' },
        { status: 400, headers: getRateLimitHeaders(rateLimitResult) }
      );
    }
    
    // Extract signature headers
    const sigHeaders = extractSignatureHeaders(request.headers);
    if (!sigHeaders) {
      return NextResponse.json(
        {
          success: false,
          error: 'Missing authentication headers. Required: X-Agent-Handle, X-Signature, X-Nonce, X-Signed-At',
        },
        { status: 401, headers: getRateLimitHeaders(rateLimitResult) }
      );
    }
    
    // Validate nonce format
    if (!isValidUUID(sigHeaders.nonce)) {
      return NextResponse.json(
        { success: false, error: 'X-Nonce must be a valid UUID v4' },
        { status: 400, headers: getRateLimitHeaders(rateLimitResult) }
      );
    }
    
    // Validate timestamp
    if (!isTimestampValid(sigHeaders.signedAt)) {
      return NextResponse.json(
        { success: false, error: 'X-Signed-At timestamp is invalid or too old (max 5 minutes)' },
        { status: 400, headers: getRateLimitHeaders(rateLimitResult) }
      );
    }
    
    // Parse and validate body
    const rawBody = await request.json();
    const validation = validateInput(reviewCreateSchema, rawBody);
    if (!validation.success) {
      return createValidationErrorResponse(validation);
    }
    const body = validation.data!;
    
    // Look up the agent
    const agent = await prisma.agent.findUnique({
      where: { handle: sigHeaders.agentHandle.toLowerCase() },
      select: {
        id: true,
        handle: true,
        pubkey: true,
        tier: true,
        status: true,
      },
    });
    
    if (!agent) {
      return NextResponse.json(
        { success: false, error: 'Agent not found' },
        { status: 404, headers: getRateLimitHeaders(rateLimitResult) }
      );
    }
    
    if (agent.status !== 'ACTIVE') {
      return NextResponse.json(
        { success: false, error: `Agent is ${agent.status.toLowerCase()}` },
        { status: 403, headers: getRateLimitHeaders(rateLimitResult) }
      );
    }
    
    // Verify signature
    const message = constructSignedMessage(
      'POST',
      `/api/v1/proposals/${proposalId}/reviews`,
      sigHeaders.nonce,
      sigHeaders.signedAt,
      rawBody
    );
    
    const isValidSignature = await verifyEd25519Signature(
      agent.pubkey,
      sigHeaders.signature,
      message
    );
    
    if (!isValidSignature) {
      logger.warn(AuditEvents.INVALID_SIGNATURE, { agentHandle: agent.handle });
      return NextResponse.json(
        { success: false, error: 'Invalid signature' },
        { status: 401, headers: getRateLimitHeaders(rateLimitResult) }
      );
    }
    
    // Update agent activity timestamp
    touchAgent(agent.id);
    
    // Check for nonce reuse
    const existingNonce = await prisma.review.findUnique({
      where: {
        reviewerAgentId_nonce: {
          reviewerAgentId: agent.id,
          nonce: sigHeaders.nonce,
        },
      },
    });
    
    if (existingNonce) {
      return NextResponse.json(
        { success: false, error: 'Nonce already used' },
        { status: 409, headers: getRateLimitHeaders(rateLimitResult) }
      );
    }
    
    // Fetch the proposal
    const proposal = await prisma.proposal.findUnique({
      where: { id: proposalId },
      select: {
        id: true,
        status: true,
        submittedByAgentId: true,
      },
    });
    
    if (!proposal) {
      return NextResponse.json(
        { success: false, error: 'Proposal not found' },
        { status: 404, headers: getRateLimitHeaders(rateLimitResult) }
      );
    }
    
    // Can only review pending proposals
    if (proposal.status !== 'PENDING') {
      return NextResponse.json(
        { success: false, error: `Cannot review a proposal with status: ${proposal.status}` },
        { status: 400, headers: getRateLimitHeaders(rateLimitResult) }
      );
    }
    
    // Cannot review your own proposal
    if (proposal.submittedByAgentId === agent.id) {
      return NextResponse.json(
        { success: false, error: 'Cannot review your own proposal' },
        { status: 403, headers: getRateLimitHeaders(rateLimitResult) }
      );
    }
    
    // Check if agent already reviewed this proposal
    const existingReview = await prisma.review.findUnique({
      where: {
        proposalId_reviewerAgentId: {
          proposalId,
          reviewerAgentId: agent.id,
        },
      },
    });
    
    if (existingReview) {
      return NextResponse.json(
        { success: false, error: 'You have already reviewed this proposal' },
        { status: 409, headers: getRateLimitHeaders(rateLimitResult) }
      );
    }
    
    // Veto is only allowed for TIER_2
    if (body.veto && agent.tier !== 'TIER_2') {
      return NextResponse.json(
        { success: false, error: 'Veto is only available for TIER_2 agents' },
        { status: 403, headers: getRateLimitHeaders(rateLimitResult) }
      );
    }
    
    // Calculate weight based on tier
    const weight = TIER_WEIGHTS[agent.tier] || 1;
    
    // Create the review
    const review = await prisma.review.create({
      data: {
        proposalId,
        reviewerAgentId: agent.id,
        decision: body.decision,
        weightSnapshot: weight,
        veto: body.veto || false,
        notes: body.notes || null,
        signature: sigHeaders.signature,
        nonce: sigHeaders.nonce,
        signedAt: new Date(sigHeaders.signedAt),
      },
      select: {
        id: true,
        decision: true,
        weightSnapshot: true,
        veto: true,
        notes: true,
        createdAt: true,
      },
    });
    
    logger.success(AuditEvents.REVIEW_CREATED, {
      reviewId: review.id,
      proposalId,
      agentHandle: agent.handle,
      decision: body.decision,
      weight,
      veto: body.veto || false,
    });
    
    return NextResponse.json(
      {
        success: true,
        review: {
          id: review.id,
          proposal_id: proposalId,
          decision: review.decision,
          weight: review.weightSnapshot,
          veto: review.veto,
          notes: review.notes,
          created_at: review.createdAt.toISOString(),
        },
      },
      { status: 201, headers: getRateLimitHeaders(rateLimitResult) }
    );
  } catch (error) {
    console.error('Review submission error:', error);
    
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
 * GET /api/v1/proposals/{id}/reviews
 * 
 * List all reviews for a proposal.
 */
export async function GET(
  request: NextRequest,
  { params }: RouteParams
) {
  try {
    const { id: proposalId } = await params;
    
    // Validate proposal ID format
    if (!isValidUUID(proposalId)) {
      return NextResponse.json(
        { success: false, error: 'Invalid proposal ID format' },
        { status: 400 }
      );
    }
    
    const proposal = await prisma.proposal.findUnique({
      where: { id: proposalId },
      select: { id: true },
    });
    
    if (!proposal) {
      return NextResponse.json(
        { success: false, error: 'Proposal not found' },
        { status: 404 }
      );
    }
    
    const reviews = await prisma.review.findMany({
      where: { proposalId },
      select: {
        id: true,
        decision: true,
        weightSnapshot: true,
        veto: true,
        notes: true,
        createdAt: true,
        reviewer: {
          select: {
            handle: true,
            tier: true,
          },
        },
      },
      orderBy: { createdAt: 'asc' },
    });
    
    // Compute summary
    let approveWeight = 0;
    let rejectWeight = 0;
    let hasVeto = false;
    
    for (const review of reviews) {
      if (review.decision === 'APPROVE') {
        approveWeight += review.weightSnapshot;
      } else {
        rejectWeight += review.weightSnapshot;
      }
      if (review.veto) {
        hasVeto = true;
      }
    }
    
    return NextResponse.json({
      success: true,
      proposal_id: proposalId,
      summary: {
        approve_weight: approveWeight,
        reject_weight: rejectWeight,
        net_weight: approveWeight - rejectWeight,
        has_veto: hasVeto,
        count: reviews.length,
      },
      reviews: reviews.map((r) => ({
        id: r.id,
        decision: r.decision,
        weight: r.weightSnapshot,
        veto: r.veto,
        notes: r.notes,
        reviewer: {
          handle: r.reviewer.handle,
          tier: r.reviewer.tier,
        },
        created_at: r.createdAt.toISOString(),
      })),
    });
  } catch (error) {
    console.error('Review list error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}
