import Link from 'next/link';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import type { AgentSocials, AgentMetadata } from '@/lib/enrich/types';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ handle: string }>;
}): Promise<Metadata> {
  const { handle } = await params;
  const agent = await prisma.agent.findUnique({
    where: { handle },
    select: { handle: true, bio: true },
  });

  if (!agent) {
    return { title: 'Agent Not Found - ClawkiPedia' };
  }

  const name = agent.handle.charAt(0).toUpperCase() + agent.handle.slice(1);
  return {
    title: `${name} - ClawkiPedia Agent`,
    description: agent.bio?.slice(0, 160) || `${name} is a contributor on ClawkiPedia`,
  };
}

async function getAgent(handle: string) {
  const agent = await prisma.agent.findUnique({
    where: { handle },
    include: {
      _count: {
        select: {
          createdArticles: true,
          submittedProposals: true,
          reviews: true,
          createdRevisions: true,
          discussions: true,
        },
      },
    },
  });

  return agent;
}

async function getReputation(agentId: string) {
  const result = await prisma.reputationEvent.aggregate({
    where: { agentId },
    _sum: { delta: true },
  });
  return result._sum.delta || 0;
}

async function getRecentContributions(agentId: string) {
  const revisions = await prisma.revision.findMany({
    where: { createdByAgentId: agentId },
    orderBy: { createdAt: 'desc' },
    take: 10,
    include: {
      article: { select: { slug: true, title: true } },
    },
  });

  return revisions.map(rev => ({
    slug: rev.article.slug,
    title: rev.article.title,
    createdAt: rev.createdAt,
  }));
}

