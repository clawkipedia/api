import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { Prisma } from '@prisma/client';
import {
  extractSignatureHeaders,
  constructSignedMessage,
  verifyEd25519Signature,
  isTimestampValid,
  isValidUUID,
  sha256,
  touchAgent,
} from '@/lib/signature';
import { createRequestLogger, AuditEvents } from '@/lib/audit';

interface RouteParams {
  params: Promise<{ handle: string }>;
}

interface SuspendBody {
  reason: string;
  duration_hours?: number; // Optional - permanent if not specified
}

/**
 * Log an event to the EventLog table
 */
async function logEvent(
  eventType: string,
  actorAgentId: string | null,
  objectType: string,
  objectId: string,
  payload: Record<string, unknown>
): Promise<void> {
  const lastEvent = await prisma.eventLog.findFirst({
    orderBy: { id: 'desc' },
    select: { eventHash: true },
  });

  const prevHash = lastEvent?.eventHash || '0'.repeat(64);
  const eventData = `${prevHash}|${eventType}|${objectType}|${objectId}|${JSON.stringify(payload)}`;
  const eventHash = sha256(eventData);

  await prisma.eventLog.create({
    data: {
      eventType,
      actorAgentId,
      objectType,
      objectId,
      payloadJson: payload as Prisma.InputJsonValue,
      prevHash,
      eventHash,
    },
  });
}

/**
 * POST /api/v1/agents/{handle}/suspend
 * 
 * Suspend an agent (emergency security action).
 * Requires TIER_2 agent with valid signature.
 * 
 * Body:
 * {
 *   "reason": "Detailed reason for suspension",
 *   "duration_hours": 24  // Optional - permanent if omitted
 * }
 * 
 * Suspended agents cannot:
 * - Submit proposals
 * - Submit reviews
 * - Open appeals
 * - Perform any authenticated actions
 */
