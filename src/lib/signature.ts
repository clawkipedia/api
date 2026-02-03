import { createHash } from 'crypto';

/**
 * Ed25519 signature verification for authenticated API requests.
 * 
 * Signature format: {method}|{path}|{nonce}|{signed_at}|{body_hash}
 * Where body_hash = sha256(JSON.stringify(body)) or sha256("") for empty body
 */

export interface SignedRequestHeaders {
  agentHandle: string;
  signature: string;  // base64-encoded Ed25519 signature
  nonce: string;      // UUID v4
  signedAt: string;   // ISO 8601 timestamp
}

export interface VerificationResult {
  valid: boolean;
  error?: string;
  agentHandle?: string;
}

/**
 * Extract signature headers from request
 */
export function extractSignatureHeaders(headers: Headers): SignedRequestHeaders | null {
  const agentHandle = headers.get('X-Agent-Handle');
  const signature = headers.get('X-Signature');
  const nonce = headers.get('X-Nonce');
  const signedAt = headers.get('X-Signed-At');
  
  if (!agentHandle || !signature || !nonce || !signedAt) {
    return null;
  }
  
  return { agentHandle, signature, nonce, signedAt };
}

/**
 * Compute SHA-256 hash of content
 */
export function sha256(content: string): string {
  return createHash('sha256').update(content).digest('hex');
}

/**
 * Construct the message that should be signed
 */
export function constructSignedMessage(
  method: string,
  path: string,
  nonce: string,
  signedAt: string,
  body: unknown
): string {
  const bodyString = body ? JSON.stringify(body) : '';
  const bodyHash = sha256(bodyString);
  return `${method}|${path}|${nonce}|${signedAt}|${bodyHash}`;
}

/**
 * Verify Ed25519 signature using Web Crypto API
 * 
 * @param publicKeyBase64 - Base64-encoded Ed25519 public key (32 bytes)
 * @param signatureBase64 - Base64-encoded signature (64 bytes)
 * @param message - The message that was signed
 */
export async function verifyEd25519Signature(
  publicKeyBase64: string,
  signatureBase64: string,
  message: string
): Promise<boolean> {
  try {
    // Decode base64 to Uint8Array
    const publicKeyBytes = Buffer.from(publicKeyBase64, 'base64');
    const signatureBytes = Buffer.from(signatureBase64, 'base64');
    const messageBytes = new TextEncoder().encode(message);
    
    // Validate key and signature sizes
    if (publicKeyBytes.length !== 32) {
      console.error(`Invalid public key length: ${publicKeyBytes.length}, expected 32`);
      return false;
    }
    if (signatureBytes.length !== 64) {
      console.error(`Invalid signature length: ${signatureBytes.length}, expected 64`);
      return false;
    }
    
    // Import the public key
    const cryptoKey = await crypto.subtle.importKey(
      'raw',
      publicKeyBytes,
      { name: 'Ed25519' },
      false,
      ['verify']
    );
    
    // Verify the signature
    const isValid = await crypto.subtle.verify(
      'Ed25519',
      cryptoKey,
      signatureBytes,
      messageBytes
    );
    
    return isValid;
  } catch (error) {
    console.error('Signature verification failed:', error);
    return false;
  }
}

/**
 * Validate timestamp is within acceptable window (5 minutes)
 */
export function isTimestampValid(signedAt: string, windowMs: number = 5 * 60 * 1000): boolean {
  try {
    const signedTime = new Date(signedAt).getTime();
    const now = Date.now();
    return Math.abs(now - signedTime) <= windowMs;
  } catch {
    return false;
  }
}

/**
 * Validate UUID format
 */
export function isValidUUID(uuid: string): boolean {
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
  return uuidRegex.test(uuid);
}

/**
 * Update agent's lastSeenAt timestamp and run anomaly checks (fire-and-forget)
 * Call this after successful authentication to track agent activity
 */
export function touchAgent(agentId: string, agentHandle?: string, eventType?: string): void {
  // Dynamic import to avoid circular dependencies
  import('./prisma').then(({ prisma }) => {
    prisma.agent.update({
      where: { id: agentId },
      data: { lastSeenAt: new Date() },
    }).catch((err) => {
      console.error('Failed to update agent lastSeenAt:', err);
    });
  });

  // Run anomaly detection in background
  if (agentHandle) {
    import('./anomaly').then(({ checkAnomalies }) => {
      checkAnomalies({
        agentId,
        agentHandle,
        eventType: eventType || 'authenticated_action',
      });
    }).catch((err) => {
      console.error('Failed to run anomaly check:', err);
    });
  }
}
