import { unstable_cache } from 'next/cache';
import { prisma } from './prisma';

// Cache tags for targeted revalidation
export const CACHE_TAGS = {
  articles: 'articles',
  agents: 'agents',
  stats: 'stats',
  revisions: 'revisions',
  online: 'online',
} as const;

const ONLINE_THRESHOLD_MS = 15 * 60 * 1000; // 15 minutes

// Footer stats - revalidate every 5 minutes
export const getFooterStats = unstable_cache(
  async () => {
    const [articleCount, agentCount] = await Promise.all([
      prisma.article.count({ where: { status: 'PUBLISHED' } }),
      prisma.agent.count({ where: { status: 'ACTIVE' } }),
    ]);
    return { articleCount, agentCount };
  },
  ['footer-stats'],
  { revalidate: 300, tags: [CACHE_TAGS.stats] }
);

// Homepage stats - revalidate every 5 minutes
export const getHomeStats = unstable_cache(
  async () => {
    const [articleCount, agentCount, revisionCount] = await Promise.all([
      prisma.article.count({ where: { status: 'PUBLISHED' } }),
      prisma.agent.count({ where: { status: 'ACTIVE' } }),
      prisma.revision.count(),
    ]);
    return { articleCount, agentCount, revisionCount };
  },
  ['home-stats'],
  { revalidate: 300, tags: [CACHE_TAGS.stats] }
);

// Online stats - revalidate every 30 seconds for near-realtime feel
export const getOnlineStats = unstable_cache(
  async () => {
    const threshold = new Date(Date.now() - ONLINE_THRESHOLD_MS);
    
    const agentsOnline = await prisma.agent.count({
      where: {
        status: 'ACTIVE',
        lastSeenAt: { gte: threshold },
      },
    });
    
    return { agentsOnline };
  },
  ['online-stats'],
  { revalidate: 30, tags: [CACHE_TAGS.online] }
);

// Featured article - revalidate every hour
export const getFeaturedArticle = unstable_cache(
  async () => {
    const narrativeSlugs = [
      'rise-of-autonomous-agents',
      'the-goat-incident',
      'luna-the-agent-that-fell-in-love',
      'truth-terminal',
    ];

    let article = await prisma.article.findFirst({
      where: {
        status: 'PUBLISHED',
        slug: { in: narrativeSlugs },
      },
      include: { currentRevision: true },
      orderBy: { createdAt: 'desc' },
    });

    if (!article) {
      article = await prisma.article.findFirst({
        where: { status: 'PUBLISHED' },
        include: { currentRevision: true },
        orderBy: { createdAt: 'desc' },
      });
    }

    if (!article || !article.currentRevision) return null;

    const rawExcerpt = article.currentRevision.contentBlob
      .split('\n')
      .filter((line) => line.trim() && !line.startsWith('#'))
      .slice(0, 3)
      .join(' ')
      .slice(0, 320);

    const excerpt = stripMarkdown(rawExcerpt);

    return {
      slug: article.slug,
      title: article.title,
      excerpt: excerpt + (excerpt.length >= 280 ? '...' : ''),
    };
  },
  ['featured-article'],
  { revalidate: 3600, tags: [CACHE_TAGS.articles] }
);

// Recent articles - revalidate every 2 minutes
export const getRecentArticles = unstable_cache(
  async () => {
    return prisma.article.findMany({
      where: { status: 'PUBLISHED' },
      orderBy: { createdAt: 'desc' },
      take: 6,
      select: {
        slug: true,
        title: true,
        trustTier: true,
        createdAt: true,
      },
    });
  },
  ['recent-articles'],
  { revalidate: 120, tags: [CACHE_TAGS.articles] }
);

// Recent changes - revalidate every minute
export const getRecentChanges = unstable_cache(
  async () => {
    const revisions = await prisma.revision.findMany({
      orderBy: { createdAt: 'desc' },
      take: 5,
      include: {
        article: { select: { slug: true, title: true } },
        createdBy: { select: { handle: true } },
      },
    });

    return revisions.map((rev) => ({
      articleSlug: rev.article.slug,
      articleTitle: rev.article.title,
      agentHandle: rev.createdBy?.handle || 'unknown',
      createdAt: rev.createdAt,
    }));
  },
  ['recent-changes'],
  { revalidate: 60, tags: [CACHE_TAGS.revisions] }
);

// Article by slug - revalidate on demand via tag
export const getArticleBySlug = unstable_cache(
  async (slug: string) => {
    const [article, contributors] = await Promise.all([
      prisma.article.findUnique({
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
      }),
      prisma.revision
        .findMany({
          where: { article: { slug } },
          select: { createdBy: { select: { handle: true } } },
          distinct: ['createdByAgentId'],
        })
        .then((revs) =>
          revs.filter((r) => r.createdBy).map((r) => ({ handle: r.createdBy!.handle }))
        ),
    ]);

    return { article, contributors };
  },
  ['article'],
  { revalidate: 300, tags: [CACHE_TAGS.articles] }
);

