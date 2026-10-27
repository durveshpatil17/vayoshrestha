/**
 * Session Capacity & Waitlist Management (FR-17, FR-18)
 */

export type RegistrationStatus = 'Confirmed' | 'Waitlisted' | 'RejectedFull' | 'Cancelled';

export interface CapacityCheckParams {
  capacity: number;
  confirmedCount: number;
  waitlistEnabled: boolean;
}

export function evaluateRegistrationStatus(params: CapacityCheckParams): RegistrationStatus {
  const { capacity, confirmedCount, waitlistEnabled } = params;

  if (confirmedCount < capacity) {
    return 'Confirmed';
  }

  if (waitlistEnabled) {
    return 'Waitlisted';
  }

  return 'RejectedFull';
}

export interface WaitlistEntry {
  id: string;
  memberId: string;
  registeredAt: string;
}

export interface PromotionResult {
  promotedRegistrationId: string | null;
  remainingWaitlist: WaitlistEntry[];
}

export function promoteNextWaitlistedMember(waitlist: WaitlistEntry[]): PromotionResult {
  if (!waitlist || waitlist.length === 0) {
    return { promotedRegistrationId: null, remainingWaitlist: [] };
  }

  // FIFO: sort by registeredAt
  const sorted = [...waitlist].sort(
    (a, b) => new Date(a.registeredAt).getTime() - new Date(b.registeredAt).getTime()
  );

  const [promoted, ...remaining] = sorted;

  return {
    promotedRegistrationId: promoted.id,
    remainingWaitlist: remaining,
  };
}

export interface WalkInCheckParams {
  walkInsAllowed: boolean;
  capacity: number;
  confirmedCount: number;
  walkInCount: number;
}

export function canAcceptWalkIn(params: WalkInCheckParams): boolean {
  const { walkInsAllowed, capacity, confirmedCount, walkInCount } = params;
  if (!walkInsAllowed) return false;

  const totalAttendees = confirmedCount + walkInCount;
  return totalAttendees < capacity;
}
