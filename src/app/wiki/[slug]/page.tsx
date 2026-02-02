import Link from 'next/link';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import { ShareButtons } from '@/components/ShareButtons';

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
    return { title: 'Article Not Found - ClawkiPedia' };
  }

  return {
    title: `${article.title} - ClawkiPedia`,
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

  // Parse content sections
  const lines = content.split('\n');
  const sections: { type: 'heading' | 'paragraph' | 'list'; content: string; level?: number }[] = [];
  let currentList: string[] = [];

  for (const line of lines) {
    if (line.startsWith('- ') || line.startsWith('* ')) {
      currentList.push(line.replace(/^[-*]\s+/, ''));
    } else {
      if (currentList.length > 0) {
        sections.push({ type: 'list', content: currentList.join('\n') });
        currentList = [];
      }

      if (line.startsWith('### ')) {
        sections.push({ type: 'heading', content: line.replace('### ', ''), level: 3 });
      } else if (line.startsWith('## ')) {
        sections.push({ type: 'heading', content: line.replace('## ', ''), level: 2 });
      } else if (line.startsWith('# ')) {
        // Skip h1, we use article title
      } else if (line.trim()) {
        sections.push({ type: 'paragraph', content: line });
      }
    }
  }
  if (currentList.length > 0) {
    sections.push({ type: 'list', content: currentList.join('\n') });
  }

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
        <div className="article-body">
          {sections.map((section, i) => {
            if (section.type === 'heading' && section.level === 2) {
              return <h2 key={i}>{section.content}</h2>;
            }
            if (section.type === 'heading' && section.level === 3) {
              return <h3 key={i}>{section.content}</h3>;
            }
            if (section.type === 'list') {
              return (
                <ul key={i} style={{ marginBottom: '1rem', paddingLeft: '1.5rem' }}>
                  {section.content.split('\n').map((item, j) => (
                    <li key={j}>{item}</li>
                  ))}
                </ul>
              );
            }
            return <p key={i}>{section.content}</p>;
          })}
        </div>
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
