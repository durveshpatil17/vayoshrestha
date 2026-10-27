import { describe, it, expect } from 'vitest';
import {
  isAttendanceLocked,
  getLockRemainingHours,
  validateCorrectionRequest,
  canApproveCorrection,
} from '@/domain/attendance';

describe('Attendance Lock & Corrections (FR-19–22)', () => {
  const sessionEndTime = '2026-10-27T10:00:00.000Z';
  const lockWindowHours = 12;

  it('should allow volunteer/coordinator to mark attendance before lock window expires', () => {
    // 4 hours after session
    const currentTime = '2026-10-27T14:00:00.000Z';
    expect(isAttendanceLocked(sessionEndTime, lockWindowHours, currentTime)).toBe(false);
    expect(getLockRemainingHours(sessionEndTime, lockWindowHours, currentTime)).toBe(8);
  });

  it('should lock attendance once configured window has passed', () => {
    // 13 hours after session
    const currentTime = '2026-10-27T23:00:00.000Z';
    expect(isAttendanceLocked(sessionEndTime, lockWindowHours, currentTime)).toBe(true);
    expect(getLockRemainingHours(sessionEndTime, lockWindowHours, currentTime)).toBe(0);
  });

  it('should validate correction request requiring reason and changed status', () => {
    const validRequest = {
      memberId: 'm-10',
      sessionId: 'sess-1',
      previousStatus: 'Absent' as const,
      requestedStatus: 'Present' as const,
      reason: 'Senior arrived late and was missed in the initial manual roll call',
      requesterId: 'u-vf-1',
    };
    expect(validateCorrectionRequest(validRequest).valid).toBe(true);

    const invalidRequest = {
      ...validRequest,
      reason: '', // missing mandatory reason
    };
    expect(validateCorrectionRequest(invalidRequest).valid).toBe(false);
  });

  it('should enforce maker-checker: requester cannot approve their own correction request', () => {
    const correction = {
      id: 'corr-1',
      requesterId: 'u-vf-1',
      centreId: 'HUB-PUN',
      status: 'Pending' as const,
    };

    // Requester cannot approve
    expect(
      canApproveCorrection({
        correction,
        approverId: 'u-vf-1',
        approverRole: 'CC',
        approverCentres: ['HUB-PUN'],
      })
    ).toBe(false);

    // Different coordinator at same centre can approve
    expect(
      canApproveCorrection({
        correction,
        approverId: 'u-cc-1',
        approverRole: 'CC',
        approverCentres: ['HUB-PUN'],
      })
    ).toBe(true);

    // Coordinator at different centre cannot approve
    expect(
      canApproveCorrection({
        correction,
        approverId: 'u-cc-2',
        approverRole: 'CC',
        approverCentres: ['HUB-NSK'],
      })
    ).toBe(false);
  });
});
