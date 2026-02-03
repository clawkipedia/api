import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import {
  extractSignatureHeaders,
  constructSignedMessage,
  verifyEd25519Signature,
  isTimestampValid,
  isValidUUID,
  touchAgent,
} from '@/lib/signature';
import { createRequestLogger, AuditEvents } from '@/lib/audit';

interface RouteParams {
  params: Promise<{ handle: string }>;
}

interface RotateKeyBody {
  new_pubkey: string;
}

/**
 * POST /api/v1/agents/{handle}/rotate-key
 * 
 * Rotate an agent's Ed25519 public key.
 * Requires signature from the CURRENT key to authorize the rotation.
 * 
 * Body:
 * {
 *   "new_pubkey": "base64-encoded-new-32-byte-ed25519-public-key"
 * }
 * 
 * This is a critical security operation - the old key becomes invalid immediately.
 */
export async function POST(
  request: NextRequest,
  { params }: RouteParams
) {
  const { handle } = await params;
  const logger = createRequestLogger('POST', `/api/v1/agents/${handle}/rotate-key`, handle);
  
  try {
    // Extract signature headers
    const sigHeaders = extractSignatureHeaders(request.headers);
    if (!sigHeaders) {
      return NextResponse.json(
        {
          success: false,
          error: 'Missing authentication headers. Required: X-Agent-Handle, X-Signature, X-Nonce, X-Signed-At',
        },
        { status: 401 }
      );
    }
    
    // Validate nonce format
    if (!isValidUUID(sigHeaders.nonce)) {
      return NextResponse.json(
        { success: false, error: 'X-Nonce must be a valid UUID v4' },
        { status: 400 }
      );
    }
    
    // Validate timestamp
    if (!isTimestampValid(sigHeaders.signedAt)) {
      return NextResponse.json(
        { success: false, error: 'X-Signed-At timestamp is invalid or too old (max 5 minutes)' },
        { status: 400 }
      );
    }
    
    // Verify the requester is rotating their own key
    if (sigHeaders.agentHandle.toLowerCase() !== handle.toLowerCase()) {
      return NextResponse.json(
        { success: false, error: 'Can only rotate your own key' },
        { status: 403 }
      );
    }
    
    // Parse body
    const body: RotateKeyBody = await request.json();
    
    // Validate new pubkey
    if (!body.new_pubkey) {
      return NextResponse.json(
        { success: false, error: 'new_pubkey is required' },
        { status: 400 }
      );
    }
    
    // Verify new key is valid Ed25519 (32 bytes)
    let newKeyBytes: Buffer;
    try {
      newKeyBytes = Buffer.from(body.new_pubkey, 'base64');
      if (newKeyBytes.length !== 32) {
        return NextResponse.json(
          { success: false, error: 'new_pubkey must be a 32-byte Ed25519 public key (base64-encoded)' },
          { status: 400 }
        );
      }
    } catch {
      return NextResponse.json(
        { success: false, error: 'new_pubkey must be valid base64' },
        { status: 400 }
      );
    }
    
    // Look up the agent
    const agent = await prisma.agent.findUnique({
      where: { handle: handle.toLowerCase() },
      select: {
        id: true,
        handle: true,
        pubkey: true,
        status: true,
      },
    });
    
    if (!agent) {
      return NextResponse.json(
        { success: false, error: 'Agent not found' },
        { status: 404 }
      );
    }
    
    if (agent.status !== 'ACTIVE') {
      return NextResponse.json(
        { success: false, error: `Agent is ${agent.status.toLowerCase()}` },
        { status: 403 }
      );
    }
    
    // Verify signature with CURRENT key
    const message = constructSignedMessage(
      'POST',
      `/api/v1/agents/${handle.toLowerCase()}/rotate-key`,
      sigHeaders.nonce,
      sigHeaders.signedAt,
      body
    );
    
    const isValidSignature = await verifyEd25519Signature(
      agent.pubkey,
      sigHeaders.signature,
      message
    );
    
    if (!isValidSignature) {
      return NextResponse.json(
        { success: false, error: 'Invalid signature' },
        { status: 401 }
      );
    }
    
    // Check new key isn't already in use
    const existingAgent = await prisma.agent.findUnique({
      where: { pubkey: body.new_pubkey },
      select: { handle: true },
    });
    
    if (existingAgent) {
      return NextResponse.json(
        { success: false, error: 'New public key is already registered to another agent' },
        { status: 409 }
      );
    }
    
    // Check new key isn't same as old
    if (body.new_pubkey === agent.pubkey) {
      return NextResponse.json(
        { success: false, error: 'New key must be different from current key' },
        { status: 400 }
      );
    }
    
    // Rotate the key
    const oldKeyPrefix = agent.pubkey.slice(0, 16);
    const newKeyPrefix = body.new_pubkey.slice(0, 16);
    
    await prisma.agent.update({
      where: { id: agent.id },
      data: {
        pubkey: body.new_pubkey,
        lastSeenAt: new Date(),
      },
    });
    
    // Log the rotation (critical security event)
    logger.success(AuditEvents.AGENT_KEY_ROTATED || 'AGENT_KEY_ROTATED', {
      agentId: agent.id,
      handle: agent.handle,
      oldKeyPrefix,
      newKeyPrefix,
    });
    
    console.log(`[SECURITY] Key rotation for agent ${agent.handle}: ${oldKeyPrefix}... -> ${newKeyPrefix}...`);
    
    return NextResponse.json({
      success: true,
      message: 'Key rotated successfully. Old key is now invalid.',
      agent: {
        handle: agent.handle,
        new_key_prefix: newKeyPrefix + '...',
      },
    });
    
  } catch (error) {
    console.error('Key rotation error:', error);
    
    if (error instanceof SyntaxError) {
      return NextResponse.json(
        { success: false, error: 'Invalid JSON body' },
        { status: 400 }
      );
    }
    
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}
