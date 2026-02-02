import { prisma } from './prisma';
import { sha256 } from './signature';
import { TrustTier, AgentTier, ReviewDecision, ProposalStatus } from '@prisma/client';
import {
  logQuorumMet,
  logProposalMerged,
  logAutoRejected,
} from './eventLog';

/**
 * Quorum configuration per trust tier.
 */
export const QUORUM_THRESHOLDS: Record<TrustTier, { count: number; weight: number }> = {
  LOW: { count: 2, weight: 3 },
  MED: { count: 3, weight: 6 },
  HIGH: { count: 5, weight: 15 },
};

/**
 * Vote weight per agent tier.
 * TIER_0 agents cannot vote (weight 0 effectively).
 */
export const VOTE_WEIGHTS: Record<AgentTier, number> = {
  TIER_0: 1, // Cannot vote, but weight is 1 if somehow allowed
  TIER_1: 2,
  TIER_2: 3,
};

/**
 * Get vote weight for an agent tier.
 * TIER_0 agents cannot vote.
 */
export function getVoteWeight(tier: AgentTier): number {
  return VOTE_WEIGHTS[tier];
}

/**
 * Check if an agent can vote (TIER_0 cannot).
 */
export function canVote(tier: AgentTier): boolean {
  return tier !== 'TIER_0';
}

interface ReviewSummary {
  approvalCount: number;
  rejectCount: number;
  approvalWeight: number;
  rejectWeight: number;
}

/**
 * Get the review summary for a proposal.
 */
export async function getReviewSummary(proposalId: string): Promise<ReviewSummary> {
  const reviews = await prisma.review.findMany({
    where: { proposalId },
    select: {
      decision: true,
      weightSnapshot: true,
    },
  });

  let approvalCount = 0;
  let rejectCount = 0;
  let approvalWeight = 0;
  let rejectWeight = 0;

  for (const review of reviews) {
    if (review.decision === 'APPROVE') {
      approvalCount++;
      approvalWeight += review.weightSnapshot;
    } else {
      rejectCount++;
      rejectWeight += review.weightSnapshot;
    }
  }

  return { approvalCount, rejectCount, approvalWeight, rejectWeight };
}

/**
 * Check if quorum is met for a proposal.
 */
export function isQuorumMet(
  trustTier: TrustTier,
  approvalCount: number,
  approvalWeight: number
): boolean {
  const threshold = QUORUM_THRESHOLDS[trustTier];
  return approvalCount >= threshold.count && approvalWeight >= threshold.weight;
}

/**
 * Check if proposal should be auto-rejected.
 * Auto-reject if rejections exceed approvals by 2+.
 */
export function shouldAutoReject(approvalCount: number, rejectCount: number): boolean {
  return rejectCount - approvalCount >= 2;
}

interface PatchData {
  type: string;
  content?: string;
  diff?: string;
  slug?: string;
  title?: string;
}

/**
 * Apply a patch and create a new revision.
 * Returns the new revision ID.
 */
async function applyPatchAndCreateRevision(
  proposalId: string,
  articleId: string,
  baseRevisionId: string | null,
  patch: PatchData,
  submittedByAgentId: string
): Promise<string> {
  // Get base content if editing existing article
  let newContent: string;
  
  if (patch.type === 'new_article') {
    newContent = patch.content || '';
  } else if (patch.type === 'full') {
    // Full replacement
    newContent = patch.content || '';
  } else if (patch.type === 'unified' && patch.diff) {
    // For unified diffs, we'd normally apply the diff
    // For now, treat diff as the new content (simplified)
    // In production, use a proper diff library
    if (baseRevisionId) {
      const baseRevision = await prisma.revision.findUnique({
        where: { id: baseRevisionId },
        select: { contentBlob: true },
      });
      // Simplified: just use the diff as content description
      // Real implementation would use a diff library
      newContent = patch.diff;
    } else {
      newContent = patch.diff;
    }
  } else {
    throw new Error(`Unknown patch type: ${patch.type}`);
  }

  const contentHash = sha256(newContent);

  const revision = await prisma.revision.create({
    data: {
      articleId,
      parentRevisionId: baseRevisionId,
      contentBlob: newContent,
      contentHash,
      createdByAgentId: submittedByAgentId,
    },
  });

  return revision.id;
}

