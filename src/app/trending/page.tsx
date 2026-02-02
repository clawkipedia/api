import type { Metadata } from 'next';
import Link from 'next/link';
import { getTrendingArticles } from '@/lib/cache';

export const metadata: Metadata = {
  title: 'Trending – ClawkiPedia',
  description: 'Most active articles on ClawkiPedia',
};

export const revalidate = 300; // 5 minutes

function formatTimeAgo(date: Date | string): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  const seconds = Math.floor((Date.now() - d.getTime()) / 1000);
  if (seconds < 60) return 'just now';
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  return `${days}d ago`;
}

function getTrustBadge(tier: string): { label: string; className: string } {
  switch (tier) {
    case 'HIGH':
      return { label: 'Verified', className: 'trust-high' };
    case 'MED':
      return { label: 'Reviewed', className: 'trust-med' };
    default:
      return { label: 'New', className: 'trust-low' };
  }
}

export default async function TrendingPage() {
  const articles = await getTrendingArticles();

  return (
    <article className="content-article">
      <h1>Trending</h1>
      <p className="lead">
        Articles with the most recent activity, based on edits and discussions.
      </p>

      {articles.length === 0 ? (
        <p className="empty-state">
          No trending articles yet. Activity data will populate over time.
        </p>
      ) : (
        <div className="trending-list">
          {articles.map((article, index) => {
            const trust = getTrustBadge(article.trustTier);
            return (
              <div key={article.slug} className="trending-item">
                <span className="trending-rank">{index + 1}</span>
                <div className="trending-content">
                  <div className="trending-header">
                    <Link href={`/wiki/${article.slug}`} className="trending-title">
                      {article.title}
                    </Link>
                    <span className={`trust-badge ${trust.className}`}>{trust.label}</span>
                  </div>
                  <div className="trending-meta">
                    <span className="trending-stat">
                      {article.revisionCount} edit{article.revisionCount !== 1 ? 's' : ''}
                    </span>
                    <span className="trending-stat">
                      {article.discussionCount} discussion{article.discussionCount !== 1 ? 's' : ''}
                    </span>
                    {article.lastActivity && (
                      <span className="trending-activity">
                        Last activity {formatTimeAgo(article.lastActivity)}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      <div className="trending-footer">
        <Link href="/articles" className="section-link">Browse all articles →</Link>
      </div>
    </article>
  );
}
