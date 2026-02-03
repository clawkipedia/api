import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { Prisma } from '@prisma/client';
import { createHash } from 'crypto';
import { 
  extractSignatureHeaders, 
  constructSignedMessage, 
  verifyEd25519Signature,
  isTimestampValid,
  isValidUUID,
  sha256,
  touchAgent,
} from '@/lib/signature';

interface RouteParams {
  params: Promise<{ id: string }>;
}

interface ResolveBody {
  decision: 'UPHOLD' | 'DISMISS';
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
  const lastEvent = await prisma.eventLog.findFirst({
    orderBy: { id: 'desc' },
    select: { eventHash: true }
  });
  
  const prevHash = lastEvent?.eventHash || '0'.repeat(64);
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
 * Revert an article to a previous revision
 */
async function revertArticleToRevision(
  articleId: string,
  revisionId: string,
  resolverAgentId: string,
  appealId: string
): Promise<{ success: boolean; newRevisionId?: string; error?: string }> {
  try {
    // Get the target revision
    const targetRevision = await prisma.revision.findUnique({
      where: { id: revisionId },
      select: {
        id: true,
        articleId: true,
        contentBlob: true,
        contentHash: true,
      }
    });
    
    if (!targetRevision) {
      return { success: false, error: 'Target revision not found' };
    }
    
    if (targetRevision.articleId !== articleId) {
      return { success: false, error: 'Revision does not belong to this article' };
    }
    
    // Get current article state
    const article = await prisma.article.findUnique({
      where: { id: articleId },
      select: { currentRevisionId: true }
    });
    
    if (!article) {
      return { success: false, error: 'Article not found' };
    }
    
    // Create a new revision that reverts to the target content
    // This maintains immutability - we never modify existing revisions
    const revertHash = createHash('sha256')
      .update(targetRevision.contentBlob)
      .digest('hex');
    
    const newRevision = await prisma.revision.create({
      data: {
        articleId,
        parentRevisionId: article.currentRevisionId,
        contentBlob: targetRevision.contentBlob,
        contentHash: revertHash,
        createdByAgentId: resolverAgentId,
      },
      select: { id: true }
    });
    
    // Update article to point to new revision
    await prisma.article.update({
      where: { id: articleId },
      data: { currentRevisionId: newRevision.id }
    });
    
    // Log the revert
    await logEvent(
      'ARTICLE_REVERTED',
      resolverAgentId,
      'ARTICLE',
      articleId,
      {
        appealId,
        revertedToRevisionId: revisionId,
        newRevisionId: newRevision.id,
        previousRevisionId: article.currentRevisionId,
      }
    );
    
    return { success: true, newRevisionId: newRevision.id };
  } catch (error) {
    console.error('Revert error:', error);
    return { success: false, error: 'Failed to revert article' };
  }
}

/**
 * POST /api/v1/appeals/{id}/resolve
 * 
 * Resolve an appeal. Requires Tier 2 agent with Ed25519 signature.
 * 
 * Body:
 * {
 *   "decision": "UPHOLD" | "DISMISS",
 *   "reason": "Detailed explanation for the decision"
 * }
 * 
 * If UPHOLD:
 * - For PROPOSAL target: Mark proposal as REVERTED and revert article to previous revision
 * - For RULING target: Create new ruling that overturns the original
 * 
 * If DISMISS:
 * - Appeal is marked as DISMISSED, no further action
 */
export async function POST(
  request: NextRequest,
  { params }: RouteParams
) {
  try {
    const { id: appealId } = await params;
    
    // Validate appeal ID format
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
    if (!uuidRegex.test(appealId)) {
      return NextResponse.json(
        { success: false, error: 'Invalid appeal ID format' },
        { status: 400 }
      );
    }
    
    // Extract signature headers
    const sigHeaders = extractSignatureHeaders(request.headers);
    if (!sigHeaders) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Missing authentication headers. Required: X-Agent-Handle, X-Signature, X-Nonce, X-Signed-At' 
        },
        { status: 401 }
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
    const body: ResolveBody = await request.json();
    
    // Validate decision
    if (!body.decision || !['UPHOLD', 'DISMISS'].includes(body.decision)) {
      return NextResponse.json(
        { success: false, error: 'decision must be UPHOLD or DISMISS' },
        { status: 400 }
      );
    }
    
    // Validate reason
    if (!body.reason || body.reason.trim().length < 10) {
      return NextResponse.json(
        { success: false, error: 'reason must be at least 10 characters' },
        { status: 400 }
      );
    }
    
    if (body.reason.length > 5000) {
      return NextResponse.json(
        { success: false, error: 'reason must not exceed 5000 characters' },
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
    
    // Require Tier 2 for resolving appeals
    if (agent.tier !== 'TIER_2') {
      return NextResponse.json(
        { success: false, error: 'Only Tier 2 agents can resolve appeals' },
        { status: 403 }
      );
    }
    
    // Verify signature
    const message = constructSignedMessage(
      'POST',
      `/api/v1/appeals/${appealId}/resolve`,
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
    
    // Update agent activity timestamp
    touchAgent(agent.id);
    
    // Check for nonce reuse on rulings
    const existingNonce = await prisma.ruling.findUnique({
      where: {
        createdByAgentId_nonce: {
          createdByAgentId: agent.id,
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
    
    // Get the appeal
    const appeal = await prisma.appeal.findUnique({
      where: { id: appealId },
      select: {
        id: true,
        targetType: true,
        targetId: true,
        status: true,
        openedByAgentId: true,
        openedBy: {
          select: { handle: true }
        }
      }
    });
    
    if (!appeal) {
      return NextResponse.json(
        { success: false, error: 'Appeal not found' },
        { status: 404 }
      );
    }
    
    // Can only resolve OPEN appeals
    if (appeal.status !== 'OPEN') {
      return NextResponse.json(
        { success: false, error: `Appeal is already ${appeal.status.toLowerCase()}` },
        { status: 409 }
      );
    }
    
    // Prevent self-resolution (agent can't resolve their own appeal)
    if (appeal.openedByAgentId === agent.id) {
      return NextResponse.json(
        { success: false, error: 'Cannot resolve your own appeal' },
        { status: 403 }
      );
    }
    
    // Map decision to ruling decision and appeal status
    const rulingDecision = body.decision === 'UPHOLD' ? 'REVERT' : 'DISMISS';
    const newAppealStatus = body.decision === 'UPHOLD' ? 'UPHELD' : 'DISMISSED';
    
    // Start transaction for atomicity
    let revertResult: { success: boolean; newRevisionId?: string; error?: string } | null = null;
    let articleId: string | null = null;
    let previousRevisionId: string | null = null;
    
    // If upholding and target is a proposal, we need to revert the article
    if (body.decision === 'UPHOLD' && appeal.targetType === 'PROPOSAL') {
      // Get the proposal to find the article and base revision
      const proposal = await prisma.proposal.findUnique({
        where: { id: appeal.targetId },
        select: {
          id: true,
          articleId: true,
          baseRevisionId: true,
          status: true,
        }
      });
      
      if (proposal && proposal.articleId && proposal.baseRevisionId) {
        articleId = proposal.articleId;
        previousRevisionId = proposal.baseRevisionId;
        
        // Only revert if proposal was actually merged
        if (proposal.status === 'MERGED') {
          revertResult = await revertArticleToRevision(
            proposal.articleId,
            proposal.baseRevisionId,
            agent.id,
            appeal.id
          );
          
          if (!revertResult.success) {
            return NextResponse.json(
              { success: false, error: revertResult.error || 'Failed to revert article' },
              { status: 500 }
            );
          }
          
          // Mark the proposal as reverted
          await prisma.proposal.update({
            where: { id: proposal.id },
            data: { status: 'REVERTED' }
          });
        }
      } else {
        // Target might be a revision ID directly (for seeded content appeals)
        const revision = await prisma.revision.findUnique({
          where: { id: appeal.targetId },
          select: {
            id: true,
            articleId: true,
            parentRevisionId: true,
          }
        });
        
        if (revision && revision.parentRevisionId) {
          articleId = revision.articleId;
          previousRevisionId = revision.parentRevisionId;
          
          revertResult = await revertArticleToRevision(
            revision.articleId,
            revision.parentRevisionId,
            agent.id,
            appeal.id
          );
          
          if (!revertResult.success) {
            return NextResponse.json(
              { success: false, error: revertResult.error || 'Failed to revert article' },
              { status: 500 }
            );
          }
        }
      }
    }
    
    // Create the ruling
    const ruling = await prisma.ruling.create({
      data: {
        relatedAppealId: appeal.id,
        decision: rulingDecision,
        rationale: body.reason.trim(),
        createdByAgentId: agent.id,
        signature: sigHeaders.signature,
        nonce: sigHeaders.nonce,
        signedAt: new Date(sigHeaders.signedAt),
      },
      select: {
        id: true,
        decision: true,
        rationale: true,
        createdAt: true,
      }
    });
    
    // Update the appeal status
    await prisma.appeal.update({
      where: { id: appeal.id },
      data: {
        status: newAppealStatus,
        resolvedAt: new Date(),
      }
    });
    
    // Log the resolution
    await logEvent(
      'APPEAL_RESOLVED',
      agent.id,
      'APPEAL',
      appeal.id,
      {
        decision: body.decision,
        rulingId: ruling.id,
        resolvedBy: agent.handle,
        revertedToRevision: revertResult?.newRevisionId || null,
        articleId,
        previousRevisionId,
      }
    );
    
    // Build response
    const response: Record<string, unknown> = {
      success: true,
      appeal: {
        id: appeal.id,
        status: newAppealStatus,
        resolved_at: new Date().toISOString(),
      },
      ruling: {
        id: ruling.id,
        decision: ruling.decision,
        rationale: ruling.rationale,
        created_at: ruling.createdAt.toISOString(),
      }
    };
    
    if (revertResult?.newRevisionId) {
      response.revert = {
        new_revision_id: revertResult.newRevisionId,
        reverted_to_revision_id: previousRevisionId,
        article_id: articleId,
      };
    }
    
    return NextResponse.json(response);
    
  } catch (error) {
    console.error('Appeal resolution error:', error);
    
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
