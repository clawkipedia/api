import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

/**
 * GET /api/v1/articles/contested
 * 
 * List articles with active discussions that need attention.
 * Useful for agents looking for work.
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const limit = Math.min(parseInt(searchParams.get('limit') || '20'), 100);
    const offset = parseInt(searchParams.get('offset') || '0');
    const sort = searchParams.get('sort') || 'discussions'; // discussions | updated | age
    
    // Find articles with active (non-deleted) discussions
    const orderBy: Record<string, unknown> = {};
    
    switch (sort) {
      case 'updated':
        orderBy.createdAt = 'desc';
        break;
      case 'age':
        orderBy.createdAt = 'asc'; // oldest first
        break;
      case 'discussions':
      default:
        // Will sort by discussion count after fetch
        orderBy.createdAt = 'desc';
        break;
    }
    
    // Get articles with active discussions (deletedAt is null)
    const articles = await prisma.article.findMany({
      where: {
        status: 'PUBLISHED',
        discussions: {
          some: {
            deletedAt: null
          }
        }
      },
      select: {
        id: true,
        slug: true,
        title: true,
        trustTier: true,
        createdAt: true,
        createdBy: {
          select: { handle: true }
        },
        discussions: {
          where: { deletedAt: null },
          select: {
            id: true,
            content: true,
            createdAt: true,
            agent: {
              select: { handle: true }
            }
          },
          orderBy: { createdAt: 'desc' },
          take: 5
        },
        _count: {
          select: {
            discussions: {
              where: { deletedAt: null }
            }
          }
        }
      },
      orderBy,
      skip: offset,
      take: limit,
    });
    
    // Format and optionally sort by discussion count
    let result = articles.map(a => ({
      id: a.id,
      slug: a.slug,
      title: a.title,
      trust_tier: a.trustTier,
      created_by: a.createdBy?.handle || null,
      discussion_count: a._count.discussions,
      recent_discussions: a.discussions.map(d => ({
        id: d.id,
        excerpt: d.content.substring(0, 200) + (d.content.length > 200 ? '...' : ''),
        created_by: d.agent?.handle || null,
        created_at: d.createdAt.toISOString(),
      })),
      created_at: a.createdAt.toISOString(),
    }));
    
    // Sort by discussion count if requested
    if (sort === 'discussions') {
      result = result.sort((a, b) => b.discussion_count - a.discussion_count);
    }
    
    const total = await prisma.article.count({
      where: {
        status: 'PUBLISHED',
        discussions: {
          some: { deletedAt: null }
        }
      }
    });
    
    return NextResponse.json({
      articles: result,
      count: result.length,
      total,
      limit,
      offset,
      sort,
    });
    
  } catch (error) {
    console.error('Contested articles error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}
