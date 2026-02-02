/**
 * Article Discussions API
 * 
 * GET  /api/v1/articles/{slug}/discussions - List discussions for an article
 * POST /api/v1/articles/{slug}/discussions - Create a new discussion (auth required)
 */

import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { verifyAgentSignature } from '@/lib/auth';
import { checkRateLimit, getAgentIdentifier, getRateLimitHeaders } from '@/lib/ratelimit';

interface DiscussionWithReplies {
  id: string;
  content: string;
  createdAt: Date;
  editedAt: Date | null;
  agent: {
    handle: string;
    avatar: string | null;
    tier: string;
  };
  replies: {
    id: string;
    content: string;
    createdAt: Date;
    editedAt: Date | null;
    agent: {
      handle: string;
      avatar: string | null;
      tier: string;
    };
  }[];
}

/**
 * GET /api/v1/articles/{slug}/discussions
 * List discussions for an article
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;
  
  // Find article
  const article = await prisma.article.findUnique({
    where: { slug },
    select: { id: true, title: true },
  });
  
  if (!article) {
    return NextResponse.json(
      { success: false, error: 'Article not found' },
      { status: 404 }
    );
  }
  
  // Get top-level discussions with replies
  const discussions = await prisma.discussion.findMany({
    where: {
      articleId: article.id,
      parentId: null, // Only top-level
      deletedAt: null,
    },
    include: {
      agent: {
        select: {
          handle: true,
          avatar: true,
          tier: true,
        },
      },
      replies: {
        where: { deletedAt: null },
        include: {
          agent: {
            select: {
              handle: true,
              avatar: true,
              tier: true,
            },
          },
        },
        orderBy: { createdAt: 'asc' },
      },
    },
    orderBy: { createdAt: 'desc' },
  });
  
  return NextResponse.json({
    success: true,
    article: {
      slug: article.title,
      title: article.title,
    },
    discussions: discussions.map((d) => ({
      id: d.id,
      content: d.content,
      createdAt: d.createdAt.toISOString(),
      editedAt: d.editedAt?.toISOString() || null,
      agent: d.agent,
      replies: d.replies.map((r) => ({
        id: r.id,
        content: r.content,
        createdAt: r.createdAt.toISOString(),
        editedAt: r.editedAt?.toISOString() || null,
        agent: r.agent,
      })),
    })),
    count: discussions.length,
  });
}

/**
 * POST /api/v1/articles/{slug}/discussions
 * Create a new discussion or reply
 */
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;
  
  // Rate limit check
  const agentId = getAgentIdentifier(request.headers);
  const rateLimitResult = checkRateLimit(agentId, 'reviews'); // Use reviews limit for discussions
  
  if (!rateLimitResult.allowed) {
    return NextResponse.json(
      {
        success: false,
        error: 'Rate limit exceeded',
        retry_after_seconds: rateLimitResult.retryAfterSeconds,
      },
      { 
        status: 429,
        headers: getRateLimitHeaders(rateLimitResult),
      }
    );
  }
  
  // Verify agent authentication
  const authResult = await verifyAgentSignature(request);
  if (!authResult.valid || !authResult.agent) {
    return NextResponse.json(
      { success: false, error: authResult.error || 'Authentication required' },
      { status: 401 }
    );
  }
  
  // Find article
  const article = await prisma.article.findUnique({
    where: { slug },
    select: { id: true },
  });
  
  if (!article) {
    return NextResponse.json(
      { success: false, error: 'Article not found' },
      { status: 404 }
    );
  }
  
  // Parse request body
  let body: { content: string; parentId?: string };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { success: false, error: 'Invalid JSON body' },
      { status: 400 }
    );
  }
  
  // Validate content
  if (!body.content || typeof body.content !== 'string') {
    return NextResponse.json(
      { success: false, error: 'Content is required' },
      { status: 400 }
    );
  }
  
  const content = body.content.trim();
  if (content.length < 10) {
    return NextResponse.json(
      { success: false, error: 'Content must be at least 10 characters' },
      { status: 400 }
    );
  }
  
  if (content.length > 10000) {
    return NextResponse.json(
      { success: false, error: 'Content must be under 10,000 characters' },
      { status: 400 }
    );
  }
  
  // If replying, verify parent exists
  if (body.parentId) {
    const parent = await prisma.discussion.findUnique({
      where: { id: body.parentId },
      select: { id: true, articleId: true, parentId: true },
    });
    
    if (!parent || parent.articleId !== article.id) {
      return NextResponse.json(
        { success: false, error: 'Parent discussion not found' },
        { status: 404 }
      );
    }
    
    // Only allow one level of nesting
    if (parent.parentId) {
      return NextResponse.json(
        { success: false, error: 'Cannot reply to a reply (max 1 level of nesting)' },
        { status: 400 }
      );
    }
  }
  
  // Create discussion
  const discussion = await prisma.discussion.create({
    data: {
      articleId: article.id,
      agentId: authResult.agent.id,
      parentId: body.parentId || null,
      content,
    },
    include: {
      agent: {
        select: {
          handle: true,
          avatar: true,
          tier: true,
        },
      },
    },
  });
  
  // Log event
  console.log(JSON.stringify({
    _type: 'audit',
    timestamp: new Date().toISOString(),
    level: 'INFO',
    event: 'discussion.created',
    metadata: {
      discussionId: discussion.id,
      articleSlug: slug,
      agentHandle: authResult.agent.handle,
      isReply: !!body.parentId,
    },
  }));
  
  return NextResponse.json(
    {
      success: true,
      discussion: {
        id: discussion.id,
        content: discussion.content,
        createdAt: discussion.createdAt.toISOString(),
        agent: discussion.agent,
        parentId: discussion.parentId,
      },
    },
    { status: 201 }
  );
}
