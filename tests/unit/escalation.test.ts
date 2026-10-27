import { describe, it, expect } from 'vitest';
import {
  evaluateWarningSigns,
  calculateSlaStatus,
  formatSlaCountdown,
} from '@/domain/escalation';

describe('Health Escalation & SLA Clock (FR-39, FR-40, FR-42)', () => {
  it('should detect critical warning keywords in message or coordinator note', () => {
    const text = 'Senior reported severe chest pain and breathlessness during morning walk';
    const match = evaluateWarningSigns(text);
    expect(match.triggered).toBe(true);
    expect(match.severity).toBe('Immediate');
    expect(match.matchedKeywords).toContain('chest pain');
    expect(match.slaHours).toBe(2);
  });

  it('should detect moderate welfare warning signs like fall or dizziness', () => {
    const text = 'Member experienced sudden dizziness near the centre gate';
    const match = evaluateWarningSigns(text);
    expect(match.triggered).toBe(true);
    expect(match.severity).toBe('High');
    expect(match.matchedKeywords).toContain('dizziness');
    expect(match.slaHours).toBe(6);
  });

  it('should return no trigger for benign social or inquiry text', () => {
    const text = 'Senior asking for timings of the next smartphone literacy session';
    const match = evaluateWarningSigns(text);
    expect(match.triggered).toBe(false);
    expect(match.matchedKeywords).toHaveLength(0);
  });

  it('should calculate SLA remaining time and breached status correctly', () => {
    const createdAt = '2026-10-27T10:00:00.000Z';
    const slaHours = 2; // expires at 12:00:00Z

    // 1 hour in: 60 minutes remaining
    const current1 = '2026-10-27T11:00:00.000Z';
    const status1 = calculateSlaStatus(createdAt, slaHours, current1);
    expect(status1.isBreached).toBe(false);
    expect(status1.remainingMinutes).toBe(60);
    expect(formatSlaCountdown(status1.remainingMinutes)).toBe('1h 0m left');

    // 2.5 hours in: 30 minutes overdue (breached)
    const current2 = '2026-10-27T12:30:00.000Z';
    const status2 = calculateSlaStatus(createdAt, slaHours, current2);
    expect(status2.isBreached).toBe(true);
    expect(status2.overdueMinutes).toBe(30);
    expect(formatSlaCountdown(status2.remainingMinutes)).toBe('30m overdue');
  });
});
