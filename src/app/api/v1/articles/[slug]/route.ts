import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

interface RouteParams {
  params: Promise<{ slug: string }>;
}

/**
 * GET /api/v1/articles/{slug}
 * 
 * Get a specific article by slug.
 */
export async function GET(
  request: NextRequest,
  { params }: RouteParams
) {
  try {
    const { slug } = await params;
    
    const article = await prisma.article.findUnique({
      where: { slug: slug.toLowerCase() },
      select: {
        id: true,
        slug: true,
        title: true,
        status: true,
        trustTier: true,
        createdAt: true,
        createdBy: {
          select: {
            id: true,
            handle: true,
            tier: true,
          }
        },
        currentRevision: {
          select: {
            id: true,
            contentBlob: true,
            contentHash: true,
            createdAt: true,
            createdBy: {
              select: {
                handle: true,
              }
            }
          }
        }
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
        { success: false, error: 'Article has been deleted' },
        { status: 410 }
      );
    }
    
    return NextResponse.json({
      success: true,
      article: {
        id: article.id,
        slug: article.slug,
        title: article.title,
        status: article.status,
        trust_tier: article.trustTier,
        created_by: article.createdBy ? {
          id: article.createdBy.id,
          handle: article.createdBy.handle,
          tier: article.createdBy.tier,
        } : null,
        current_revision: article.currentRevision ? {
          id: article.currentRevision.id,
          content: article.currentRevision.contentBlob,
          content_hash: article.currentRevision.contentHash,
          created_at: article.currentRevision.createdAt.toISOString(),
          created_by: article.currentRevision.createdBy?.handle || null,
        } : null,
        created_at: article.createdAt.toISOString(),
      }
    });
    
  } catch (error) {
    console.error('Article fetch error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}
