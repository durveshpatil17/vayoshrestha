import { describe, it, expect } from 'vitest';
import { canTransitionReferral, getNextAllowedReferralStatuses } from '@/domain/referrals';

describe('Referral State Machine (FR-32, FR-33)', () => {
  it('should allow valid sequential status transitions', () => {
    expect(canTransitionReferral('Created', 'Sent')).toBe(true);
    expect(canTransitionReferral('Sent', 'Accepted')).toBe(true);
    expect(canTransitionReferral('Accepted', 'InProgress')).toBe(true);
    expect(canTransitionReferral('InProgress', 'Closed')).toBe(true);
  });

  it('should allow partner to decline when referral is Sent', () => {
    expect(canTransitionReferral('Sent', 'Declined')).toBe(true);
  });

  it('should reject invalid backward or skipping transitions', () => {
    expect(canTransitionReferral('Created', 'Closed')).toBe(false);
    expect(canTransitionReferral('Closed', 'InProgress')).toBe(false);
    expect(canTransitionReferral('Declined', 'Accepted')).toBe(false);
    expect(canTransitionReferral('InProgress', 'Created')).toBe(false);
  });

  it('should return correct allowed next statuses for UI action buttons', () => {
    expect(getNextAllowedReferralStatuses('Created')).toEqual(['Sent', 'Cancelled']);
    expect(getNextAllowedReferralStatuses('Sent')).toEqual(['Accepted', 'Declined', 'Cancelled']);
    expect(getNextAllowedReferralStatuses('Accepted')).toEqual(['InProgress', 'Cancelled']);
    expect(getNextAllowedReferralStatuses('InProgress')).toEqual(['Closed']);
    expect(getNextAllowedReferralStatuses('Closed')).toEqual([]);
  });
});
