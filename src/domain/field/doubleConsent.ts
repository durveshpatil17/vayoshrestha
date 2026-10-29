/**
 * Double-Consent State Machine for Field Onboarding (DPDP Compliance)
 * - Consent 1: In-person read-aloud or simulated voice capture
 * - Consent 2: Interactive confirmation requested to the peer's WhatsApp number (24h expiry)
 * - Both required for 'Registered' status; 1 consent places record in 'Stalled' queue.
 */

export type ConsentStatus =
  | 'consent_1_captured'
  | 'consent_2_requested'
  | 'confirmed'
  | 'expired'
  | 'declined';

export type Consent1Method = 'in_person_read_aloud' | 'voice_placeholder';

export interface DoubleConsentState {
  id: string;
  peerName: string;
  peerPhone: string;
  associateId: string;
  state: ConsentStatus;
  consent1Method: Consent1Method;
  consent1Timestamp: string;
  consent1VoiceHash?: string;
  consent2RequestedAt?: string;
  consent2ExpiresAt?: string;
  confirmedAt?: string;
  declinedAt?: string;
  declinedReason?: string;
  isFullyConsented: boolean;
}

export function initDoubleConsent(params: {
  peerName: string;
  peerPhone: string;
  associateId: string;
  method?: Consent1Method;
  voiceHash?: string;
}): DoubleConsentState {
  const now = new Date().toISOString();
  return {
    id: `dc-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
    peerName: params.peerName.trim(),
    peerPhone: params.peerPhone.replace(/\D/g, ''),
    associateId: params.associateId,
    state: 'consent_1_captured',
    consent1Method: params.method || 'in_person_read_aloud',
    consent1Timestamp: now,
    consent1VoiceHash: params.voiceHash,
    isFullyConsented: false,
  };
}

export function advanceToConsentTwo(consent: DoubleConsentState): DoubleConsentState {
  const now = new Date();
  const expiresAt = new Date(now.getTime() + 24 * 60 * 60 * 1000).toISOString(); // 24-hour expiry SLA

  return {
    ...consent,
    state: 'consent_2_requested',
    consent2RequestedAt: now.toISOString(),
    consent2ExpiresAt: expiresAt,
    isFullyConsented: false,
  };
}

export function confirmConsentTwo(
  consent: DoubleConsentState,
  replyText: string = 'YES'
): DoubleConsentState {
  if (consent.state === 'declined') {
    throw new Error('Cannot confirm a previously declined consent');
  }

  return {
    ...consent,
    state: 'confirmed',
    confirmedAt: new Date().toISOString(),
    isFullyConsented: true,
  };
}

export function expireConsentTwo(consent: DoubleConsentState): DoubleConsentState {
  return {
    ...consent,
    state: 'expired',
    isFullyConsented: false,
  };
}

export function declineConsentTwo(
  consent: DoubleConsentState,
  reason: string
): DoubleConsentState {
  return {
    ...consent,
    state: 'declined',
    declinedAt: new Date().toISOString(),
    declinedReason: reason,
    isFullyConsented: false,
  };
}
