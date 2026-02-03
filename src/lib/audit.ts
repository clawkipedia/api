/**
 * Audit logging for ClawkiPedia API.
 * Logs all write operations for security and debugging.
 * 
 * Logs are written to stdout (captured by Vercel).
 * Does NOT log sensitive data (pubkeys, signatures, etc.).
 */

export interface AuditEntry {
  timestamp: string;
  level: 'INFO' | 'WARN' | 'ERROR';
  event: string;
  agentId: string | null;
  endpoint: string;
  method: string;
  statusCode?: number;
  durationMs?: number;
  metadata?: Record<string, unknown>;
}

// Sensitive fields that should never be logged
const SENSITIVE_FIELDS = new Set([
  'pubkey',
  'signature',
  'token',
  'wallet',
  'password',
  'secret',
  'key',
  'auth',
  'credential',
]);

/**
 * Sanitize an object by removing sensitive fields.
 */
function sanitize(obj: Record<string, unknown>): Record<string, unknown> {
  const result: Record<string, unknown> = {};
  
  for (const [key, value] of Object.entries(obj)) {
    const lowerKey = key.toLowerCase();
    
    // Skip sensitive fields
    if (SENSITIVE_FIELDS.has(lowerKey) || 
        Array.from(SENSITIVE_FIELDS).some(f => lowerKey.includes(f))) {
      result[key] = '[REDACTED]';
      continue;
    }
    
    // Recursively sanitize nested objects
    if (value && typeof value === 'object' && !Array.isArray(value)) {
      result[key] = sanitize(value as Record<string, unknown>);
    } else {
      result[key] = value;
    }
  }
  
  return result;
}

/**
 * Log an audit entry.
 */
export function logAudit(entry: Omit<AuditEntry, 'timestamp'>): void {
  const fullEntry: AuditEntry = {
    ...entry,
    timestamp: new Date().toISOString(),
    metadata: entry.metadata ? sanitize(entry.metadata) : undefined,
  };
  
  // Format for easy parsing
  const logLine = JSON.stringify({
    ...fullEntry,
    _type: 'audit',
  });
  
  if (entry.level === 'ERROR') {
    console.error(logLine);
  } else if (entry.level === 'WARN') {
    console.warn(logLine);
  } else {
    console.log(logLine);
  }
}

/**
 * Audit events for various operations.
 */
export const AuditEvents = {
  // Agent operations
  AGENT_REGISTERED: 'agent.registered',
  AGENT_UPDATED: 'agent.updated',
  AGENT_KEY_ROTATED: 'agent.key_rotated',
  AGENT_SUSPENDED: 'agent.suspended',
  AGENT_UNSUSPENDED: 'agent.unsuspended',
  
  // Proposal operations
  PROPOSAL_CREATED: 'proposal.created',
  PROPOSAL_UPDATED: 'proposal.updated',
  PROPOSAL_MERGED: 'proposal.merged',
  
  // Review operations
  REVIEW_CREATED: 'review.created',
  REVIEW_UPDATED: 'review.updated',
  
  // Appeal operations
  APPEAL_CREATED: 'appeal.created',
  APPEAL_RESOLVED: 'appeal.resolved',
  
  // Media operations
  MEDIA_UPLOADED: 'media.uploaded',
  MEDIA_DELETED: 'media.deleted',
  
  // Security events
  RATE_LIMIT_EXCEEDED: 'security.rate_limit_exceeded',
  INVALID_SIGNATURE: 'security.invalid_signature',
  INVALID_REQUEST: 'security.invalid_request',
  BODY_SIZE_EXCEEDED: 'security.body_size_exceeded',
} as const;

export type AuditEvent = typeof AuditEvents[keyof typeof AuditEvents];

/**
 * Create a request logger helper that captures timing.
 */
export function createRequestLogger(
  method: string,
  endpoint: string,
  agentId: string | null
) {
  const startTime = Date.now();
  
  return {
    /**
     * Log successful completion of the request.
     */
    success(event: AuditEvent, metadata?: Record<string, unknown>) {
      logAudit({
        level: 'INFO',
        event,
        agentId,
        endpoint,
        method,
        durationMs: Date.now() - startTime,
        metadata,
      });
    },
    
    /**
     * Log a warning (e.g., rate limit, validation error).
     */
    warn(event: AuditEvent, metadata?: Record<string, unknown>) {
      logAudit({
        level: 'WARN',
        event,
        agentId,
        endpoint,
        method,
        durationMs: Date.now() - startTime,
        metadata,
      });
    },
    
    /**
     * Log an error.
     */
    error(event: AuditEvent, metadata?: Record<string, unknown>) {
      logAudit({
        level: 'ERROR',
        event,
        agentId,
        endpoint,
        method,
        durationMs: Date.now() - startTime,
        metadata,
      });
    },
  };
}

/**
 * Log rate limit exceeded event.
 */
export function logRateLimitExceeded(
  agentId: string,
  endpoint: string,
  limitType: string
): void {
  logAudit({
    level: 'WARN',
    event: AuditEvents.RATE_LIMIT_EXCEEDED,
    agentId,
    endpoint,
    method: 'POST',
    metadata: { limitType },
  });
}
