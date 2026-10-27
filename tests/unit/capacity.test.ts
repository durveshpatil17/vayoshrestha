import { describe, it, expect } from 'vitest';
import {
  evaluateRegistrationStatus,
  promoteNextWaitlistedMember,
  canAcceptWalkIn,
} from '@/domain/capacity';

describe('Capacity & Waitlist Management (FR-17, FR-18)', () => {
  it('should confirm registration when current count is below capacity', () => {
    const status = evaluateRegistrationStatus({
      capacity: 30,
      confirmedCount: 25,
      waitlistEnabled: true,
    });
    expect(status).toBe('Confirmed');
  });

  it('should place on waitlist when confirmed count reaches capacity and waitlist is enabled', () => {
    const status = evaluateRegistrationStatus({
      capacity: 30,
      confirmedCount: 30,
      waitlistEnabled: true,
    });
    expect(status).toBe('Waitlisted');
  });

  it('should reject registration when capacity is full and waitlist is disabled', () => {
    const status = evaluateRegistrationStatus({
      capacity: 30,
      confirmedCount: 30,
      waitlistEnabled: false,
    });
    expect(status).toBe('RejectedFull');
  });

  it('should auto-promote first waitlisted member when a confirmed seat is cancelled', () => {
    const waitlist = [
      { id: 'reg-w1', memberId: 'm-10', registeredAt: '2026-10-01T09:00:00Z' },
      { id: 'reg-w2', memberId: 'm-11', registeredAt: '2026-10-01T09:30:00Z' },
    ];

    const result = promoteNextWaitlistedMember(waitlist);
    expect(result.promotedRegistrationId).toBe('reg-w1');
    expect(result.remainingWaitlist.length).toBe(1);
    expect(result.remainingWaitlist[0].id).toBe('reg-w2');
  });

  it('should evaluate walk-in policy based on session settings and remaining space', () => {
    expect(
      canAcceptWalkIn({
        walkInsAllowed: true,
        capacity: 30,
        confirmedCount: 28,
        walkInCount: 1,
      })
    ).toBe(true);

    // Over maximum capacity
    expect(
      canAcceptWalkIn({
        walkInsAllowed: true,
        capacity: 30,
        confirmedCount: 29,
        walkInCount: 1,
      })
    ).toBe(false);

    // Walk-ins disabled for this programme
    expect(
      canAcceptWalkIn({
        walkInsAllowed: false,
        capacity: 30,
        confirmedCount: 15,
        walkInCount: 0,
      })
    ).toBe(false);
  });
});
