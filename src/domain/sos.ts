import { SosStatus, SosEvent } from '@/api/contracts';

export const VALID_SOS_TRANSITIONS: Record<SosStatus, SosStatus[]> = {
  Triggered: ['Acknowledged', 'CancelledBySenior'],
  Acknowledged: ['Assigned', 'Resolved', 'CancelledBySenior'],
  Assigned: ['Resolved', 'CancelledBySenior'],
  CancelledBySenior: ['Resolved'], // Human must review and close/resolve even if cancelled
  Resolved: [],
};

export function canTransitionSos(from: SosStatus, to: SosStatus): boolean {
  if (from === to) return true;
  const allowed = VALID_SOS_TRANSITIONS[from];
  return allowed ? allowed.includes(to) : false;
}

/**
 * Calculates remaining SLA countdown in seconds.
 * @param triggeredAt ISO string
 * @param ackSlaMinutes default 2 minutes
 * @param acknowledgedAt optional ISO string
 */
export function calculateSosSlaRemaining(
  triggeredAt: string,
  ackSlaMinutes: number = 2,
  acknowledgedAt?: string,
  nowMs: number = Date.now()
): { remainingSeconds: number; isBreached: boolean } {
  const triggerMs = new Date(triggeredAt).getTime();
  const slaTargetMs = triggerMs + ackSlaMinutes * 60 * 1000;

  if (acknowledgedAt) {
    const ackMs = new Date(acknowledgedAt).getTime();
    const remaining = Math.round((slaTargetMs - ackMs) / 1000);
    return {
      remainingSeconds: Math.max(0, remaining),
      isBreached: ackMs > slaTargetMs,
    };
  }

  const remaining = Math.round((slaTargetMs - nowMs) / 1000);
  return {
    remainingSeconds: remaining,
    isBreached: remaining < 0,
  };
}

/**
 * Determines current escalation level based on time unacknowledged:
 * Level 1 (CM): 0 - 2 mins
 * Level 2 (RA): 2 - 5 mins
 * Level 3 (NM/CT): > 5 mins
 */
export function determineEscalationLevel(
  triggeredAt: string,
  acknowledgedAt?: string,
  nowMs: number = Date.now()
): number {
  if (acknowledgedAt) {
    return 1; // Locked once acknowledged
  }

  const elapsedMinutes = (nowMs - new Date(triggeredAt).getTime()) / (60 * 1000);

  if (elapsedMinutes >= 5) {
    return 3;
  }
  if (elapsedMinutes >= 2) {
    return 2;
  }
  return 1;
}

/**
 * Checks whether an SOS event is a simulated drill event.
 */
export function isDrillEvent(event: Partial<SosEvent>): boolean {
  return Boolean(event.isDrill);
}

export function getMinutesToSlaBreach(triggeredAt: string, ackSlaMinutes: number = 2): number {
  const elapsedMinutes = (Date.now() - new Date(triggeredAt).getTime()) / (60 * 1000);
  return Math.max(0, ackSlaMinutes - elapsedMinutes);
}
