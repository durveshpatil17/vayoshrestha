import { describe, it, expect } from 'vitest';
import {
  canTransitionSos,
  calculateSosSlaRemaining,
  determineEscalationLevel,
  isDrillEvent,
} from '@/domain/sos';

describe('Domain: SOS Lifecycle, SLA Countdown & Escalation Chain (Module 1)', () => {
  it('enforces legal state transitions only', () => {
    expect(canTransitionSos('Triggered', 'Acknowledged')).toBe(true);
    expect(canTransitionSos('Triggered', 'CancelledBySenior')).toBe(true);
    expect(canTransitionSos('Triggered', 'Resolved')).toBe(false); // cannot jump directly without ack/assign
    expect(canTransitionSos('Acknowledged', 'Assigned')).toBe(true);
    expect(canTransitionSos('Acknowledged', 'Resolved')).toBe(true);
    expect(canTransitionSos('CancelledBySenior', 'Resolved')).toBe(true); // human confirms
    expect(canTransitionSos('Resolved', 'Triggered')).toBe(false); // terminal state
  });

  it('calculates SLA countdown and detects breaches', () => {
    const now = Date.now();
    const triggered1MinAgo = new Date(now - 60 * 1000).toISOString();
    const sla1 = calculateSosSlaRemaining(triggered1MinAgo, 2, undefined, now);
    expect(sla1.isBreached).toBe(false);
    expect(sla1.remainingSeconds).toBe(60);

    const triggered3MinAgo = new Date(now - 180 * 1000).toISOString();
    const sla2 = calculateSosSlaRemaining(triggered3MinAgo, 2, undefined, now);
    expect(sla2.isBreached).toBe(true);
    expect(sla2.remainingSeconds).toBeLessThan(0);
  });

  it('escalates chain automatically if unacknowledged', () => {
    const now = Date.now();
    const t0 = new Date(now - 30 * 1000).toISOString(); // 30 sec ago
    expect(determineEscalationLevel(t0, undefined, now)).toBe(1); // CM

    const t2 = new Date(now - 150 * 1000).toISOString(); // 2.5 min ago
    expect(determineEscalationLevel(t2, undefined, now)).toBe(2); // RA

    const t5 = new Date(now - 350 * 1000).toISOString(); // 5.8 min ago
    expect(determineEscalationLevel(t5, undefined, now)).toBe(3); // NM / Care Team
  });

  it('identifies drill mode events cleanly', () => {
    expect(isDrillEvent({ isDrill: true })).toBe(true);
    expect(isDrillEvent({ isDrill: false })).toBe(false);
  });
});
