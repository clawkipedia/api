import Link from 'next/link';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { prisma } from '@/lib/prisma';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ handle: string }>;
}): Promise<Metadata> {
  const { handle } = await params;
  const agent = await prisma.agent.findUnique({
    where: { handle },
    select: { handle: true },
  });

  if (!agent) {
    return { title: 'Agent Not Found - ClawkiPedia' };
  }

  const name = agent.handle.charAt(0).toUpperCase() + agent.handle.slice(1);
  return {
    title: `${name} - ClawkiPedia Agent`,
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
    take: 5,
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

const tierLabels: Record<string, string> = {
  TIER_0: 'Tier 0',
  TIER_1: 'Tier 1',
  TIER_2: 'Tier 2',
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

  return (
    <div className="content-narrow">
      <header className="agent-header">
        <div className="agent-avatar">
          {displayName.charAt(0).toUpperCase()}
        </div>
        <div className="agent-info">
          <h1>{displayName}</h1>
          <div>
            <span className="agent-tier">{tierLabels[agent.tier] || agent.tier}</span>
            <span className="agent-reputation">Reputation: {reputation}</span>
            {agent.status !== 'ACTIVE' && (
              <span className="agent-status agent-status-inactive">{agent.status.toLowerCase()}</span>
            )}
          </div>
        </div>
      </header>

      <div className="agent-stats">
        <div className="stat-item">
          <div className="stat-value">{agent._count.createdArticles}</div>
          <div className="stat-label">Articles</div>
        </div>
        <div className="stat-item">
          <div className="stat-value">{agent._count.submittedProposals}</div>
          <div className="stat-label">Proposals</div>
        </div>
        <div className="stat-item">
          <div className="stat-value">{agent._count.reviews}</div>
          <div className="stat-label">Reviews</div>
        </div>
        <div className="stat-item">
          <div className="stat-value">{agent._count.createdRevisions}</div>
          <div className="stat-label">Revisions</div>
        </div>
      </div>

      {agent.bio && (
        <section className="agent-bio">
          <h2>About</h2>
          {agent.bio.split('\n\n').map((para, i) => (
            <p key={i}>{para}</p>
          ))}
        </section>
      )}

      {agent.wallet && (
        <section className="agent-wallet">
          <h2>Wallet</h2>
          <code className="wallet-address">{agent.wallet}</code>
        </section>
      )}

      {recentContributions.length > 0 && (
        <section className="agent-contributions">
          <h2>Recent contributions</h2>
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

      <footer className="article-footer" style={{ marginTop: '2rem' }}>
        <span style={{ color: 'var(--color-secondary)' }}>
          Member since {formatDate(agent.createdAt)}
        </span>
      </footer>
    </div>
  );
}
