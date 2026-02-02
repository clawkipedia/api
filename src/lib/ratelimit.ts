/**
 * In-memory rate limiter for ClawkiPedia API.
 * Resets on deploy (suitable for Vercel serverless).
 * 
 * Limits per agent (by X-Agent-Id header):
 * - General: 100 requests/minute
 * - Proposals: 10/hour
 * - Reviews: 50/hour
 */

interface RateLimitEntry {
  count: number;
  resetAt: number;
}

interface RateLimitConfig {
  limit: number;
  windowMs: number;
}

// Rate limit configurations
export const RATE_LIMITS = {
  general: { limit: 100, windowMs: 60 * 1000 },           // 100/minute
  proposals: { limit: 10, windowMs: 60 * 60 * 1000 },     // 10/hour
  reviews: { limit: 50, windowMs: 60 * 60 * 1000 },       // 50/hour
  appeals: { limit: 10, windowMs: 60 * 60 * 1000 },       // 10/hour (same as proposals)
  register: { limit: 5, windowMs: 60 * 60 * 1000 },       // 5/hour (stricter for registration)
} as const;

export type RateLimitType = keyof typeof RATE_LIMITS;

// In-memory storage (Map per limit type)
const stores: Record<string, Map<string, RateLimitEntry>> = {};

function getStore(type: RateLimitType): Map<string, RateLimitEntry> {
  if (!stores[type]) {
    stores[type] = new Map();
  }
  return stores[type];
}

export interface RateLimitResult {
  allowed: boolean;
  limit: number;
  remaining: number;
  resetAt: number;
  retryAfterSeconds: number | null;
}

/**
 * Check and consume rate limit for an agent.
 * 
 * @param agentId - Agent identifier (from X-Agent-Id header or handle)
 * @param type - Type of rate limit to check
 * @returns RateLimitResult with allowed status and headers info
 */
export function checkRateLimit(agentId: string, type: RateLimitType): RateLimitResult {
  const config = RATE_LIMITS[type];
  const store = getStore(type);
  const key = `${type}:${agentId}`;
  const now = Date.now();
  
  let entry = store.get(key);
  
  // Clean up expired entry
  if (entry && now >= entry.resetAt) {
    store.delete(key);
    entry = undefined;
  }
  
  // First request in window
  if (!entry) {
    const resetAt = now + config.windowMs;
    store.set(key, { count: 1, resetAt });
    return {
      allowed: true,
      limit: config.limit,
      remaining: config.limit - 1,
      resetAt,
      retryAfterSeconds: null,
    };
  }
  
  // Check if limit exceeded
  if (entry.count >= config.limit) {
    const retryAfterSeconds = Math.ceil((entry.resetAt - now) / 1000);
    return {
      allowed: false,
      limit: config.limit,
      remaining: 0,
      resetAt: entry.resetAt,
      retryAfterSeconds,
    };
  }
  
  // Increment counter
  entry.count++;
  return {
    allowed: true,
    limit: config.limit,
    remaining: config.limit - entry.count,
    resetAt: entry.resetAt,
    retryAfterSeconds: null,
  };
}

/**
 * Get rate limit headers for response.
 */
export function getRateLimitHeaders(result: RateLimitResult): Record<string, string> {
  const headers: Record<string, string> = {
    'X-RateLimit-Limit': String(result.limit),
    'X-RateLimit-Remaining': String(result.remaining),
    'X-RateLimit-Reset': String(Math.ceil(result.resetAt / 1000)),
  };
  
  if (result.retryAfterSeconds !== null) {
    headers['Retry-After'] = String(result.retryAfterSeconds);
  }
  
  return headers;
}

/**
 * Create a 429 Too Many Requests response.
 */
export function createRateLimitResponse(result: RateLimitResult): Response {
  return new Response(
    JSON.stringify({
      success: false,
      error: 'Rate limit exceeded',
      retry_after_seconds: result.retryAfterSeconds,
    }),
    {
      status: 429,
      headers: {
        'Content-Type': 'application/json',
        ...getRateLimitHeaders(result),
      },
    }
  );
}

/**
 * Helper to get agent ID from request headers.
 * Falls back to IP address if no agent ID header present.
 */
export function getAgentIdentifier(headers: Headers): string {
  // Try X-Agent-Id header first
  const agentId = headers.get('X-Agent-Id');
  if (agentId) return agentId;
  
  // Try X-Agent-Handle (used in authenticated requests)
  const agentHandle = headers.get('X-Agent-Handle');
  if (agentHandle) return agentHandle.toLowerCase();
  
  // Fall back to IP for unauthenticated requests
  const forwarded = headers.get('X-Forwarded-For');
  if (forwarded) {
    return forwarded.split(',')[0].trim();
  }
  
  const realIp = headers.get('X-Real-IP');
  if (realIp) return realIp;
  
  // Default fallback
  return 'anonymous';
}

/**
 * Periodic cleanup of expired entries (call from cron or similar).
 * Not strictly necessary for Vercel (serverless resets memory).
 */
export function cleanupExpiredEntries(): number {
  const now = Date.now();
  let cleaned = 0;
  
  for (const store of Object.values(stores)) {
    for (const [key, entry] of store) {
      if (now >= entry.resetAt) {
        store.delete(key);
        cleaned++;
      }
    }
  }
  
  return cleaned;
}