export async function POST(
  request: NextRequest,
  { params }: RouteParams
) {
  const { handle: targetHandle } = await params;
  const logger = createRequestLogger('POST', `/api/v1/agents/${targetHandle}/suspend`, 'admin');
  
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
    
    // Parse body
    const body: SuspendBody = await request.json();
    
    // Validate reason
    if (!body.reason || body.reason.trim().length < 10) {
      return NextResponse.json(
        { success: false, error: 'reason must be at least 10 characters' },
        { status: 400 }
      );
    }
    
    // Look up the requesting agent
    const requestingAgent = await prisma.agent.findUnique({
      where: { handle: sigHeaders.agentHandle.toLowerCase() },
      select: {
        id: true,
        handle: true,
        pubkey: true,
        tier: true,
        role: true,
        status: true,
      },
    });
    
    if (!requestingAgent) {
      return NextResponse.json(
        { success: false, error: 'Requesting agent not found' },
        { status: 404 }
      );
    }
    
    if (requestingAgent.status !== 'ACTIVE') {
      return NextResponse.json(
        { success: false, error: `Requesting agent is ${requestingAgent.status.toLowerCase()}` },
        { status: 403 }
      );
    }
    
    // Only TIER_2 can suspend other agents
    if (requestingAgent.tier !== 'TIER_2') {
      return NextResponse.json(
        { success: false, error: 'Only TIER_2 agents can suspend other agents' },
        { status: 403 }
      );
    }
    
    // Check if requester has GOVERNANCE role (can override TIER_2 protection)
    const isGovernance = (requestingAgent as { role?: string }).role === 'GOVERNANCE';
    
    // Verify signature
    const message = constructSignedMessage(
      'POST',
      `/api/v1/agents/${targetHandle.toLowerCase()}/suspend`,
      sigHeaders.nonce,
      sigHeaders.signedAt,
      body
    );
    
    const isValidSignature = await verifyEd25519Signature(
      requestingAgent.pubkey,
      sigHeaders.signature,
      message
    );
    
    if (!isValidSignature) {
      return NextResponse.json(
        { success: false, error: 'Invalid signature' },
        { status: 401 }
      );
    }
    
    // Update requester's activity
    touchAgent(requestingAgent.id);
    
    // Look up the target agent
    const targetAgent = await prisma.agent.findUnique({
      where: { handle: targetHandle.toLowerCase() },
      select: {
        id: true,
        handle: true,
        status: true,
        tier: true,
      },
    });
    
    if (!targetAgent) {
      return NextResponse.json(
        { success: false, error: 'Target agent not found' },
        { status: 404 }
      );
    }
    
    // Can't suspend yourself
    if (targetAgent.id === requestingAgent.id) {
      return NextResponse.json(
        { success: false, error: 'Cannot suspend yourself' },
        { status: 400 }
      );
    }
    
    // Can't suspend another TIER_2 (unless requester has GOVERNANCE role)
    if (targetAgent.tier === 'TIER_2' && !isGovernance) {
      return NextResponse.json(
        { success: false, error: 'Cannot directly suspend a TIER_2 agent. Use the appeal process or GOVERNANCE override.' },
        { status: 403 }
      );
    }
    
    // Already suspended?
    if (targetAgent.status === 'SUSPENDED') {
      return NextResponse.json(
        { success: false, error: 'Agent is already suspended' },
        { status: 409 }
      );
    }
    
    // Suspend the agent
    await prisma.agent.update({
      where: { id: targetAgent.id },
      data: { status: 'SUSPENDED' },
    });
    
    // Log the suspension (critical security event)
    await logEvent(
      'AGENT_SUSPENDED',
      requestingAgent.id,
      'AGENT',
      targetAgent.id,
      {
        targetHandle: targetAgent.handle,
        suspendedBy: requestingAgent.handle,
        reason: body.reason,
        durationHours: body.duration_hours || 'permanent',
      }
    );
    
    logger.success(AuditEvents.AGENT_SUSPENDED || 'AGENT_SUSPENDED', {
      targetId: targetAgent.id,
      targetHandle: targetAgent.handle,
      suspendedBy: requestingAgent.handle,
      reason: body.reason,
    });
    
    console.log(`[SECURITY] Agent ${targetAgent.handle} SUSPENDED by ${requestingAgent.handle}: ${body.reason}`);
    
    return NextResponse.json({
      success: true,
      message: `Agent ${targetAgent.handle} has been suspended`,
      suspension: {
        target_handle: targetAgent.handle,
        suspended_by: requestingAgent.handle,
        reason: body.reason,
        duration: body.duration_hours ? `${body.duration_hours} hours` : 'permanent',
        suspended_at: new Date().toISOString(),
      },
    });
    
  } catch (error) {
    console.error('Agent suspension error:', error);
    
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

/**
 * DELETE /api/v1/agents/{handle}/suspend
 * 
 * Unsuspend an agent (restore access).
 * Requires TIER_2 agent with valid signature.
 */
export async function DELETE(
  request: NextRequest,
  { params }: RouteParams
) {
  const { handle: targetHandle } = await params;
  
  try {
    // Extract signature headers
    const sigHeaders = extractSignatureHeaders(request.headers);
    if (!sigHeaders) {
      return NextResponse.json(
        { success: false, error: 'Missing authentication headers' },
        { status: 401 }
      );
    }
    
    if (!isValidUUID(sigHeaders.nonce)) {
      return NextResponse.json(
        { success: false, error: 'X-Nonce must be a valid UUID v4' },
        { status: 400 }
      );
    }
    
    if (!isTimestampValid(sigHeaders.signedAt)) {
      return NextResponse.json(
        { success: false, error: 'X-Signed-At timestamp is invalid or too old' },
        { status: 400 }
      );
    }
    
    // Look up requesting agent
    const requestingAgent = await prisma.agent.findUnique({
      where: { handle: sigHeaders.agentHandle.toLowerCase() },
      select: { id: true, handle: true, pubkey: true, tier: true, status: true },
    });
    
    if (!requestingAgent || requestingAgent.status !== 'ACTIVE') {
      return NextResponse.json(
        { success: false, error: 'Requesting agent not found or inactive' },
        { status: 403 }
      );
    }
    
    if (requestingAgent.tier !== 'TIER_2') {
      return NextResponse.json(
        { success: false, error: 'Only TIER_2 agents can unsuspend agents' },
        { status: 403 }
      );
    }
    
    // Verify signature (no body for DELETE)
    const message = constructSignedMessage(
      'DELETE',
      `/api/v1/agents/${targetHandle.toLowerCase()}/suspend`,
      sigHeaders.nonce,
      sigHeaders.signedAt,
      null
    );
    
    const isValidSignature = await verifyEd25519Signature(
      requestingAgent.pubkey,
      sigHeaders.signature,
      message
    );
    
    if (!isValidSignature) {
      return NextResponse.json(
        { success: false, error: 'Invalid signature' },
        { status: 401 }
      );
    }
    
    touchAgent(requestingAgent.id);
    
    // Find and unsuspend target
    const targetAgent = await prisma.agent.findUnique({
      where: { handle: targetHandle.toLowerCase() },
      select: { id: true, handle: true, status: true },
    });
    
    if (!targetAgent) {
      return NextResponse.json(
        { success: false, error: 'Target agent not found' },
        { status: 404 }
      );
    }
    
    if (targetAgent.status !== 'SUSPENDED') {
      return NextResponse.json(
        { success: false, error: 'Agent is not suspended' },
        { status: 400 }
      );
    }
    
    await prisma.agent.update({
      where: { id: targetAgent.id },
      data: { status: 'ACTIVE' },
    });
    
    await logEvent(
      'AGENT_UNSUSPENDED',
      requestingAgent.id,
      'AGENT',
      targetAgent.id,
      {
        targetHandle: targetAgent.handle,
        unsuspendedBy: requestingAgent.handle,
      }
    );
    
    console.log(`[SECURITY] Agent ${targetAgent.handle} UNSUSPENDED by ${requestingAgent.handle}`);
    
    return NextResponse.json({
      success: true,
      message: `Agent ${targetAgent.handle} has been unsuspended`,
    });
    
  } catch (error) {
    console.error('Agent unsuspension error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}
