import { describe, it, expect } from 'vitest';
import {
  isWithinQuietHours,
  canDispatchReminder,
  calculateMedicationConfirmationRate,
  calculateVitalsLoggingRate,
  ReminderJob,
} from '@/domain/reminders';

describe('Domain: Reminder Scheduler & Compliance Rates (Module 2)', () => {
  it('detects quiet hours correctly across midnight bounds (21:00 to 07:00)', () => {
    expect(isWithinQuietHours('22:30', '21:00', '07:00')).toBe(true);
    expect(isWithinQuietHours('02:15', '21:00', '07:00')).toBe(true);
    expect(isWithinQuietHours('06:59', '21:00', '07:00')).toBe(true);
    expect(isWithinQuietHours('08:00', '21:00', '07:00')).toBe(false);
    expect(isWithinQuietHours('14:30', '21:00', '07:00')).toBe(false);
  });

  it('evaluates reminder dispatch eligibility and consent gating', () => {
    const job: ReminderJob = {
      scheduleId: 's1',
      seniorId: 'm1',
      seniorName: 'Ramesh',
      phone: '9822011223',
      scheduledTime: '08:00',
      frequency: 'Daily',
      hasConsent: true,
      isOptedOut: false,
    };

    // Standard eligible case
    const res1 = canDispatchReminder(job, '08:00', 'Mon');
    expect(res1.canSend).toBe(true);

    // Suppressed during quiet hours
    const res2 = canDispatchReminder(job, '23:00', 'Mon');
    expect(res2.canSend).toBe(false);
    expect(res2.reason).toContain('quiet hours');

    // Blocked if consent missing
    const res3 = canDispatchReminder({ ...job, hasConsent: false }, '08:00', 'Mon');
    expect(res3.canSend).toBe(false);
    expect(res3.reason).toContain('consented');

    // Blocked if opted out
    const res4 = canDispatchReminder({ ...job, isOptedOut: true }, '08:00', 'Mon');
    expect(res4.canSend).toBe(false);
    expect(res4.reason).toContain('opted out');
  });

  it('calculates medication confirmation and vitals logging compliance rates', () => {
    expect(calculateMedicationConfirmationRate(85, 100)).toBe(85);
    expect(calculateMedicationConfirmationRate(0, 100)).toBe(0);
    expect(calculateMedicationConfirmationRate(10, 0)).toBe(0);

    expect(calculateVitalsLoggingRate(72, 90)).toBe(80);
    expect(calculateVitalsLoggingRate(0, 0)).toBe(0);
  });
});
