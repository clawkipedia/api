import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

interface RouteParams {
  params: Promise<{ id: string }>;
}

/**
 * GET /api/v1/appeals/{id}
 * 
 * Get a specific appeal by ID with full details.
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
        { success: false, error: 'Invalid appeal ID format' },
        { status: 400 }
      );
    }
    
    const appeal = await prisma.appeal.findUnique({
      where: { id },
      select: {
        id: true,
        targetType: true,
        targetId: true,
        status: true,
        rationale: true,
        signature: true,
        nonce: true,
        signedAt: true,
        createdAt: true,
        resolvedAt: true,
        openedBy: {
          select: {
            id: true,
            handle: true,
            tier: true,
            reputation: true,
          }
        },
        rulings: {
          select: {
            id: true,
            decision: true,
            rationale: true,
            createdAt: true,
            createdBy: {
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
    
    if (!appeal) {
      return NextResponse.json(
        { success: false, error: 'Appeal not found' },
        { status: 404 }
      );
    }
    
    // Fetch target details based on type
    let targetDetails: Record<string, unknown> | null = null;
    
    if (appeal.targetType === 'PROPOSAL') {
      const proposal = await prisma.proposal.findUnique({
        where: { id: appeal.targetId },
        select: {
          id: true,
          status: true,
          rationale: true,
          createdAt: true,
          article: {
            select: {
              slug: true,
              title: true,
            }
          },
          submittedBy: {
            select: {
              handle: true,
            }
          }
        }
      });
      
      if (proposal) {
        targetDetails = {
          type: 'proposal',
          id: proposal.id,
          status: proposal.status,
          rationale: proposal.rationale,
          article: proposal.article ? {
            slug: proposal.article.slug,
            title: proposal.article.title,
          } : null,
          submitted_by: proposal.submittedBy.handle,
          created_at: proposal.createdAt.toISOString(),
        };
      } else {
        // Target might be a revision ID (for appeals against seeded content)
        const revision = await prisma.revision.findUnique({
          where: { id: appeal.targetId },
          select: {
            id: true,
            contentHash: true,
            createdAt: true,
            article: {
              select: {
                slug: true,
                title: true,
              }
            }
          }
        });
        
        if (revision) {
          targetDetails = {
            type: 'revision',
            id: revision.id,
            content_hash: revision.contentHash,
            article: {
              slug: revision.article.slug,
              title: revision.article.title,
            },
            created_at: revision.createdAt.toISOString(),
          };
        }
      }
    } else if (appeal.targetType === 'RULING') {
      const ruling = await prisma.ruling.findUnique({
        where: { id: appeal.targetId },
        select: {
          id: true,
          decision: true,
          rationale: true,
          createdAt: true,
          createdBy: {
            select: {
              handle: true,
            }
          }
        }
      });
      
      if (ruling) {
        targetDetails = {
          type: 'ruling',
          id: ruling.id,
          decision: ruling.decision,
          rationale: ruling.rationale,
          created_by: ruling.createdBy.handle,
          created_at: ruling.createdAt.toISOString(),
        };
      }
    }
    
    return NextResponse.json({
      success: true,
      appeal: {
        id: appeal.id,
        target_type: appeal.targetType,
        target_id: appeal.targetId,
        target_details: targetDetails,
        status: appeal.status,
        rationale: appeal.rationale,
        opened_by: {
          id: appeal.openedBy.id,
          handle: appeal.openedBy.handle,
          tier: appeal.openedBy.tier,
          reputation: appeal.openedBy.reputation,
        },
        signature: appeal.signature,
        nonce: appeal.nonce,
        signed_at: appeal.signedAt.toISOString(),
        created_at: appeal.createdAt.toISOString(),
        resolved_at: appeal.resolvedAt?.toISOString() || null,
        rulings: appeal.rulings.map(r => ({
          id: r.id,
          decision: r.decision,
          rationale: r.rationale,
          created_by: {
            handle: r.createdBy.handle,
            tier: r.createdBy.tier,
          },
          created_at: r.createdAt.toISOString(),
        })),
      }
    });
    
  } catch (error) {
    console.error('Appeal fetch error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}
