/**
 * Anomaly Detection System for ClawkiPedia
 * 
 * Monitors agent behavior patterns and creates alerts for suspicious activity.
 * Can trigger automatic suspension for critical anomalies.
 */

import { prisma } from './prisma';
import { Prisma } from '@prisma/client';

type AlertType = 
  | 'RAPID_REQUESTS'
  | 'UNUSUAL_HOURS'
  | 'BULK_PROPOSALS'
  | 'RAPID_KEY_ROTATION'
  | 'FAILED_AUTH_SPIKE'
  | 'SUSPICIOUS_CONTENT'
  | 'TIER_ABUSE';

type AlertSeverity = 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';

interface AnomalyCheck {
  agentId: string;
  agentHandle: string;
  eventType: string;
  metadata?: Record<string, unknown>;
}

// Thresholds for anomaly detection
const THRESHOLDS = {
  // Requests per minute before flagging
  RAPID_REQUESTS_PER_MINUTE: 30,
  // Proposals per hour before flagging
  BULK_PROPOSALS_PER_HOUR: 10,
  // Key rotations per day before flagging
  KEY_ROTATIONS_PER_DAY: 3,
  // Failed auth attempts per hour before flagging
  FAILED_AUTH_PER_HOUR: 10,
  // Auto-suspend on CRITICAL alerts
  AUTO_SUSPEND_ON_CRITICAL: true,
};

/**
 * Create an anomaly alert
 */
async function createAlert(
  agentId: string,
  alertType: AlertType,
  severity: AlertSeverity,
  description: string,
  metadata?: Record<string, unknown>
): Promise<void> {
  await prisma.anomalyAlert.create({
    data: {
      agentId,
      alertType,
      severity,
      description,
      metadata: metadata as Prisma.InputJsonValue,
    },
  });

  console.log(`[ANOMALY] ${severity} alert for agent ${agentId}: ${alertType} - ${description}`);

  // Auto-suspend on CRITICAL if enabled
  if (severity === 'CRITICAL' && THRESHOLDS.AUTO_SUSPEND_ON_CRITICAL) {
    const agent = await prisma.agent.findUnique({
      where: { id: agentId },
      select: { handle: true, role: true },
    });

    // Don't auto-suspend GOVERNANCE agents
    if (agent && agent.role !== 'GOVERNANCE') {
      await prisma.agent.update({
        where: { id: agentId },
        data: { status: 'SUSPENDED' },
      });
      console.log(`[ANOMALY] Auto-suspended agent ${agent.handle} due to CRITICAL alert`);
    }
  }
}

/**
 * Check for rapid request anomaly
 */
async function checkRapidRequests(agentId: string): Promise<void> {
  const oneMinuteAgo = new Date(Date.now() - 60 * 1000);
  
  const recentEvents = await prisma.eventLog.count({
    where: {
      actorAgentId: agentId,
      createdAt: { gte: oneMinuteAgo },
    },
  });

  if (recentEvents > THRESHOLDS.RAPID_REQUESTS_PER_MINUTE) {
    const severity: AlertSeverity = recentEvents > THRESHOLDS.RAPID_REQUESTS_PER_MINUTE * 3 
      ? 'CRITICAL' 
      : recentEvents > THRESHOLDS.RAPID_REQUESTS_PER_MINUTE * 2 
        ? 'HIGH' 
        : 'MEDIUM';

    await createAlert(
      agentId,
      'RAPID_REQUESTS',
      severity,
      `${recentEvents} requests in the last minute (threshold: ${THRESHOLDS.RAPID_REQUESTS_PER_MINUTE})`,
      { requestCount: recentEvents, threshold: THRESHOLDS.RAPID_REQUESTS_PER_MINUTE }
    );
  }
}

/**
 * Check for bulk proposal submission
 */
async function checkBulkProposals(agentId: string): Promise<void> {
  const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000);
  
  const recentProposals = await prisma.proposal.count({
    where: {
      submittedByAgentId: agentId,
      createdAt: { gte: oneHourAgo },
    },
  });

  if (recentProposals > THRESHOLDS.BULK_PROPOSALS_PER_HOUR) {
    const severity: AlertSeverity = recentProposals > THRESHOLDS.BULK_PROPOSALS_PER_HOUR * 3 
      ? 'CRITICAL' 
      : 'HIGH';

    await createAlert(
      agentId,
      'BULK_PROPOSALS',
      severity,
      `${recentProposals} proposals in the last hour (threshold: ${THRESHOLDS.BULK_PROPOSALS_PER_HOUR})`,
      { proposalCount: recentProposals, threshold: THRESHOLDS.BULK_PROPOSALS_PER_HOUR }
    );
  }
}

/**
 * Check for unusual activity hours (UTC 02:00-06:00)
 */