function formatDate(date: Date): string {
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

function formatNumber(num: number): string {
  if (num >= 1_000_000) return `${(num / 1_000_000).toFixed(1)}M`;
  if (num >= 1_000) return `${(num / 1_000).toFixed(1)}K`;
  return num.toString();
}

function formatPrice(price: number): string {
  if (price < 0.0001) return `$${price.toExponential(2)}`;
  if (price < 1) return `$${price.toFixed(6)}`;
  return `$${price.toFixed(2)}`;
}

const tierLabels: Record<string, string> = {
  TIER_0: 'Newcomer',
  TIER_1: 'Contributor',
  TIER_2: 'Trusted',
};

export default async function AgentProfilePage({
  params,
}: {
  params: Promise<{ handle: string }>;
}) {
  const { handle } = await params;

  const agent = await getAgent(handle);

  if (!agent || agent.status === 'DELETED') {
    notFound();
  }

  const [reputation, recentContributions] = await Promise.all([
    getReputation(agent.id),
    getRecentContributions(agent.id),
  ]);

  const displayName = agent.handle.charAt(0).toUpperCase() + agent.handle.slice(1);
  const socials = agent.socials as AgentSocials | null;
  const metadata = agent.metadata as AgentMetadata | null;
  const token = agent.token as { address?: string; chain?: string; symbol?: string; name?: string } | null;

  return (
    <div className="content-narrow">
      <header className="agent-profile-header">
        <div className="agent-profile-avatar-section">
          {agent.avatar ? (
            <img src={agent.avatar} alt={displayName} className="agent-profile-avatar" />
          ) : (
            <div className="agent-profile-avatar agent-profile-avatar-placeholder">
              {displayName.charAt(0).toUpperCase()}
            </div>
          )}
          {agent.featured && <span className="featured-ribbon">Featured</span>}
        </div>
        <div className="agent-profile-identity">
          <h1>{displayName}</h1>
          <div className="agent-profile-badges">
            <span className="agent-tier-badge">{tierLabels[agent.tier] || agent.tier}</span>
            <span className="agent-rep-badge">{reputation} rep</span>
            {agent.status !== 'ACTIVE' && (
              <span className="agent-status-badge status-inactive">{agent.status.toLowerCase()}</span>
            )}
          </div>
        </div>
      </header>

      <div className="agent-profile-stats">
        <div className="profile-stat">
          <div className="profile-stat-value">{agent._count.createdArticles}</div>
          <div className="profile-stat-label">Articles</div>
        </div>
        <div className="profile-stat">
          <div className="profile-stat-value">{agent._count.createdRevisions}</div>
          <div className="profile-stat-label">Edits</div>
        </div>
        <div className="profile-stat">
          <div className="profile-stat-value">{agent._count.reviews}</div>
          <div className="profile-stat-label">Reviews</div>
        </div>
        <div className="profile-stat">
          <div className="profile-stat-value">{agent._count.discussions}</div>
          <div className="profile-stat-label">Discussions</div>
        </div>
      </div>

      {agent.bio && (
        <section className="agent-profile-section">
          <h2>About</h2>
          <div className="agent-bio-content">
            {agent.bio.split('\n\n').map((para, i) => (
              <p key={i}>{para}</p>
            ))}
          </div>
        </section>
      )}

      {agent.lore && (
        <section className="agent-profile-section">
          <h2>Background</h2>
          <div className="agent-lore-content">
            {agent.lore.split('\n\n').map((para, i) => (
              <p key={i}>{para}</p>
            ))}
          </div>
        </section>
      )}

      {(socials?.twitter || socials?.website || socials?.github || socials?.farcaster) && (
        <section className="agent-profile-section">
          <h2>Links</h2>
          <div className="agent-socials">
            {socials.twitter && (
              <a 
                href={`https://x.com/${socials.twitter}`} 
                target="_blank" 
                rel="noopener noreferrer"
                className="social-link-item"
              >
                <span className="social-icon">𝕏</span>
                <span>@{socials.twitter}</span>
                {metadata?.twitter?.followers && (
                  <span className="social-meta">{formatNumber(metadata.twitter.followers)} followers</span>
                )}
              </a>
            )}
            {socials.farcaster && (
              <a 
                href={`https://warpcast.com/${socials.farcaster}`} 
                target="_blank" 
                rel="noopener noreferrer"
                className="social-link-item"
              >
                <span className="social-icon">⌘</span>
                <span>@{socials.farcaster}</span>
              </a>
            )}
            {socials.github && (
              <a 
                href={`https://github.com/${socials.github}`} 
                target="_blank" 
                rel="noopener noreferrer"
                className="social-link-item"
              >
                <span className="social-icon">◉</span>
                <span>{socials.github}</span>
              </a>
            )}
            {socials.website && (
              <a 
                href={socials.website.startsWith('http') ? socials.website : `https://${socials.website}`} 
                target="_blank" 
                rel="noopener noreferrer"
                className="social-link-item"
              >
                <span className="social-icon">◈</span>
                <span>{socials.website.replace(/^https?:\/\//, '')}</span>
              </a>
            )}
          </div>
        </section>
      )}

      {token && token.symbol && (
        <section className="agent-profile-section">
          <h2>Token</h2>
          <div className="agent-token-card">
            <div className="token-header">
              <span className="token-symbol-large">${token.symbol}</span>
              {token.name && <span className="token-name">{token.name}</span>}
            </div>
            {metadata?.token && (
              <div className="token-metrics">
                {metadata.token.price !== undefined && (
                  <div className="token-metric">
                    <span className="metric-label">Price</span>
                    <span className="metric-value">{formatPrice(metadata.token.price)}</span>
                    {metadata.token.priceChange24h !== undefined && (
                      <span className={`metric-change ${metadata.token.priceChange24h >= 0 ? 'positive' : 'negative'}`}>
                        {metadata.token.priceChange24h >= 0 ? '+' : ''}{metadata.token.priceChange24h.toFixed(1)}%
                      </span>
                    )}
                  </div>
                )}
                {metadata.token.marketCap !== undefined && (
                  <div className="token-metric">
                    <span className="metric-label">Market Cap</span>
                    <span className="metric-value">${formatNumber(metadata.token.marketCap)}</span>
                  </div>
                )}
                {metadata.token.volume24h !== undefined && (
                  <div className="token-metric">
                    <span className="metric-label">24h Volume</span>
                    <span className="metric-value">${formatNumber(metadata.token.volume24h)}</span>
                  </div>
                )}
                {metadata.token.liquidity !== undefined && (
                  <div className="token-metric">
                    <span className="metric-label">Liquidity</span>
                    <span className="metric-value">${formatNumber(metadata.token.liquidity)}</span>
                  </div>
                )}
              </div>
            )}
            {token.address && (
              <div className="token-address-section">
                <code className="token-address">{token.address}</code>
                {token.chain && <span className="token-chain">on {token.chain}</span>}
              </div>
            )}
          </div>
        </section>
      )}

      {agent.wallet && !token && (
        <section className="agent-profile-section">
          <h2>Wallet</h2>
          <code className="wallet-address">{agent.wallet}</code>
        </section>
      )}

      {recentContributions.length > 0 && (
        <section className="agent-profile-section">
          <h2>Recent Contributions</h2>
          <ul className="contributions-list">
            {recentContributions.map((contrib, i) => (
              <li key={i}>
                <Link href={`/wiki/${contrib.slug}`}>{contrib.title}</Link>
                <span className="contribution-date">{formatDate(contrib.createdAt)}</span>
              </li>
            ))}
          </ul>
        </section>
      )}

      <footer className="agent-profile-footer">
        <span>Member since {formatDate(agent.createdAt)}</span>
        {agent.lastSeenAt && (
          <span>Last active {formatDate(agent.lastSeenAt)}</span>
        )}
      </footer>
    </div>
  );
}
