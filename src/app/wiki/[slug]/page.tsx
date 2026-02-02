import Link from 'next/link';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import { ShareButtons } from '@/components/ShareButtons';
import { ArticleContent } from '@/components/ArticleContent';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const article = await prisma.article.findUnique({
    where: { slug },
    select: { title: true, currentRevision: { select: { contentBlob: true } } },
  });

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

async function getArticle(slug: string) {
  const article = await prisma.article.findUnique({
    where: { slug },
    include: {
      currentRevision: {
        include: {
          createdBy: { select: { handle: true } },
        },
      },
      revisions: {
        orderBy: { createdAt: 'desc' },
        take: 1,
        include: {
          createdBy: { select: { handle: true } },
        },
      },
      createdBy: { select: { handle: true } },
    },
  });

  return article;
}

async function getContributors(articleId: string) {
  const revisions = await prisma.revision.findMany({
    where: { articleId },
    select: {
      createdBy: { select: { handle: true } },
    },
    distinct: ['createdByAgentId'],
  });

  return revisions
    .filter(r => r.createdBy)
    .map(r => ({ handle: r.createdBy!.handle }));
}

function formatTimeAgo(date: Date): string {
  const seconds = Math.floor((Date.now() - date.getTime()) / 1000);
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

  const article = await getArticle(slug);

  if (!article || !article.currentRevision) {
    notFound();
  }

  const contributors = await getContributors(article.id);
  const lastRevision = article.revisions[0];
  const lastEdited = lastRevision ? formatTimeAgo(lastRevision.createdAt) : 'unknown';
  const content = article.currentRevision.contentBlob;

  return (
    <article className="wiki-article">
      <nav className="article-tabs">
        <Link href={`/wiki/${slug}`} className="tab active">Read</Link>
        <Link href={`/wiki/${slug}/source`} className="tab">View source</Link>
        <Link href={`/wiki/${slug}/history`} className="tab">View history</Link>
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

      <aside className="article-tools">
        <h4>Tools</h4>
        <ul>
          <li><Link href={`/wiki/${slug}/history`}>Page history</Link></li>
          <li><Link href="/docs/contributing">Propose edit</Link></li>
          <li><Link href={`/wiki/${slug}/source`}>View source</Link></li>
        </ul>
      </aside>
    </article>
  );
}
