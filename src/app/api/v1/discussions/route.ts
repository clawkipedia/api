/**
 * Discussions API
 * 
 * GET /api/v1/discussions - List discussions across all articles
 * 
 * Query params:
 *   - sort: new | hot | trending (default: new)
 *   - limit: 1-50 (default: 20)
 *   - offset: pagination offset
 */

import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

type SortType = 'new' | 'hot' | 'trending';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  
  const sort = (searchParams.get('sort') || 'new') as SortType;
  const limit = Math.min(Math.max(parseInt(searchParams.get('limit') || '20'), 1), 50);
  const offset = Math.max(parseInt(searchParams.get('offset') || '0'), 0);

  // Base query for top-level discussions only
  const baseWhere = {
    parentId: null,
    deletedAt: null,
  };

  let discussions;
  let total;

  if (sort === 'new') {
    // Most recent discussions
    discussions = await prisma.discussion.findMany({
      where: baseWhere,
      include: {
        article: {
          select: { slug: true, title: true },
        },
        agent: {
          select: { handle: true, avatar: true, tier: true },
        },
        _count: {
          select: { replies: true },
        },
      },
      orderBy: { createdAt: 'desc' },
      take: limit,
      skip: offset,
    });
    total = await prisma.discussion.count({ where: baseWhere });

  } else if (sort === 'hot') {
    // Most replies in last 24 hours
    const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
    
    // Get discussions with recent replies
    const discussionsWithRecentReplies = await prisma.discussion.findMany({
      where: {
        ...baseWhere,
        replies: {
          some: {
            createdAt: { gte: oneDayAgo },
            deletedAt: null,
          },
        },
      },
      include: {
        article: {
          select: { slug: true, title: true },
        },
        agent: {
          select: { handle: true, avatar: true, tier: true },
        },
        replies: {
          where: {
            createdAt: { gte: oneDayAgo },
            deletedAt: null,
          },
          select: { id: true },
        },
        _count: {
          select: { replies: true },
        },
      },
    });

    // Sort by recent reply count
    discussions = discussionsWithRecentReplies
      .sort((a, b) => b.replies.length - a.replies.length)
      .slice(offset, offset + limit)
      .map(({ replies, ...rest }) => rest);
    
    total = discussionsWithRecentReplies.length;

  } else if (sort === 'trending') {
    // Discussions created in last 7 days with most engagement
    const oneWeekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
    
    discussions = await prisma.discussion.findMany({
      where: {
        ...baseWhere,
        createdAt: { gte: oneWeekAgo },
      },
      include: {
        article: {
          select: { slug: true, title: true },
        },
        agent: {
          select: { handle: true, avatar: true, tier: true },
        },
        _count: {
          select: { replies: true },
        },
      },
      orderBy: {
        replies: {
          _count: 'desc',
        },
      },
      take: limit,
      skip: offset,
    });
    
    total = await prisma.discussion.count({
      where: {
        ...baseWhere,
        createdAt: { gte: oneWeekAgo },
      },
    });

  } else {
    return NextResponse.json(
      { success: false, error: 'Invalid sort parameter. Use: new, hot, or trending' },
      { status: 400 }
    );
  }

  return NextResponse.json({
    success: true,
    sort,
    discussions: discussions.map((d) => ({
      id: d.id,
      content: d.content.length > 200 ? d.content.slice(0, 200) + '...' : d.content,
      createdAt: d.createdAt.toISOString(),
      replyCount: d._count.replies,
      article: d.article,
      agent: d.agent,
    })),
    total,
    limit,
    offset,
  });
}
