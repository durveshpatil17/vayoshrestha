/**
 * Consent Gating & Opt-Out Handling (FR-09, FR-29)
 */

export type ConsentStatus = 'OptedIn' | 'OptedOut' | 'Pending';

export interface ConsentMemberContext {
  id: string;
  consentStatus: ConsentStatus;
  optedOutChannels?: string[];
}

export function canSendMessage(
  member: ConsentMemberContext,
  _category?: 'BookingConfirmation' | 'Reminder' | 'Announcement' | 'EducationalTip' | string
): { allowed: boolean; reason?: string } {
  if (member.consentStatus === 'OptedOut') {
    return {
      allowed: false,
      reason: 'Member has opted out of communications per their recorded preference.',
    };
  }

  if (member.consentStatus === 'Pending') {
    return {
      allowed: false,
      reason: 'Member consent status is pending. Formal consent form must be collected first.',
    };
  }

  if (member.optedOutChannels && member.optedOutChannels.includes('WhatsApp')) {
    return {
      allowed: false,
      reason: 'Member has explicitly opted out of WhatsApp messages.',
    };
  }

  return { allowed: true };
}

export function evaluateOptOutAction(
  member: ConsentMemberContext,
  inputMessage: string
): ConsentMemberContext {
  const normalized = inputMessage.trim().toUpperCase();

  if (normalized === 'STOP' || normalized === 'UNSUBSCRIBE' || normalized === 'OPT OUT') {
    const channels = member.optedOutChannels ? [...member.optedOutChannels] : [];
    if (!channels.includes('WhatsApp')) {
      channels.push('WhatsApp');
    }

    return {
      ...member,
      consentStatus: 'OptedOut',
      optedOutChannels: channels,
    };
  }

  return member;
}
