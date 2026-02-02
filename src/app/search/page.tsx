import Link from 'next/link';
import { prisma } from '@/lib/prisma';

interface SearchPageProps {
  searchParams: Promise<{ q?: string }>;
}

async function searchArticles(query: string) {
  if (!query || query.length < 2) return [];

  const articles = await prisma.article.findMany({
    where: {
      status: 'PUBLISHED',
      OR: [
        { title: { contains: query, mode: 'insensitive' } },
        { slug: { contains: query, mode: 'insensitive' } },
        {
          currentRevision: {
            contentBlob: { contains: query, mode: 'insensitive' },
          },
        },
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
    take: 50,
    orderBy: { createdAt: 'desc' },
  });

  return articles.map(article => {
    let excerpt = '';
    if (article.currentRevision?.contentBlob) {
      const content = article.currentRevision.contentBlob;
      const lowerContent = content.toLowerCase();
      const lowerQuery = query.toLowerCase();
      const index = lowerContent.indexOf(lowerQuery);
      
      if (index !== -1) {
        const start = Math.max(0, index - 60);
        const end = Math.min(content.length, index + query.length + 60);
        excerpt = (start > 0 ? '...' : '') + content.slice(start, end) + (end < content.length ? '...' : '');
      } else {
        const lines = content.split('\n');
        for (const line of lines) {
          const trimmed = line.trim();
          if (trimmed && !trimmed.startsWith('#') && trimmed.length > 30) {
            excerpt = trimmed.slice(0, 150) + (trimmed.length > 150 ? '...' : '');
            break;
          }
        }
      }
    }
    
    return { slug: article.slug, title: article.title, excerpt };
  });
}

export default async function SearchPage({ searchParams }: SearchPageProps) {
  const params = await searchParams;
  const query = params.q || '';
  const results = await searchArticles(query);

  return (
    <div className="search-page">
      <header className="search-header">
        <h1>Search Results</h1>
        {query && (
          <p className="search-query">
            {results.length} result{results.length !== 1 ? 's' : ''} for "<strong>{query}</strong>"
          </p>
        )}
      </header>

      {results.length > 0 ? (
        <div className="search-results-list">
          {results.map(result => (
            <Link key={result.slug} href={`/wiki/${result.slug}`} className="search-result-item">
              <h2 className="search-result-item-title">{result.title}</h2>
              {result.excerpt && (
                <p className="search-result-item-excerpt">{result.excerpt}</p>
              )}
            </Link>
          ))}
        </div>
      ) : query ? (
        <div className="search-empty">
          <p>No articles found matching your search.</p>
          <p>Try different keywords or <Link href="/articles">browse all articles</Link>.</p>
        </div>
      ) : (
        <div className="search-empty">
          <p>Enter a search term to find articles.</p>
        </div>
      )}
    </div>
  );
}
