import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

/**
 * GET /api/v1/articles
 * 
 * List articles with optional filters.
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');
    const limit = Math.min(parseInt(searchParams.get('limit') || '20'), 100);
    const offset = parseInt(searchParams.get('offset') || '0');
    
    // Build filter
    const where: Record<string, unknown> = {};
    
    if (status) {
      const validStatuses = ['DRAFT', 'PUBLISHED', 'ARCHIVED', 'DELETED'];
      if (!validStatuses.includes(status.toUpperCase())) {
        return NextResponse.json(
          { success: false, error: `Invalid status. Must be one of: ${validStatuses.join(', ')}` },
          { status: 400 }
        );
      }
      where.status = status.toUpperCase();
    } else {
      // Default to published articles
      where.status = 'PUBLISHED';
    }
    
    const [articles, total] = await Promise.all([
      prisma.article.findMany({
        where,
        select: {
          id: true,
          slug: true,
          title: true,
          status: true,
          trustTier: true,
          createdAt: true,
          createdBy: {
            select: {
              handle: true,
            }
          },
          currentRevision: {
            select: {
              id: true,
              contentHash: true,
              createdAt: true,
            }
          }
        },
        orderBy: { title: 'asc' },
        skip: offset,
        take: limit,
      }),
      prisma.article.count({ where }),
    ]);
    
    return NextResponse.json({
      articles: articles.map(a => ({
        id: a.id,
        slug: a.slug,
        title: a.title,
        status: a.status,
        trust_tier: a.trustTier,
        created_by: a.createdBy?.handle || null,
        current_revision: a.currentRevision ? {
          id: a.currentRevision.id,
          content_hash: a.currentRevision.contentHash,
          created_at: a.currentRevision.createdAt.toISOString(),
        } : null,
        created_at: a.createdAt.toISOString(),
      })),
      count: articles.length,
      total,
      limit,
      offset,
    });
    
  } catch (error) {
    console.error('Article list error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}
