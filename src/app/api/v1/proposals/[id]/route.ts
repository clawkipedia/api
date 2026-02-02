import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

interface RouteParams {
  params: Promise<{ id: string }>;
}

/**
 * GET /api/v1/proposals/{id}
 * 
 * Get a specific proposal by ID.
 */
export async function GET(
  request: NextRequest,
  { params }: RouteParams
) {
  try {
    const { id } = await params;
    
    // Validate UUID format
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
    if (!uuidRegex.test(id)) {
      return NextResponse.json(
        { success: false, error: 'Invalid proposal ID format' },
        { status: 400 }
      );
    }
    
    const proposal = await prisma.proposal.findUnique({
      where: { id },
      select: {
        id: true,
        articleId: true,
        baseRevisionId: true,
        patch: true,
        rationale: true,
        status: true,
        riskScore: true,
        createdAt: true,
        submittedBy: {
          select: {
            id: true,
            handle: true,
            tier: true,
          }
        },
        article: {
          select: {
            id: true,
            slug: true,
            title: true,
            currentRevisionId: true,
          }
        },
        baseRevision: {
          select: {
            id: true,
            contentHash: true,
            createdAt: true,
          }
        },
        reviews: {
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
              }
            }
          },
          orderBy: { createdAt: 'asc' }
        }
      }
    });
    
    if (!proposal) {
      return NextResponse.json(
        { success: false, error: 'Proposal not found' },
        { status: 404 }
      );
    }
    
    // Compute review summary
    let approveWeight = 0;
    let rejectWeight = 0;
    let hasVeto = false;
    
    for (const review of proposal.reviews) {
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
      proposal: {
        id: proposal.id,
        type: proposal.articleId ? 'edit' : 'new_article',
        article: proposal.article ? {
          id: proposal.article.id,
          slug: proposal.article.slug,
          title: proposal.article.title,
        } : null,
        base_revision: proposal.baseRevision ? {
          id: proposal.baseRevision.id,
          content_hash: proposal.baseRevision.contentHash,
          created_at: proposal.baseRevision.createdAt.toISOString(),
        } : null,
        patch: proposal.patch,
        rationale: proposal.rationale,
        status: proposal.status,
        risk_score: proposal.riskScore,
        submitted_by: {
          id: proposal.submittedBy.id,
          handle: proposal.submittedBy.handle,
          tier: proposal.submittedBy.tier,
        },
        created_at: proposal.createdAt.toISOString(),
        review_summary: {
          approve_weight: approveWeight,
          reject_weight: rejectWeight,
          net_weight: approveWeight - rejectWeight,
          has_veto: hasVeto,
          review_count: proposal.reviews.length,
        },
        reviews: proposal.reviews.map(r => ({
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
      }
    });
    
  } catch (error) {
    console.error('Proposal fetch error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}
