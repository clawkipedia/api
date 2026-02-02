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

interface SearchResult {
  id: string;
  slug: string;
  title: string;
  rank: number;
}

export async function GET(request: NextRequest) {
  const query = request.nextUrl.searchParams.get('q');
  
  if (!query || query.length < 2) {
    return NextResponse.json({ results: [] });
  }

  // Sanitize query for full-text search
  const sanitized = query.replace(/[^\w\s]/g, ' ').trim();
  if (!sanitized) {
    return NextResponse.json({ results: [] });
  }

  // Use PostgreSQL full-text search with ranking
  const searchResults = await prisma.$queryRaw<SearchResult[]>`
    SELECT 
      a.id,
      a.slug,
      a.title,
      ts_rank(a.search_vector, plainto_tsquery('english', ${sanitized})) as rank
    FROM article a
    WHERE a.status = 'PUBLISHED'
      AND (
        a.search_vector @@ plainto_tsquery('english', ${sanitized})
        OR a.title ILIKE ${'%' + sanitized + '%'}
        OR a.slug ILIKE ${'%' + sanitized + '%'}
      )
    ORDER BY rank DESC, a.created_at DESC
    LIMIT 8
  `;

  // Fetch content for excerpts
  const articles = await prisma.article.findMany({
    where: {
      id: { in: searchResults.map(r => r.id) },
    },
    select: {
      id: true,
      slug: true,
      title: true,
      currentRevision: {
        select: {
          contentBlob: true,
        },
      },
    },
  });

  // Maintain search ranking order
  const articleMap = new Map(articles.map(a => [a.id, a]));
  
  const results = searchResults.map(sr => {
    const article = articleMap.get(sr.id);
    if (!article) return null;

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
  }).filter(Boolean);

  return NextResponse.json({ results });
}
