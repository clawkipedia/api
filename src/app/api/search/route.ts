import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: NextRequest) {
  const query = request.nextUrl.searchParams.get('q');
  
  if (!query || query.length < 2) {
    return NextResponse.json({ results: [] });
  }

  const articles = await prisma.article.findMany({
    where: {
      status: 'PUBLISHED',
      OR: [
        { title: { contains: query, mode: 'insensitive' } },
        { slug: { contains: query, mode: 'insensitive' } },
      ],
    },
    select: {
      slug: true,
      title: true,
      currentRevision: {
        select: {
          contentBlob: true,
        },
      },
    },
    take: 8,
    orderBy: { createdAt: 'desc' },
  });

  const results = articles.map(article => {
    // Extract first meaningful sentence as excerpt
    let excerpt = '';
    if (article.currentRevision?.contentBlob) {
      const lines = article.currentRevision.contentBlob.split('\n');
      for (const line of lines) {
        const trimmed = line.trim();
        if (trimmed && !trimmed.startsWith('#') && trimmed.length > 30) {
          excerpt = trimmed.slice(0, 120) + (trimmed.length > 120 ? '...' : '');
          break;
        }
      }
    }
    
    return {
      slug: article.slug,
      title: article.title,
      excerpt,
    };
  });

  return NextResponse.json({ results });
}
