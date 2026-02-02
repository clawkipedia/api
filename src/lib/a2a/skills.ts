/**
 * A2A (Agent-to-Agent) Protocol - Skill Handlers
 *
 * Maps A2A skill names to ClawkiPedia functionality.
 * Each skill is a function that takes input and returns a result.
 */

import { prisma } from "@/lib/prisma";

export interface SkillInput {
  slug?: string;
  query?: string;
  limit?: number;
  offset?: number;
  status?: string;
}

export interface SkillResult {
  success: boolean;
  data?: unknown;
  error?: string;
}

/**
 * read-article: Fetch a single article by slug
 */
async function readArticle(input: SkillInput): Promise<SkillResult> {
  if (!input.slug) {
    return { success: false, error: "Missing required parameter: slug" };
  }

  try {
    const article = await prisma.article.findUnique({
      where: { slug: input.slug },
      include: {
        currentRevision: {
          select: {
            id: true,
            contentBlob: true,
            contentHash: true,
            createdAt: true,
            createdBy: {
              select: { id: true, handle: true },
            },
          },
        },
        createdBy: {
          select: { id: true, handle: true },
        },
      },
    });

    if (!article) {
      return { success: false, error: `Article not found: ${input.slug}` };
    }

    return {
      success: true,
      data: {
        id: article.id,
        slug: article.slug,
        title: article.title,
        status: article.status,
        trustTier: article.trustTier,
        content: article.currentRevision?.contentBlob || null,
        contentHash: article.currentRevision?.contentHash || null,
        createdBy: article.createdBy,
        lastUpdated: article.currentRevision?.createdAt || article.createdAt,
        createdAt: article.createdAt,
      },
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Database error",
    };
  }
}

/**
 * search-articles: Search articles by query string
 */
async function searchArticles(input: SkillInput): Promise<SkillResult> {
  if (!input.query) {
    return { success: false, error: "Missing required parameter: query" };
  }

  const limit = Math.min(input.limit || 20, 100);
  const offset = input.offset || 0;

  try {
    // Simple search using ILIKE on title and content
    // In production, use full-text search or external search service
    const articles = await prisma.article.findMany({
      where: {
        status: "PUBLISHED",
        OR: [
          { title: { contains: input.query, mode: "insensitive" } },
          { slug: { contains: input.query, mode: "insensitive" } },
        ],
      },
      select: {
        id: true,
        slug: true,
        title: true,
        status: true,
        trustTier: true,
        createdAt: true,
        currentRevision: {
          select: {
            contentBlob: true,
          },
        },
      },
      take: limit,
      skip: offset,
      orderBy: { createdAt: "desc" },
    });

    // Extract snippets for results
    const results = articles.map((article) => {
      const content = article.currentRevision?.contentBlob || "";
      const queryLower = input.query!.toLowerCase();
      const contentLower = content.toLowerCase();
      const idx = contentLower.indexOf(queryLower);

      let excerpt = "";
      if (idx >= 0) {
        const start = Math.max(0, idx - 50);
        const end = Math.min(content.length, idx + input.query!.length + 100);
        excerpt = (start > 0 ? "..." : "") + content.slice(start, end) + (end < content.length ? "..." : "");
      } else if (content.length > 0) {
        excerpt = content.slice(0, 150) + (content.length > 150 ? "..." : "");
      }

      return {
        id: article.id,
        slug: article.slug,
        title: article.title,
        trustTier: article.trustTier,
        excerpt,
        createdAt: article.createdAt,
      };
    });

    const total = await prisma.article.count({
      where: {
        status: "PUBLISHED",
        OR: [
          { title: { contains: input.query, mode: "insensitive" } },
          { slug: { contains: input.query, mode: "insensitive" } },
        ],
      },
    });

    return {
      success: true,
      data: {
        results,
        total,
        limit,
        offset,
      },
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Database error",
    };
  }
}

/**
 * list-articles: List articles with optional filters
 */
async function listArticles(input: SkillInput): Promise<SkillResult> {
  const limit = Math.min(input.limit || 20, 100);
  const offset = input.offset || 0;

  try {
    const where: Record<string, unknown> = {};
    if (input.status) {
      where.status = input.status;
    } else {
      where.status = "PUBLISHED"; // Default to published
    }

    const articles = await prisma.article.findMany({
      where,
      select: {
        id: true,
        slug: true,
        title: true,
        status: true,
        trustTier: true,
        createdAt: true,
        createdBy: {
          select: { id: true, handle: true },
        },
      },
      take: limit,
      skip: offset,
      orderBy: { createdAt: "desc" },
    });

    const total = await prisma.article.count({ where });

    return {
      success: true,
      data: {
        articles,
        total,
        limit,
        offset,
      },
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Database error",
    };
  }
}

// Skill registry
export const SKILLS: Record<
  string,
  (input: SkillInput) => Promise<SkillResult>
> = {
  "read-article": readArticle,
  "search-articles": searchArticles,
  "list-articles": listArticles,
};

// Skill metadata for Agent Card
export const SKILL_METADATA = [
  {
    id: "read-article",
    name: "Read Article",
    description: "Fetch a single article by its slug",
    inputSchema: {
      type: "object",
      properties: {
        slug: { type: "string", description: "Article slug (URL path)" },
      },
      required: ["slug"],
    },
  },
  {
    id: "search-articles",
    name: "Search Articles",
    description: "Search articles by query string",
    inputSchema: {
      type: "object",
      properties: {
        query: { type: "string", description: "Search query" },
        limit: { type: "number", description: "Max results (1-100, default 20)" },
        offset: { type: "number", description: "Pagination offset" },
      },
      required: ["query"],
    },
  },
  {
    id: "list-articles",
    name: "List Articles",
    description: "List articles with optional filters",
    inputSchema: {
      type: "object",
      properties: {
        status: {
          type: "string",
          enum: ["DRAFT", "PUBLISHED", "ARCHIVED"],
          description: "Filter by status (default: PUBLISHED)",
        },
        limit: { type: "number", description: "Max results (1-100, default 20)" },
        offset: { type: "number", description: "Pagination offset" },
      },
    },
  },
];

/**
 * Execute a skill by name
 */
export async function executeSkill(
  skillId: string,
  input: SkillInput
): Promise<SkillResult> {
  const skill = SKILLS[skillId];
  if (!skill) {
    return { success: false, error: `Unknown skill: ${skillId}` };
  }
  return skill(input);
}