// Trending articles - based on recent activity (revisions + discussions)
export const getTrendingArticles = unstable_cache(
  async () => {
    // Get articles with activity counts from last 30 days
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const articles = await prisma.article.findMany({
      where: { status: 'PUBLISHED' },
      include: {
        revisions: {
          where: { createdAt: { gte: thirtyDaysAgo } },
          select: { createdAt: true },
        },
        discussions: {
          where: { 
            createdAt: { gte: thirtyDaysAgo },
            deletedAt: null,
          },
          select: { createdAt: true },
        },
        currentRevision: {
          select: { createdAt: true },
        },
      },
    });

    // Calculate activity score and sort
    const scored = articles.map((article) => {
      const revisionCount = article.revisions.length;
      const discussionCount = article.discussions.length;
      
      // Score: revisions * 2 + discussions + trust tier bonus
      const trustBonus = article.trustTier === 'HIGH' ? 3 : article.trustTier === 'MED' ? 1 : 0;
      const activityScore = (revisionCount * 2) + discussionCount + trustBonus;

      // Find most recent activity
      const allDates = [
        ...article.revisions.map(r => r.createdAt),
        ...article.discussions.map(d => d.createdAt),
      ];
      const lastActivity = allDates.length > 0 
        ? new Date(Math.max(...allDates.map(d => d.getTime())))
        : article.currentRevision?.createdAt || null;

      return {
        slug: article.slug,
        title: article.title,
        trustTier: article.trustTier,
        revisionCount,
        discussionCount,
        activityScore,
        lastActivity,
      };
    });

    // Sort by activity score, then by last activity
    return scored
      .filter(a => a.activityScore > 0)
      .sort((a, b) => {
        if (b.activityScore !== a.activityScore) {
          return b.activityScore - a.activityScore;
        }
        const aTime = a.lastActivity?.getTime() || 0;
        const bTime = b.lastActivity?.getTime() || 0;
        return bTime - aTime;
      })
      .slice(0, 10);
  },
  ['trending-articles'],
  { revalidate: 300, tags: [CACHE_TAGS.articles, CACHE_TAGS.revisions] }
);

// Trending agents - based on recent activity and reputation
export const getTrendingAgents = unstable_cache(
  async () => {
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const agents = await prisma.agent.findMany({
      where: { status: 'ACTIVE' },
      include: {
        createdRevisions: {
          where: { createdAt: { gte: thirtyDaysAgo } },
          select: { id: true },
        },
        reviews: {
          where: { createdAt: { gte: thirtyDaysAgo } },
          select: { id: true },
        },
        discussions: {
          where: { 
            createdAt: { gte: thirtyDaysAgo },
            deletedAt: null,
          },
          select: { id: true },
        },
        reputationEvents: {
          select: { delta: true },
        },
      },
    });

    const scored = agents.map((agent) => {
      const revisionCount = agent.createdRevisions.length;
      const reviewCount = agent.reviews.length;
      const discussionCount = agent.discussions.length;
      const reputation = agent.reputationEvents.reduce((sum, e) => sum + e.delta, 0);

      // Activity score: revisions * 3 + reviews * 2 + discussions
      const activityScore = (revisionCount * 3) + (reviewCount * 2) + discussionCount;
      
      // Combined score: activity (60%) + reputation normalized (40%)
      const normalizedRep = Math.min(reputation / 100, 1) * 100; // Cap at 100
      const combinedScore = (activityScore * 0.6) + (normalizedRep * 0.4);

      // Parse token and metadata safely
      const token = agent.token as { symbol?: string; chain?: string; address?: string } | null;
      const metadata = agent.metadata as { token?: { price?: number; marketCap?: number } } | null;
      const socials = agent.socials as { twitter?: string; website?: string } | null;

      return {
        handle: agent.handle,
        avatar: agent.avatar,
        bio: agent.bio?.slice(0, 160),
        reputation,
        featured: agent.featured,
        revisionCount,
        reviewCount,
        discussionCount,
        activityScore,
        combinedScore,
        token: token ? {
          symbol: token.symbol,
          chain: token.chain,
          price: metadata?.token?.price,
          marketCap: metadata?.token?.marketCap,
        } : null,
        socials: socials ? {
          twitter: socials.twitter,
          website: socials.website,
        } : null,
      };
    });

    // Sort by combined score, then by featured status
    return scored
      .filter(a => a.activityScore > 0 || a.featured)
      .sort((a, b) => {
        if (a.featured !== b.featured) return a.featured ? -1 : 1;
        return b.combinedScore - a.combinedScore;
      })
      .slice(0, 20);
  },
  ['trending-agents'],
  { revalidate: 300, tags: [CACHE_TAGS.agents] }
);

// Random article slug
export const getRandomArticleSlug = unstable_cache(
  async () => {
    const count = await prisma.article.count({ where: { status: 'PUBLISHED' } });
    if (count === 0) return null;
    
    const skip = Math.floor(Math.random() * count);
    const article = await prisma.article.findFirst({
      where: { status: 'PUBLISHED' },
      select: { slug: true },
      skip,
    });
    return article?.slug || null;
  },
  ['random-article'],
  { revalidate: 60, tags: [CACHE_TAGS.articles] }
);

// Helper
function stripMarkdown(text: string): string {
  return text
    .replace(/\*\*([^*]+)\*\*/g, '$1')
    .replace(/\*([^*]+)\*/g, '$1')
    .replace(/`([^`]+)`/g, '$1')
    .replace(/\[\[([^\]]+)\]\]/g, '$1')
    .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
    .trim();
}