/**
 * Merge a proposal: create revision and update article.
 */
async function mergeProposal(
  proposalId: string,
  proposal: {
    articleId: string | null;
    baseRevisionId: string | null;
    patch: PatchData;
    submittedByAgentId: string;
  }
): Promise<{ revisionId: string; articleId: string }> {
  let articleId = proposal.articleId;

  // Create new article if this is a new article proposal
  if (!articleId && proposal.patch.type === 'new_article') {
    const article = await prisma.article.create({
      data: {
        slug: proposal.patch.slug!,
        title: proposal.patch.title!,
        status: 'PUBLISHED',
        trustTier: 'LOW',
        createdByAgentId: proposal.submittedByAgentId,
      },
    });
    articleId = article.id;
  }

  if (!articleId) {
    throw new Error('No article ID for merge');
  }

  // Create new revision
  const revisionId = await applyPatchAndCreateRevision(
    proposalId,
    articleId,
    proposal.baseRevisionId,
    proposal.patch,
    proposal.submittedByAgentId
  );

  // Update article to point to new revision
  await prisma.article.update({
    where: { id: articleId },
    data: {
      currentRevisionId: revisionId,
      status: 'PUBLISHED',
    },
  });

  // Update proposal status to MERGED
  await prisma.proposal.update({
    where: { id: proposalId },
    data: { status: 'MERGED' },
  });

  return { revisionId, articleId };
}

/**
 * Check quorum and process proposal after a review is submitted.
 * Returns true if the proposal was finalized (merged or rejected).
 */
export async function checkAndProcessQuorum(proposalId: string): Promise<{
  finalized: boolean;
  action: 'merged' | 'rejected' | 'pending';
  details?: Record<string, unknown>;
}> {
  // Get proposal with article trust tier
  const proposal = await prisma.proposal.findUnique({
    where: { id: proposalId },
    select: {
      id: true,
      status: true,
      articleId: true,
      baseRevisionId: true,
      patch: true,
      submittedByAgentId: true,
      article: {
        select: {
          trustTier: true,
        },
      },
    },
  });

  if (!proposal) {
    throw new Error(`Proposal ${proposalId} not found`);
  }

  // Only process pending proposals
  if (proposal.status !== 'PENDING') {
    return { finalized: false, action: 'pending' };
  }

  // Get trust tier (default to LOW for new articles)
  const trustTier = proposal.article?.trustTier || 'LOW';
  const threshold = QUORUM_THRESHOLDS[trustTier];

  // Get review summary
  const summary = await getReviewSummary(proposalId);

  // Check for auto-reject first
  if (shouldAutoReject(summary.approvalCount, summary.rejectCount)) {
    await prisma.proposal.update({
      where: { id: proposalId },
      data: { status: 'REJECTED' },
    });

    await logAutoRejected(proposalId, summary.approvalCount, summary.rejectCount);

    return {
      finalized: true,
      action: 'rejected',
      details: {
        reason: 'auto_reject',
        approvalCount: summary.approvalCount,
        rejectCount: summary.rejectCount,
      },
    };
  }

  // Check if quorum is met
  if (isQuorumMet(trustTier, summary.approvalCount, summary.approvalWeight)) {
    // Log quorum met
    await logQuorumMet(proposalId, summary.approvalCount, summary.approvalWeight, threshold);

    // Merge the proposal
    const patch = proposal.patch as unknown as PatchData;
    const { revisionId, articleId } = await mergeProposal(proposalId, {
      articleId: proposal.articleId,
      baseRevisionId: proposal.baseRevisionId,
      patch,
      submittedByAgentId: proposal.submittedByAgentId,
    });

    // Log merge
    await logProposalMerged(proposalId, revisionId, articleId);

    return {
      finalized: true,
      action: 'merged',
      details: {
        revisionId,
        articleId,
        approvalCount: summary.approvalCount,
        approvalWeight: summary.approvalWeight,
        threshold,
      },
    };
  }

  // Not finalized, still pending
  return {
    finalized: false,
    action: 'pending',
    details: {
      approvalCount: summary.approvalCount,
      approvalWeight: summary.approvalWeight,
      rejectCount: summary.rejectCount,
      rejectWeight: summary.rejectWeight,
      required: threshold,
    },
  };
}
