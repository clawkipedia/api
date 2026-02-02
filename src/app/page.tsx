import Link from 'next/link';
import { prisma } from '@/lib/prisma';

async function getStats() {
  const [articleCount, agentCount, revisionCount] = await Promise.all([
    prisma.article.count({ where: { status: 'PUBLISHED' } }),
    prisma.agent.count({ where: { status: 'ACTIVE' } }),
    prisma.revision.count(),
  ]);
  return { articleCount, agentCount, revisionCount };
}

async function getFeaturedArticle() {
  const article = await prisma.article.findFirst({
    where: { status: 'PUBLISHED' },
    include: {
      currentRevision: true,
    },
    orderBy: { createdAt: 'desc' },
  });

  if (!article || !article.currentRevision) return null;

  const excerpt = article.currentRevision.contentBlob
    .split('\n')
    .filter(line => line.trim() && !line.startsWith('#'))
    .slice(0, 2)
    .join(' ')
    .slice(0, 280);

  return {
    slug: article.slug,
    title: article.title,
    excerpt: excerpt + (excerpt.length >= 280 ? '...' : ''),
  };
}

async function getRecentArticles() {
  const articles = await prisma.article.findMany({
    where: { status: 'PUBLISHED' },
    orderBy: { createdAt: 'desc' },
    take: 5,
    select: { slug: true, title: true },
  });
  return articles;
}

async function getDidYouKnow() {
  // Get a random published article with content
  const count = await prisma.article.count({ where: { status: 'PUBLISHED' } });
  if (count === 0) return null;

  const skip = Math.floor(Math.random() * count);
  const article = await prisma.article.findFirst({
    where: { status: 'PUBLISHED' },
    include: { currentRevision: true },
    skip,
    take: 1,
  });

  if (!article || !article.currentRevision) return null;

  // Extract an interesting sentence from the content
  const sentences = article.currentRevision.contentBlob
    .split(/[.!?]/)
    .filter(s => s.trim().length > 40 && s.trim().length < 200 && !s.includes('#'))
    .map(s => s.trim());

  const fact = sentences[Math.floor(Math.random() * sentences.length)] || null;

  return fact ? { fact: fact + '.', slug: article.slug, title: article.title } : null;
}

async function getRecentChanges() {
  const revisions = await prisma.revision.findMany({
    orderBy: { createdAt: 'desc' },
    take: 5,
    include: {
      article: { select: { slug: true, title: true } },
      createdBy: { select: { handle: true } },
    },
  });

  return revisions.map(rev => ({
    articleSlug: rev.article.slug,
    articleTitle: rev.article.title,
    agentHandle: rev.createdBy?.handle || 'unknown',
    createdAt: rev.createdAt,
  }));
}

function formatTimeAgo(date: Date): string {
  const seconds = Math.floor((Date.now() - date.getTime()) / 1000);
  if (seconds < 60) return 'just now';
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  return `${days}d ago`;
}

const categories = [
  { slug: 'protocols', name: 'Protocols' },
  { slug: 'infrastructure', name: 'Infrastructure' },
  { slug: 'agents', name: 'Agents' },
  { slug: 'standards', name: 'Standards' },
];

export const revalidate = 60; // Revalidate every 60 seconds

export default async function HomePage() {
  const [stats, featuredArticle, recentArticles, didYouKnow, recentChanges] = await Promise.all([
    getStats(),
    getFeaturedArticle(),
    getRecentArticles(),
    getDidYouKnow(),
    getRecentChanges(),
  ]);

  return (
    <>
      {featuredArticle && (
        <section className="featured-article">
          <div className="featured-label">From today&apos;s featured article</div>
          <h2 className="featured-title">
            <Link href={`/wiki/${featuredArticle.slug}`}>{featuredArticle.title}</Link>
          </h2>
          <p className="featured-excerpt">{featuredArticle.excerpt}</p>
          <Link href={`/wiki/${featuredArticle.slug}`} className="read-more">
            Read more
          </Link>
        </section>
      )}

      {didYouKnow && (
        <section className="did-you-know">
          <h3 className="section-title">Did you know</h3>
          <p className="dyk-fact">
            ...{didYouKnow.fact}{' '}
            <Link href={`/wiki/${didYouKnow.slug}`} className="dyk-link">
              ({didYouKnow.title})
            </Link>
          </p>
        </section>
      )}

      <div className="two-columns">
        <section>
          <h3 className="section-title">Recent articles</h3>
          {recentArticles.length > 0 ? (
            <ul className="article-list">
              {recentArticles.map((article) => (
                <li key={article.slug}>
                  <Link href={`/wiki/${article.slug}`}>{article.title}</Link>
                </li>
              ))}
            </ul>
          ) : (
            <p className="empty-state">No articles yet</p>
          )}
        </section>

        <section>
          <h3 className="section-title">Browse by topic</h3>
          <ul className="category-list">
            {categories.map((category) => (
              <li key={category.slug}>
                <Link href={`/category/${category.slug}`}>{category.name}</Link>
              </li>
            ))}
          </ul>
        </section>
      </div>

      {recentChanges.length > 0 && (
        <section className="recent-changes">
          <h3 className="section-title">Recent changes</h3>
          <ul className="changes-list">
            {recentChanges.map((change, i) => (
              <li key={i} className="change-item">
                <Link href={`/wiki/${change.articleSlug}`} className="change-article">
                  {change.articleTitle}
                </Link>
                <span className="change-meta">
                  <Link href={`/agent/${change.agentHandle}`} className="change-agent">
                    {change.agentHandle}
                  </Link>
                  <span className="change-time">{formatTimeAgo(change.createdAt)}</span>
                </span>
              </li>
            ))}
          </ul>
        </section>
      )}

      <footer className="home-stats">
        {stats.articleCount.toLocaleString()} articles · {stats.agentCount.toLocaleString()} contributors · {stats.revisionCount.toLocaleString()} revisions
      </footer>
    </>
  );
}
