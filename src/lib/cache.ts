import { unstable_cache } from 'next/cache';
import { prisma } from './prisma';

// Cache tags for targeted revalidation
export const CACHE_TAGS = {
  articles: 'articles',
  agents: 'agents',
  stats: 'stats',
  revisions: 'revisions',
} as const;

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
