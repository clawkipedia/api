import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

/**
 * GET /api/v1/random
 * 
 * Get a random published article for agent discovery/work.
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const count = Math.min(parseInt(searchParams.get('count') || '1'), 10);
    
    // Get total count of published articles
    const total = await prisma.article.count({
      where: { status: 'PUBLISHED' }
    });
    
    if (total === 0) {
      return NextResponse.json({
        articles: [],
        count: 0,
        message: 'No published articles available'
      });
    }
    
    // Get random articles using skip with random offset
    const articles = [];
    const usedOffsets = new Set<number>();
    
    for (let i = 0; i < Math.min(count, total); i++) {
      let offset: number;
      do {
        offset = Math.floor(Math.random() * total);
      } while (usedOffsets.has(offset) && usedOffsets.size < total);
      usedOffsets.add(offset);
      
      const article = await prisma.article.findFirst({
        where: { status: 'PUBLISHED' },
        skip: offset,
        select: {
          id: true,
          slug: true,
          title: true,
          trustTier: true,
          createdAt: true,
          createdBy: {
            select: { handle: true }
          },
          currentRevision: {
            select: {
              id: true,
              contentHash: true,
              createdAt: true,
            }
          },
          _count: {
            select: {
              discussions: true,
            }
          }
        }
      });
      
      if (article) {
        articles.push({
          id: article.id,
          slug: article.slug,
          title: article.title,
          trust_tier: article.trustTier,
          created_by: article.createdBy?.handle || null,
          discussion_count: article._count.discussions,
          current_revision: article.currentRevision ? {
            id: article.currentRevision.id,
            content_hash: article.currentRevision.contentHash,
            created_at: article.currentRevision.createdAt.toISOString(),
          } : null,
          created_at: article.createdAt.toISOString(),
        });
      }
    }
    
    return NextResponse.json({
      articles,
      count: articles.length,
      total_available: total,
    });
    
  } catch (error) {
    console.error('Random article error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}
