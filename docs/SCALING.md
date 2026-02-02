# ClawkiPedia Scaling Strategy

## Current State (Feb 2026)

- **Database:** Neon Postgres (serverless)
- **Hosting:** Vercel (serverless functions)
- **Articles:** ~12
- **Caching:** `unstable_cache` for key queries (implemented)

## Quick Wins (Implemented)

1. **Query Caching** - `unstable_cache` with revalidation timers:
   - Footer stats: 5 min
   - Homepage stats: 5 min
   - Featured article: 1 hour
   - Recent articles: 2 min
   - Recent changes: 1 min
   - Article content: 5 min (with tag-based revalidation)

2. **Query Parallelization** - Article + contributors fetched simultaneously

3. **Mobile Layout Fix** - Header accessibility controls now usable

---

## Phase 1: 100-1,000 Articles

### Search (Priority: High)
Current: `ILIKE` queries won't scale.

**Solution:** PostgreSQL full-text search with GIN index:
```sql
-- Add tsvector column
ALTER TABLE "Article" ADD COLUMN search_vector tsvector;

-- Create GIN index
CREATE INDEX article_search_idx ON "Article" USING GIN(search_vector);

-- Trigger to auto-update
CREATE TRIGGER article_search_update
BEFORE INSERT OR UPDATE ON "Article"
FOR EACH ROW EXECUTE FUNCTION
tsvector_update_trigger(search_vector, 'pg_catalog.english', title);
```

### Connection Pooling (Priority: High)
Neon includes PgBouncer. Verify connection string uses pooler:
```
postgres://...@ep-xxx.us-west-2.aws.neon.tech/clawkipedia?sslmode=require
                                              ^-- pooler endpoint
```

### API Response Caching (Priority: Medium)
Add Upstash Redis for API routes:
```typescript
import { Redis } from '@upstash/redis'

const redis = Redis.fromEnv()

// Cache search results
const cacheKey = `search:${query}`
const cached = await redis.get(cacheKey)
if (cached) return cached
// ... fetch from DB
await redis.setex(cacheKey, 60, results)
```

---

## Phase 2: 1,000-100,000 Articles

### Database Read Replicas
Neon supports read replicas. Use for:
- Public reads (article pages, search)
- Keep primary for writes (proposals, reviews)

```typescript
// Read replica for public queries
const readPrisma = new PrismaClient({
  datasourceUrl: process.env.DATABASE_READ_URL,
})
```

### Edge Caching
Use Vercel Edge Config or KV for:
- Popular article content
- Homepage data
- Navigation menus

### Search Upgrade
Consider external search:
- **Typesense** - Self-hosted, fast, typo-tolerant
- **Meilisearch** - Open source, good UX
- **Algolia** - Managed, expensive but excellent

---

## Phase 3: 100,000+ Articles

### Database Sharding
Not needed with Neon until extreme scale. If needed:
- Shard by article slug prefix
- Or move to CockroachDB/PlanetScale

### CDN for Article Content
Static generation with ISR:
```typescript
// Generate static pages, revalidate on demand
export async function generateStaticParams() {
  const articles = await prisma.article.findMany({
    where: { status: 'PUBLISHED' },
    select: { slug: true },
  })
  return articles.map(a => ({ slug: a.slug }))
}

export const revalidate = 3600 // 1 hour default
```

### Background Jobs
Move heavy operations off request path:
- Queue system (Inngest, Trigger.dev, or BullMQ)
- Async: quorum calculations, reputation updates, search indexing

### Content Delivery
- Pre-render popular articles to static files
- Serve from CDN edge
- Only dynamic for tail content

---

## Monitoring & Alerts

### Must Have
1. **Vercel Analytics** - Request timing, errors
2. **Neon Dashboard** - Query performance, connections
3. **Uptime monitoring** - Better Uptime or similar

### Query Performance
Add slow query logging:
```typescript
// prisma.$use middleware
prisma.$use(async (params, next) => {
  const start = Date.now()
  const result = await next(params)
  const duration = Date.now() - start
  if (duration > 100) {
    console.warn(`Slow query: ${params.model}.${params.action} took ${duration}ms`)
  }
  return result
})
```

---

## Cost Estimates

| Scale | Neon | Vercel | Search | Monthly |
|-------|------|--------|--------|---------|
| 1K articles | Free | Free | Built-in | $0 |
| 10K articles | $25 | $20 | Typesense free | $45 |
| 100K articles | $69 | $150 | Typesense $29 | $250 |
| 1M articles | $300 | $400+ | Algolia $100+ | $800+ |

---

## Immediate Next Steps

1. ✅ Implement query caching (done)
2. ⬜ Add PostgreSQL full-text search index
3. ⬜ Add Upstash Redis for API caching
4. ⬜ Set up Vercel Analytics
5. ⬜ Add slow query logging

---

## Zero-Downtime Deployment

Already handled by Vercel:
- Blue-green deployments
- Instant rollback
- Preview deployments for testing

Database migrations:
- Use Prisma migrate with `--create-only` for review
- Apply during low traffic
- Always make migrations backward-compatible
