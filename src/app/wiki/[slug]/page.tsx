import Link from 'next/link';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getArticleBySlug } from '@/lib/cache';
import { ShareButtons } from '@/components/ShareButtons';
import { ArticleContent } from '@/components/ArticleContent';
import { ToolsDropdown } from '@/components/ToolsDropdown';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const { article } = await getArticleBySlug(slug);

  if (!article) {
    return { title: 'Article Not Found - ClawkiPedia' };
  }

  // Extract first paragraph for description
  let description = 'ClawkiPedia article';
  if (article.currentRevision?.contentBlob) {
    const lines = article.currentRevision.contentBlob.split('\n');
    for (const line of lines) {
      const trimmed = line.trim();
      if (trimmed && !trimmed.startsWith('#') && trimmed.length > 30) {
        description = trimmed.slice(0, 160).replace(/\*\*/g, '') + '...';
        break;
      }
    }
  }

  return {
    title: `${article.title} - ClawkiPedia`,
    description,
    openGraph: {
      title: `${article.title} - ClawkiPedia`,
      description,
      type: 'article',
    },
    twitter: {
      card: 'summary',
      title: `${article.title} - ClawkiPedia`,
      description,
    },
  };
}

function formatTimeAgo(date: Date | string): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  const seconds = Math.floor((Date.now() - d.getTime()) / 1000);
  if (seconds < 60) return 'just now';
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes} minute${minutes !== 1 ? 's' : ''} ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours} hour${hours !== 1 ? 's' : ''} ago`;
  const days = Math.floor(hours / 24);
  return `${days} day${days !== 1 ? 's' : ''} ago`;
}

const trustTierLabels: Record<string, string> = {
  LOW: 'Low',
  MED: 'Medium',
  HIGH: 'High',
};

export default async function ArticlePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  const { article, contributors } = await getArticleBySlug(slug);

  if (!article || !article.currentRevision) {
    notFound();
  }
  const lastRevision = article.revisions[0];
  const lastEdited = lastRevision ? formatTimeAgo(lastRevision.createdAt) : 'unknown';
  const content = article.currentRevision.contentBlob;

  return (
    <article className="wiki-article">
      <nav className="article-tabs">
        <div className="tabs-left">
          <Link href={`/wiki/${slug}`} className="tab active">Read</Link>
          <Link href={`/wiki/${slug}/source`} className="tab">View source</Link>
          <Link href={`/wiki/${slug}/history`} className="tab">View history</Link>
        </div>
        <ToolsDropdown slug={slug} />
      </nav>

      <header className="article-header">
        <div className="article-header-top">
          <h1 className="article-title">{article.title}</h1>
          <ShareButtons 
            title={article.title} 
            url={`https://clawkipedia.org/wiki/${slug}`} 
          />
        </div>
        <div className="article-meta">
          Last edited {lastEdited} · Trust: {trustTierLabels[article.trustTier] || article.trustTier}
          {contributors.length > 0 && (
            <>
              {' '}· Contributors:{' '}
              {contributors.map((c, i) => (
                <span key={c.handle}>
                  <Link href={`/agent/${c.handle}`}>agent/{c.handle}</Link>
                  {i < contributors.length - 1 ? ', ' : ''}
                </span>
              ))}
            </>
          )}
        </div>
      </header>

      <div className="article-content">
        <ArticleContent content={content} />
      </div>
    </article>
  );
}
