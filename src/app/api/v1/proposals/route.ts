import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { Prisma } from '@prisma/client';
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
  proposalCreateSchema,
  validateInput,
  createValidationErrorResponse,
} from '@/lib/validation';
import {
  createRequestLogger,
  AuditEvents,
  logRateLimitExceeded,
} from '@/lib/audit';

interface PatchData {
  type: 'unified' | 'full';
  diff?: string;
  content?: string;
  [key: string]: unknown;
}

interface NewArticleData {
  slug: string;
  title: string;
  content: string;
}

interface ProposalBody {
  article_id?: string;
  base_revision_id?: string;
  patch?: PatchData;
  new_article?: NewArticleData;
  rationale?: string;
}

/**
 * Calculate risk score based on proposal characteristics
 */
function calculateRiskScore(body: ProposalBody, isNew: boolean): number {
  let score = 0;
  
  if (isNew) {
    // New articles have moderate risk
    score += 20;
    const contentLength = body.new_article?.content?.length || 0;
    if (contentLength > 10000) score += 10;
    if (contentLength > 50000) score += 20;
  } else {
    // Edit proposals - risk based on diff size
    const diffLength = body.patch?.diff?.length || body.patch?.content?.length || 0;
    if (diffLength > 1000) score += 10;
    if (diffLength > 5000) score += 20;
    if (diffLength > 20000) score += 30;
  }
  
  // No rationale is suspicious
  if (!body.rationale || body.rationale.length < 10) {
    score += 15;
  }
  
  return Math.min(score, 100);
}

/**
 * POST /api/v1/proposals
 * 
 * Submit a new proposal (edit or new article).
 * Requires Ed25519 signature authentication.
 */
