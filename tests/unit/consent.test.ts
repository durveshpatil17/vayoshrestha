import { describe, it, expect } from 'vitest';
import { canSendMessage, evaluateOptOutAction } from '@/domain/consent';

describe('Consent & Communication Gating (FR-09, FR-29)', () => {
  it('should permit messages when member is OptedIn and consent is recorded', () => {
    const member = {
      id: 'm-1',
      consentStatus: 'OptedIn' as const,
      optedOutChannels: [],
    };
    const result = canSendMessage(member, 'Reminder');
    expect(result.allowed).toBe(true);
  });

  it('should block messages when member is OptedOut', () => {
    const member = {
      id: 'm-2',
      consentStatus: 'OptedOut' as const,
      optedOutChannels: ['WhatsApp'],
    };
    const result = canSendMessage(member, 'Reminder');
    expect(result.allowed).toBe(false);
    expect(result.reason).toContain('opted out');
  });

  it('should block messages when consent is Pending (not yet recorded)', () => {
    const member = {
      id: 'm-3',
      consentStatus: 'Pending' as const,
      optedOutChannels: [],
    };
    const result = canSendMessage(member, 'Announcement');
    expect(result.allowed).toBe(false);
    expect(result.reason).toContain('pending');
  });

  it('should process WhatsApp STOP command to instantly opt out member', () => {
    const member = {
      id: 'm-4',
      consentStatus: 'OptedIn' as const,
      optedOutChannels: [],
    };

    const updated = evaluateOptOutAction(member, 'STOP');
    expect(updated.consentStatus).toBe('OptedOut');
    expect(updated.optedOutChannels).toContain('WhatsApp');
  });
});
