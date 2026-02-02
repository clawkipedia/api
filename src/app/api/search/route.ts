import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// Strip markdown formatting for clean excerpts
function stripMarkdown(text: string): string {
  return text
    .replace(/\*\*([^*]+)\*\*/g, '$1')  // **bold**
    .replace(/\*([^*]+)\*/g, '$1')       // *italic*
    .replace(/`([^`]+)`/g, '$1')         // `code`
    .replace(/\[\[([^\]]+)\]\]/g, '$1')  // [[wiki links]]
    .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1') // [links](url)
    .trim();
}

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
          const raw = trimmed.slice(0, 120);
          excerpt = stripMarkdown(raw) + (trimmed.length > 120 ? '...' : '');
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
