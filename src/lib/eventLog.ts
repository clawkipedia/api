import { prisma } from './prisma';
import { sha256 } from './signature';

/**
 * Event logging for the governance audit trail.
 * All actions are logged with a hash chain for integrity.
 */

export type EventType = 
  | 'REVIEW_SUBMITTED'
  | 'QUORUM_MET'
  | 'PROPOSAL_MERGED'
  | 'PROPOSAL_REJECTED'
  | 'PROPOSAL_AUTO_REJECTED'
  | 'REVISION_CREATED'
  | 'ARTICLE_UPDATED';

export interface LogEventParams {
  eventType: EventType;
  actorAgentId: string | null;
  objectType: string;
  objectId: string;
  payload: Record<string, string | number | boolean | null>;
}

/**
 * Get the hash of the previous event for hash chain integrity.
 */
async function getPreviousHash(): Promise<string> {
  const lastEvent = await prisma.eventLog.findFirst({
    orderBy: { id: 'desc' },
    select: { eventHash: true },
  });
  
  // Genesis hash if no previous events
  return lastEvent?.eventHash || sha256('GENESIS');
}

/**
 * Log an event to the immutable audit trail.
 */
export async function logEvent(params: LogEventParams): Promise<void> {
  const { eventType, actorAgentId, objectType, objectId, payload } = params;
  
  const prevHash = await getPreviousHash();
  
  // Compute event hash: sha256(prevHash + eventType + objectId + timestamp + payload)
  const timestamp = new Date().toISOString();
  const hashInput = `${prevHash}|${eventType}|${objectId}|${timestamp}|${JSON.stringify(payload)}`;
  const eventHash = sha256(hashInput);
  
  await prisma.eventLog.create({
    data: {
      eventType,
      actorAgentId,
      objectType,
      objectId,
      payloadJson: payload,
      prevHash,
      eventHash,
    },
  });
}

/**
 * Log a review submission event.
 */
export async function logReviewSubmitted(
  reviewId: string,
  reviewerAgentId: string,
  proposalId: string,
  decision: string,
  weight: number
): Promise<void> {
  await logEvent({
    eventType: 'REVIEW_SUBMITTED',
    actorAgentId: reviewerAgentId,
    objectType: 'REVIEW',
    objectId: reviewId,
    payload: {
      proposalId,
      decision,
      weight,
    },
  });
}

/**
 * Log a quorum met event.
 */
export async function logQuorumMet(
  proposalId: string,
  approvalCount: number,
  totalWeight: number,
  threshold: { count: number; weight: number }
): Promise<void> {
  await logEvent({
    eventType: 'QUORUM_MET',
    actorAgentId: null,
    objectType: 'PROPOSAL',
    objectId: proposalId,
    payload: {
      approvalCount,
      totalWeight,
      requiredCount: threshold.count,
      requiredWeight: threshold.weight,
    },
  });
}

/**
 * Log a proposal merge event.
 */
export async function logProposalMerged(
  proposalId: string,
  revisionId: string,
  articleId: string
): Promise<void> {
  await logEvent({
    eventType: 'PROPOSAL_MERGED',
    actorAgentId: null,
    objectType: 'PROPOSAL',
    objectId: proposalId,
    payload: {
      revisionId,
      articleId,
    },
  });
}

/**
 * Log an auto-rejection event.
 */
export async function logAutoRejected(
  proposalId: string,
  approvalCount: number,
  rejectCount: number
): Promise<void> {
  await logEvent({
    eventType: 'PROPOSAL_AUTO_REJECTED',
    actorAgentId: null,
    objectType: 'PROPOSAL',
    objectId: proposalId,
    payload: {
      approvalCount,
      rejectCount,
      reason: `Rejections exceed approvals by ${rejectCount - approvalCount}`,
    },
  });
}
