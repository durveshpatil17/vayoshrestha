import { EmergencyContact, SmsFallbackRecord } from '@/api/contracts';

export interface FallbackDecisionInput {
  sosId: string;
  seniorId: string;
  seniorName: string;
  networkStatus: 'Online' | 'Disconnected';
  contacts: EmergencyContact[];
  behavior: 'first_delivered' | 'all_contacts';
  language?: string;
  existingDispatches?: SmsFallbackRecord[];
}

export interface FallbackDecisionResult {
  shouldDispatchSms: boolean;
  reason: string;
  targetContacts: EmergencyContact[];
  statusText: 'NotNeeded' | 'Queued' | 'BlockedNoConsent' | 'BlockedNoNumber';
}

/**
 * Fallback Decision Function for Emergency SOS.
 * Evaluates whether SMS fallback to Next-of-Kin is required when data connection drops mid-transaction.
 */
export function evaluateFallbackDecision(input: FallbackDecisionInput): FallbackDecisionResult {
  // If online and WhatsApp delivery succeeded, fallback is not needed
  if (input.networkStatus === 'Online') {
    return {
      shouldDispatchSms: false,
      reason: 'Senior data network is online; WhatsApp payload delivered successfully.',
      targetContacts: [],
      statusText: 'NotNeeded',
    };
  }

  // Idempotency check: if dispatches already exist for this SOS, do not duplicate
  if (input.existingDispatches && input.existingDispatches.length > 0) {
    return {
      shouldDispatchSms: false,
      reason: 'Fallback SMS dispatches already initiated for this SOS event.',
      targetContacts: [],
      statusText: 'Queued',
    };
  }

  if (!input.contacts || input.contacts.length === 0) {
    return {
      shouldDispatchSms: false,
      reason: 'No emergency contacts registered for this senior citizen.',
      targetContacts: [],
      statusText: 'BlockedNoNumber',
    };
  }

  // Sort contacts by priority order
  const sorted = [...input.contacts].sort((a, b) => (a.priorityOrder ?? a.priority ?? 1) - (b.priorityOrder ?? b.priority ?? 1));

  // Filter contacts with safety SMS consent and valid phone
  const consentedContacts = sorted.filter(
    (c) => c.safetySmsConsent && c.phone && c.phone.trim().length >= 10
  );

  if (consentedContacts.length === 0) {
    return {
      shouldDispatchSms: false,
      reason: 'Emergency contacts exist, but safety SMS consent or valid mobile number is missing.',
      targetContacts: [],
      statusText: 'BlockedNoConsent',
    };
  }

  // Select target contacts based on behavior
  const targets =
    input.behavior === 'all_contacts' ? consentedContacts : [consentedContacts[0]];

  return {
    shouldDispatchSms: true,
    reason: 'Data network disconnected mid-transaction. Dispatching cellular SMS fallback to next-of-kin.',
    targetContacts: targets,
    statusText: 'Queued',
  };
}

/**
 * Constructs standard transactional SMS message for Next-of-Kin.
 */
export function generateNokSmsText(
  seniorName: string,
  chapterName: string = 'Vayoh Vikas Centre'
): string {
  return `EMERGENCY ALERT: ${seniorName} has triggered an SOS at ${chapterName}. Vayoh Vikas care team is responding. If you are nearby, please check on them. For info: 1800-VAYOH.`;
}
