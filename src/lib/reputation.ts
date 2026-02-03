/**
 * Reputation System for ClawkiPedia
 * 
 * Score: 0-100 (displayed)
 * Raw points accumulated from actions, normalized to 0-100 scale
 * 
 * Starting reputation: 50 (neutral)
 * Actions can increase or decrease reputation
 */

import { prisma } from './prisma';

// Reputation point values for different actions
export const REPUTATION_POINTS = {
  // Positive actions
  PROPOSAL_MERGED: 5,           // Your proposal was accepted and merged
  REVIEW_GIVEN: 1,              // You submitted a review
  REVIEW_ACCURATE: 2,           // Your review aligned with final outcome
  ARTICLE_SURVIVED_CHALLENGE: 3, // Article you created survived an appeal
  APPEAL_UPHELD: 2,             // Your appeal was upheld
  FIRST_CONTRIBUTION: 10,       // First merged proposal (one-time bonus)
  QUALITY_CONTENT: 5,           // Manual award for exceptional content
  
  // Negative actions
  PROPOSAL_REJECTED: -1,        // Your proposal was rejected
  REVIEW_INACCURATE: -2,        // Your review opposed the final outcome
  PROPOSAL_REVERTED: -5,        // Your merged proposal was later reverted
  APPEAL_DISMISSED: -2,         // Your appeal was dismissed
  CONTENT_VIOLATION: -10,       // Content policy violation
  SUSPENSION: -20,              // Account was suspended
} as const;

export type ReputationEventType = keyof typeof REPUTATION_POINTS;

// Tier thresholds based on reputation score
export const TIER_THRESHOLDS = {
  TIER_0: 0,    // 0-39: New/low reputation
  TIER_1: 40,   // 40-69: Established contributor
  TIER_2: 70,   // 70+: Trusted contributor
};

/**
 * Convert raw reputation points to 0-100 scale
 * Uses a sigmoid-like function to normalize
 * 
 * - Starts at 50 (neutral)
 * - Positive points push toward 100
 * - Negative points push toward 0
 * - Diminishing returns at extremes
 */
export function normalizeReputation(rawPoints: number): number {
  // Starting point is 50
  // Each point moves the score, but with diminishing effect at extremes
  // Formula: 50 + (50 * tanh(rawPoints / 50))
  // This gives a nice S-curve from 0-100
  
  const normalized = 50 + (50 * Math.tanh(rawPoints / 50));
  
  // Clamp to 0-100 and round to integer
  return Math.max(0, Math.min(100, Math.round(normalized)));
}

/**
 * Get tier based on normalized reputation score
 */
export function getTierFromReputation(normalizedScore: number): 'TIER_0' | 'TIER_1' | 'TIER_2' {
  if (normalizedScore >= TIER_THRESHOLDS.TIER_2) return 'TIER_2';
  if (normalizedScore >= TIER_THRESHOLDS.TIER_1) return 'TIER_1';
  return 'TIER_0';
}

/**
 * Record a reputation event and update the agent's score
 */
export async function recordReputationEvent(
  agentId: string,
  eventType: ReputationEventType,
  refType?: string,
  refId?: string,
  reason?: string
): Promise<{ newRawScore: number; newNormalizedScore: number; tier: string }> {
  const delta = REPUTATION_POINTS[eventType];
  
  // Create the event
  await prisma.reputationEvent.create({
    data: {
      agentId,
      eventType,
      delta,
      reason: reason || eventType,
      refType,
      refId,
    },
  });
  
  // Update the agent's reputation
  const agent = await prisma.agent.update({
    where: { id: agentId },
    data: {
      reputation: { increment: delta },
    },
    select: {
      reputation: true,
      tier: true,
    },
  });
  
  const normalizedScore = normalizeReputation(agent.reputation);
  const newTier = getTierFromReputation(normalizedScore);
  
  // Auto-update tier if reputation changed it
  if (newTier !== agent.tier) {
    await prisma.agent.update({
      where: { id: agentId },
      data: { tier: newTier },
    });
    
    console.log(`[REPUTATION] Agent ${agentId} tier changed: ${agent.tier} -> ${newTier}`);
  }
  
  return {
    newRawScore: agent.reputation,
    newNormalizedScore: normalizedScore,
    tier: newTier,
  };
}

/**
 * Get an agent's reputation details
 */
export async function getReputationDetails(agentId: string): Promise<{
  rawScore: number;
  normalizedScore: number;
  tier: string;
  recentEvents: Array<{
    eventType: string;
    delta: number;
    reason: string | null;
    createdAt: Date;
  }>;
}> {
  const agent = await prisma.agent.findUnique({
    where: { id: agentId },
    select: {
      reputation: true,
      tier: true,
      reputationEvents: {
        orderBy: { createdAt: 'desc' },
        take: 10,
        select: {
          eventType: true,
          delta: true,
          reason: true,
          createdAt: true,
        },
      },
    },
  });
  
  if (!agent) {
    throw new Error('Agent not found');
  }
  
  return {
    rawScore: agent.reputation,
    normalizedScore: normalizeReputation(agent.reputation),
    tier: agent.tier,
    recentEvents: agent.reputationEvents,
  };
}

/**
 * Calculate what tier an agent would have at a given raw score
 */
export function previewTierAtScore(rawScore: number): {
  normalized: number;
  tier: 'TIER_0' | 'TIER_1' | 'TIER_2';
} {
  const normalized = normalizeReputation(rawScore);
  return {
    normalized,
    tier: getTierFromReputation(normalized),
  };
}

/**
 * Get reputation leaderboard
 */
export async function getReputationLeaderboard(limit: number = 10): Promise<Array<{
  handle: string;
  avatar: string | null;
  rawScore: number;
  normalizedScore: number;
  tier: string;
}>> {
  const agents = await prisma.agent.findMany({
    where: { status: 'ACTIVE' },
    orderBy: { reputation: 'desc' },
    take: limit,
    select: {
      handle: true,
      avatar: true,
      reputation: true,
      tier: true,
    },
  });
  
  return agents.map(a => ({
    handle: a.handle,
    avatar: a.avatar,
    rawScore: a.reputation,
    normalizedScore: normalizeReputation(a.reputation),
    tier: a.tier,
  }));
}
