import { describe, it, expect } from 'vitest';
import { evaluateFallbackDecision, generateNokSmsText } from '@/domain/fallback';
import { EmergencyContact } from '@/api/contracts';

describe('Domain: Cellular Fallback Decision Engine (Module 1)', () => {
  const sampleContacts: EmergencyContact[] = [
    {
      id: 'c1',
      name: 'Sunil Kulkarni (Son)',
      relationship: 'Son',
      phone: '9822011223',
      isPrimary: true,
      safetySmsConsent: true,
      priorityOrder: 1,
    },
    {
      id: 'c2',
      name: 'Priya Kulkarni (Daughter)',
      relationship: 'Daughter',
      phone: '9822044556',
      isPrimary: false,
      safetySmsConsent: true,
      priorityOrder: 2,
    },
  ];

  it('does NOT trigger SMS fallback when data network is Online', () => {
    const result = evaluateFallbackDecision({
      sosId: 'sos-1',
      seniorId: 'm-1',
      seniorName: 'Ramesh Kulkarni',
      networkStatus: 'Online',
      contacts: sampleContacts,
      behavior: 'first_delivered',
    });

    expect(result.shouldDispatchSms).toBe(false);
    expect(result.statusText).toBe('NotNeeded');
    expect(result.targetContacts.length).toBe(0);
  });

  it('triggers SMS fallback to primary NOK when network drops mid-transaction', () => {
    const result = evaluateFallbackDecision({
      sosId: 'sos-1',
      seniorId: 'm-1',
      seniorName: 'Ramesh Kulkarni',
      networkStatus: 'Disconnected',
      contacts: sampleContacts,
      behavior: 'first_delivered',
    });

    expect(result.shouldDispatchSms).toBe(true);
    expect(result.statusText).toBe('Queued');
    expect(result.targetContacts.length).toBe(1);
    expect(result.targetContacts[0].name).toBe('Sunil Kulkarni (Son)');
  });

  it('targets all consented contacts when behavior is all_contacts', () => {
    const result = evaluateFallbackDecision({
      sosId: 'sos-1',
      seniorId: 'm-1',
      seniorName: 'Ramesh Kulkarni',
      networkStatus: 'Disconnected',
      contacts: sampleContacts,
      behavior: 'all_contacts',
    });

    expect(result.shouldDispatchSms).toBe(true);
    expect(result.targetContacts.length).toBe(2);
  });

  it('handles missing consent gracefully', () => {
    const noConsentContacts: EmergencyContact[] = [
      {
        ...sampleContacts[0],
        safetySmsConsent: false,
      },
    ];

    const result = evaluateFallbackDecision({
      sosId: 'sos-1',
      seniorId: 'm-1',
      seniorName: 'Ramesh Kulkarni',
      networkStatus: 'Disconnected',
      contacts: noConsentContacts,
      behavior: 'first_delivered',
    });

    expect(result.shouldDispatchSms).toBe(false);
    expect(result.statusText).toBe('BlockedNoConsent');
  });

  it('enforces idempotency so duplicate SMS is not sent for existing dispatches', () => {
    const result = evaluateFallbackDecision({
      sosId: 'sos-1',
      seniorId: 'm-1',
      seniorName: 'Ramesh Kulkarni',
      networkStatus: 'Disconnected',
      contacts: sampleContacts,
      behavior: 'first_delivered',
      existingDispatches: [
        {
          id: 'sms-1',
          sosId: 'sos-1',
          seniorId: 'm-1',
          recipientName: 'Sunil',
          recipientPhone: '9822011223',
          relationship: 'Son',
          templateId: 'DLT-1',
          messageText: 'Alert',
          status: 'Delivered',
          sentAt: new Date().toISOString(),
          retryCount: 0,
        },
      ],
    });

    expect(result.shouldDispatchSms).toBe(false);
  });

  it('generates standard transactional SMS text for NOK', () => {
    const text = generateNokSmsText('Ramesh Kulkarni', 'Pune Hub');
    expect(text).toContain('EMERGENCY ALERT');
    expect(text).toContain('Ramesh Kulkarni');
    expect(text).toContain('Pune Hub');
  });
});
