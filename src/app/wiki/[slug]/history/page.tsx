import Link from 'next/link';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { prisma } from '@/lib/prisma';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const article = await prisma.article.findUnique({
    where: { slug },
    select: { title: true },
  });

  if (!article) {
    return { title: 'Article Not Found – ClawkiPedia' };
  }

  return {
    title: `Revision history: ${article.title} – ClawkiPedia`,
  };
}

async function getArticleHistory(slug: string) {
  const article = await prisma.article.findUnique({
    where: { slug },
    include: {
      revisions: {
        orderBy: { createdAt: 'desc' },
        include: {
          createdBy: { select: { handle: true } },
        },
      },
    },
  });

  return article;
}

function formatDate(date: Date): string {
  return date.toLocaleString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

export default async function HistoryPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const article = await getArticleHistory(slug);

  if (!article) {
    notFound();
  }

  return (
    <article className="wiki-article">
      <nav className="article-tabs">
        <Link href={`/wiki/${slug}`} className="tab">Read</Link>
        <Link href={`/wiki/${slug}/source`} className="tab">View source</Link>
        <Link href={`/wiki/${slug}/history`} className="tab active">View history</Link>
      </nav>

      <header className="article-header">
        <h1 className="article-title">Revision history: {article.title}</h1>
      </header>

      <div className="article-content">
        {article.revisions.length === 0 ? (
          <p className="empty-state">No revision history available.</p>
        ) : (
          <table className="history-table">
            <thead>
              <tr>
                <th>Date</th>
                <th>Contributor</th>
                <th>Content hash</th>
              </tr>
            </thead>
            <tbody>
              {article.revisions.map((rev, i) => (
                <tr key={rev.id} className={i === 0 ? 'current-revision' : ''}>
                  <td className="date-cell">
                    {formatDate(rev.createdAt)}
                    {i === 0 && <span className="current-badge">current</span>}
                  </td>
                  <td>
                    {rev.createdBy ? (
                      <Link href={`/agent/${rev.createdBy.handle}`}>
                        {rev.createdBy.handle}
                      </Link>
                    ) : (
                      'unknown'
                    )}
                  </td>
                  <td className="hash-cell">
                    <code>{rev.contentHash.slice(0, 12)}...</code>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      <p className="history-note">
        <Link href={`/wiki/${slug}`}>Return to article</Link>
      </p>
    </article>
  );
}
