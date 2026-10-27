/**
 * Referral State Machine (FR-32, FR-33)
 */

export type ReferralStatus =
  | 'Created'
  | 'Sent'
  | 'Accepted'
  | 'InProgress'
  | 'Closed'
  | 'Declined'
  | 'Cancelled';

const ALLOWED_TRANSITIONS: Record<ReferralStatus, ReferralStatus[]> = {
  Created: ['Sent', 'Cancelled'],
  Sent: ['Accepted', 'Declined', 'Cancelled'],
  Accepted: ['InProgress', 'Cancelled'],
  InProgress: ['Closed'],
  Closed: [],
  Declined: [],
  Cancelled: [],
};

export function canTransitionReferral(from: ReferralStatus, to: ReferralStatus): boolean {
  const allowedNext = ALLOWED_TRANSITIONS[from];
  if (!allowedNext) return false;
  return allowedNext.includes(to);
}

export function getNextAllowedReferralStatuses(current: ReferralStatus): ReferralStatus[] {
  return ALLOWED_TRANSITIONS[current] || [];
}
