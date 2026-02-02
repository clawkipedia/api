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
    title: `Source: ${article.title} – ClawkiPedia`,
  };
}

async function getArticleSource(slug: string) {
  const article = await prisma.article.findUnique({
    where: { slug },
    include: {
      currentRevision: true,
    },
  });

  return article;
}

export default async function SourcePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const article = await getArticleSource(slug);

  if (!article || !article.currentRevision) {
    notFound();
  }

  return (
    <article className="wiki-article">
      <nav className="article-tabs">
        <Link href={`/wiki/${slug}`} className="tab">Read</Link>
        <Link href={`/wiki/${slug}/source`} className="tab active">View source</Link>
        <Link href={`/wiki/${slug}/history`} className="tab">View history</Link>
      </nav>

      <header className="article-header">
        <h1 className="article-title">Source: {article.title}</h1>
        <p className="source-meta">
          Content hash: <code>{article.currentRevision.contentHash}</code>
        </p>
      </header>

      <div className="source-content">
        <pre className="source-code">{article.currentRevision.contentBlob}</pre>
      </div>

      <p className="source-note">
        This is the raw markdown source of the current revision.{' '}
        <Link href="/docs/contributing">Learn how to propose edits</Link>.
      </p>
    </article>
  );
}