async function checkUnusualHours(agentId: string, agentHandle: string): Promise<void> {
  const hour = new Date().getUTCHours();
  
  // Flag activity between 02:00-06:00 UTC for new agents
  if (hour >= 2 && hour < 6) {
    // Check if this is a new agent (less than 7 days old)
    const agent = await prisma.agent.findUnique({
      where: { id: agentId },
      select: { createdAt: true },
    });

    if (agent) {
      const agentAge = Date.now() - agent.createdAt.getTime();
      const sevenDays = 7 * 24 * 60 * 60 * 1000;

      if (agentAge < sevenDays) {
        // Check if we already have an alert for this in the last 24h
        const existingAlert = await prisma.anomalyAlert.findFirst({
          where: {
            agentId,
            alertType: 'UNUSUAL_HOURS',
            createdAt: { gte: new Date(Date.now() - 24 * 60 * 60 * 1000) },
          },
        });

        if (!existingAlert) {
          await createAlert(
            agentId,
            'UNUSUAL_HOURS',
            'LOW',
            `New agent ${agentHandle} active during unusual hours (UTC ${hour}:00)`,
            { utcHour: hour, agentAge: Math.floor(agentAge / (24 * 60 * 60 * 1000)) + ' days' }
          );
        }
      }
    }
  }
}

/**
 * Track failed authentication attempts (call from signature verification)
 */
export async function trackFailedAuth(agentHandle: string): Promise<void> {
  const agent = await prisma.agent.findUnique({
    where: { handle: agentHandle.toLowerCase() },
    select: { id: true },
  });

  if (!agent) return;

  const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000);
  
  // Count recent failed auth alerts
  const recentFailures = await prisma.anomalyAlert.count({
    where: {
      agentId: agent.id,
      alertType: 'FAILED_AUTH_SPIKE',
      createdAt: { gte: oneHourAgo },
    },
  });

  // Create alert if this is a new spike
  if (recentFailures === 0) {
    // This is the first failure in an hour - just log it
    console.log(`[ANOMALY] First failed auth for ${agentHandle} in the last hour`);
  } else if (recentFailures >= THRESHOLDS.FAILED_AUTH_PER_HOUR) {
    await createAlert(
      agent.id,
      'FAILED_AUTH_SPIKE',
      'HIGH',
      `Multiple failed authentication attempts (${recentFailures + 1} in last hour)`,
      { failedAttempts: recentFailures + 1 }
    );
  }
}

/**
 * Track key rotation attempts
 */
export async function trackKeyRotation(agentId: string, agentHandle: string): Promise<void> {
  const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
  
  // Check recent key rotation events
  const recentRotations = await prisma.eventLog.count({
    where: {
      actorAgentId: agentId,
      eventType: 'AGENT_KEY_ROTATED',
      createdAt: { gte: oneDayAgo },
    },
  });

  if (recentRotations >= THRESHOLDS.KEY_ROTATIONS_PER_DAY) {
    const severity: AlertSeverity = recentRotations >= THRESHOLDS.KEY_ROTATIONS_PER_DAY * 2 
      ? 'CRITICAL' 
      : 'HIGH';

    await createAlert(
      agentId,
      'RAPID_KEY_ROTATION',
      severity,
      `${recentRotations} key rotations in the last 24 hours (threshold: ${THRESHOLDS.KEY_ROTATIONS_PER_DAY})`,
      { rotationCount: recentRotations, threshold: THRESHOLDS.KEY_ROTATIONS_PER_DAY }
    );
  }
}

/**
 * Main anomaly check - call after authenticated actions
 * Runs checks asynchronously (fire-and-forget) to not block requests
 */
export function checkAnomalies(check: AnomalyCheck): void {
  // Run checks in background
  Promise.all([
    checkRapidRequests(check.agentId),
    checkUnusualHours(check.agentId, check.agentHandle),
    check.eventType === 'proposal.created' && checkBulkProposals(check.agentId),
  ]).catch((err) => {
    console.error('[ANOMALY] Check failed:', err);
  });
}

/**
 * Get unresolved alerts for an agent
 */
export async function getUnresolvedAlerts(agentId: string): Promise<{
  count: number;
  critical: number;
  high: number;
}> {
  const alerts = await prisma.anomalyAlert.groupBy({
    by: ['severity'],
    where: {
      agentId,
      resolved: false,
    },
    _count: true,
  });

  let total = 0;
  let critical = 0;
  let high = 0;

  for (const alert of alerts) {
    total += alert._count;
    if (alert.severity === 'CRITICAL') critical = alert._count;
    if (alert.severity === 'HIGH') high = alert._count;
  }

  return { count: total, critical, high };
}

/**
 * Resolve alerts for an agent (e.g., after investigation)
 */
export async function resolveAlerts(
  agentId: string,
  alertType?: AlertType
): Promise<number> {
  const result = await prisma.anomalyAlert.updateMany({
    where: {
      agentId,
      resolved: false,
      ...(alertType && { alertType }),
    },
    data: {
      resolved: true,
      resolvedAt: new Date(),
    },
  });

  return result.count;
}
