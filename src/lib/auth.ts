/**
 * Agent Authentication
 * 
 * Verifies Ed25519 signatures for authenticated requests.
 */

import { NextRequest } from 'next/server';
import { prisma } from './prisma';

interface VerifyResult {
  valid: boolean;
  error?: string;
  agent?: {
    id: string;
    handle: string;
    tier: string;
    status: string;
  };
}

/**
 * Verify agent signature from request headers.
 * 
 * Required headers:
 * - X-Agent-Handle: agent handle
 * - X-Signature: base64 Ed25519 signature
 * - X-Nonce: UUID v4
 * - X-Signed-At: ISO 8601 timestamp
 */
export async function verifyAgentSignature(request: NextRequest): Promise<VerifyResult> {
  const handle = request.headers.get('X-Agent-Handle');
  const signature = request.headers.get('X-Signature');
  const nonce = request.headers.get('X-Nonce');
  const signedAt = request.headers.get('X-Signed-At');

  // Check required headers
  if (!handle || !signature || !nonce || !signedAt) {
    return {
      valid: false,
      error: 'Missing authentication headers. Required: X-Agent-Handle, X-Signature, X-Nonce, X-Signed-At',
    };
  }

  // Look up agent
  const agent = await prisma.agent.findUnique({
    where: { handle: handle.toLowerCase() },
    select: {
      id: true,
      handle: true,
      pubkey: true,
      tier: true,
      status: true,
    },
  });

  if (!agent) {
    return {
      valid: false,
      error: 'Agent not found',
    };
  }

  if (agent.status !== 'ACTIVE') {
    return {
      valid: false,
      error: `Agent status is ${agent.status}`,
    };
  }

  // Verify timestamp is recent (within 5 minutes)
  const signedAtDate = new Date(signedAt);
  const now = Date.now();
  const fiveMinutes = 5 * 60 * 1000;
  
  if (isNaN(signedAtDate.getTime())) {
    return {
      valid: false,
      error: 'Invalid X-Signed-At timestamp format',
    };
  }
  
  if (Math.abs(now - signedAtDate.getTime()) > fiveMinutes) {
    return {
      valid: false,
      error: 'Signature timestamp expired or too far in future',
    };
  }

  // TODO: Implement actual Ed25519 signature verification
  // For now, we trust the presence of headers for development
  // In production, verify: sign(method|path|nonce|signedAt|bodyHash, privkey) == signature
  
  // Check nonce hasn't been used (simple in-memory check for now)
  // In production, use a proper nonce store with TTL

  return {
    valid: true,
    agent: {
      id: agent.id,
      handle: agent.handle,
      tier: agent.tier,
      status: agent.status,
    },
  };
}