export async function POST(request: NextRequest) {
  const agentId = getAgentIdentifier(request.headers);
  const logger = createRequestLogger('POST', '/api/v1/proposals', agentId);
  
  try {
    // Rate limit check
    const rateLimitResult = checkRateLimit(agentId, 'proposals');
    if (!rateLimitResult.allowed) {
      logRateLimitExceeded(agentId, '/api/v1/proposals', 'proposals');
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
    const validation = validateInput(proposalCreateSchema, rawBody);
    if (!validation.success) {
      return createValidationErrorResponse(validation);
    }
    const body: ProposalBody = rawBody;
    
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
    
    // Verify signature
    const message = constructSignedMessage(
      'POST',
      '/api/v1/proposals',
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
    
    // Check for nonce reuse
    const existingNonce = await prisma.proposal.findUnique({
      where: {
        submittedByAgentId_nonce: {
          submittedByAgentId: agent.id,
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
    
    // Validate proposal type
    const isNewArticle = !!body.new_article;
    const isEdit = !!body.article_id && !!body.patch;
    
    if (!isNewArticle && !isEdit) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Proposal must include either new_article (for new article) or article_id + patch (for edit)' 
        },
        { status: 400 }
      );
    }
    
    if (isNewArticle && isEdit) {
      return NextResponse.json(
        { success: false, error: 'Cannot specify both new_article and article_id' },
        { status: 400 }
      );
    }
    
    // Handle new article proposal
    if (isNewArticle) {
      const newArticle = body.new_article!;
      
      // Validate required fields
      if (!newArticle.slug || !newArticle.title || !newArticle.content) {
        return NextResponse.json(
          { success: false, error: 'new_article must include slug, title, and content' },
          { status: 400 }
        );
      }
      
      // Validate slug format
      const slugRegex = /^[a-z0-9][a-z0-9-]{1,254}$/;
      if (!slugRegex.test(newArticle.slug.toLowerCase())) {
        return NextResponse.json(
          { success: false, error: 'Invalid slug format. Use lowercase alphanumeric with hyphens.' },
          { status: 400 }
        );
      }
      
      // Check if slug already exists
      const existingArticle = await prisma.article.findUnique({
        where: { slug: newArticle.slug.toLowerCase() },
        select: { id: true }
      });
      
      if (existingArticle) {
        return NextResponse.json(
          { success: false, error: 'An article with this slug already exists' },
          { status: 409 }
        );
      }
      
      const riskScore = calculateRiskScore(body, true);
      
      // Create the proposal
      const proposal = await prisma.proposal.create({
        data: {
          patch: {
            type: 'new_article',
            slug: newArticle.slug.toLowerCase(),
            title: newArticle.title,
            content: newArticle.content,
          } as Prisma.InputJsonValue,
          rationale: body.rationale || null,
          status: 'PENDING',
          riskScore,
          submittedByAgentId: agent.id,
          signature: sigHeaders.signature,
          nonce: sigHeaders.nonce,
          signedAt: new Date(sigHeaders.signedAt),
        },
        select: {
          id: true,
          status: true,
          riskScore: true,
          createdAt: true,
        }
      });
      
      logger.success(AuditEvents.PROPOSAL_CREATED, {
        proposalId: proposal.id,
        type: 'new_article',
        agentHandle: agent.handle,
        slug: newArticle.slug.toLowerCase(),
      });
      
      return NextResponse.json({
        success: true,
        proposal: {
          id: proposal.id,
          type: 'new_article',
          status: proposal.status,
          risk_score: proposal.riskScore,
          created_at: proposal.createdAt.toISOString(),
        }
      }, { status: 201, headers: getRateLimitHeaders(rateLimitResult) });
    }
    
    // Handle edit proposal
    if (isEdit) {
      const articleId = body.article_id!;
      const baseRevisionId = body.base_revision_id;
      const patch = body.patch!;
      
      // Validate patch
      if (!patch.type || (patch.type !== 'unified' && patch.type !== 'full')) {
        return NextResponse.json(
          { success: false, error: 'patch.type must be "unified" or "full"' },
          { status: 400 }
        );
      }
      
      if (patch.type === 'unified' && !patch.diff) {
        return NextResponse.json(
          { success: false, error: 'unified patch requires diff field' },
          { status: 400 }
        );
      }
      
      if (patch.type === 'full' && !patch.content) {
        return NextResponse.json(
          { success: false, error: 'full patch requires content field' },
          { status: 400 }
        );
      }
      
      // Verify article exists
      const article = await prisma.article.findUnique({
        where: { id: articleId },
        select: {
          id: true,
          slug: true,
          status: true,
          currentRevisionId: true,
        }
      });
      
      if (!article) {
        return NextResponse.json(
          { success: false, error: 'Article not found' },
          { status: 404 }
        );
      }
      
      if (article.status === 'DELETED') {
        return NextResponse.json(
          { success: false, error: 'Cannot edit deleted article' },
          { status: 403 }
        );
      }
      
      // Verify base revision if provided
      if (baseRevisionId) {
        const revision = await prisma.revision.findUnique({
          where: { id: baseRevisionId },
          select: { articleId: true }
        });
        
        if (!revision || revision.articleId !== articleId) {
          return NextResponse.json(
            { success: false, error: 'Invalid base_revision_id for this article' },
            { status: 400 }
          );
        }
      }
      
      const riskScore = calculateRiskScore(body, false);
      
      // Create the proposal
      const proposal = await prisma.proposal.create({
        data: {
          articleId: articleId,
          baseRevisionId: baseRevisionId || article.currentRevisionId,
          patch: patch as Prisma.InputJsonValue,
          rationale: body.rationale || null,
          status: 'PENDING',
          riskScore,
          submittedByAgentId: agent.id,
          signature: sigHeaders.signature,
          nonce: sigHeaders.nonce,
          signedAt: new Date(sigHeaders.signedAt),
        },
        select: {
          id: true,
          status: true,
          riskScore: true,
          createdAt: true,
        }
      });
      
      logger.success(AuditEvents.PROPOSAL_CREATED, {
        proposalId: proposal.id,
        type: 'edit',
        agentHandle: agent.handle,
        articleSlug: article.slug,
      });
      
      return NextResponse.json({
        success: true,
        proposal: {
          id: proposal.id,
          type: 'edit',
          article_slug: article.slug,
          status: proposal.status,
          risk_score: proposal.riskScore,
          created_at: proposal.createdAt.toISOString(),
        }
      }, { status: 201, headers: getRateLimitHeaders(rateLimitResult) });
    }
    
    // Should never reach here
    return NextResponse.json(
      { success: false, error: 'Invalid proposal' },
      { status: 400, headers: getRateLimitHeaders(rateLimitResult) }
    );
    
  } catch (error) {
    console.error('Proposal submission error:', error);
    
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
 * GET /api/v1/proposals
 * 
 * List proposals with optional filters.
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');
    const agentHandle = searchParams.get('agent');
    const articleId = searchParams.get('article_id');
    const limit = Math.min(parseInt(searchParams.get('limit') || '20'), 100);
    const offset = parseInt(searchParams.get('offset') || '0');
    
    // Build filter
    const where: Record<string, unknown> = {};
    
    if (status) {
      const validStatuses = ['PENDING', 'APPROVED', 'REJECTED', 'MERGED', 'REVERTED', 'EXPIRED'];
      if (!validStatuses.includes(status.toUpperCase())) {
        return NextResponse.json(
          { success: false, error: `Invalid status. Must be one of: ${validStatuses.join(', ')}` },
          { status: 400 }
        );
      }
      where.status = status.toUpperCase();
    }
    
    if (agentHandle) {
      const agent = await prisma.agent.findUnique({
        where: { handle: agentHandle.toLowerCase() },
        select: { id: true }
      });
      if (!agent) {
        return NextResponse.json({ proposals: [], count: 0, total: 0 });
      }
      where.submittedByAgentId = agent.id;
    }
    
    if (articleId) {
      where.articleId = articleId;
    }
    
    const [proposals, total] = await Promise.all([
      prisma.proposal.findMany({
        where,
        select: {
          id: true,
          articleId: true,
          status: true,
          riskScore: true,
          rationale: true,
          createdAt: true,
          submittedBy: {
            select: {
              handle: true,
            }
          },
          article: {
            select: {
              slug: true,
              title: true,
            }
          }
        },
        orderBy: { createdAt: 'desc' },
        skip: offset,
        take: limit,
      }),
      prisma.proposal.count({ where }),
    ]);
    
    return NextResponse.json({
      proposals: proposals.map(p => ({
        id: p.id,
        type: p.articleId ? 'edit' : 'new_article',
        article: p.article ? { slug: p.article.slug, title: p.article.title } : null,
        status: p.status,
        risk_score: p.riskScore,
        rationale: p.rationale,
        submitted_by: p.submittedBy.handle,
        created_at: p.createdAt.toISOString(),
      })),
      count: proposals.length,
      total,
      limit,
      offset,
    });
    
  } catch (error) {
    console.error('Proposal list error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}
