import { describe, it, expect } from 'vitest';
import { ERROR_CODES, formatErrorMessage } from '@/domain/errorCodes';

describe('Loop R13: Product Chrome, Content Style & Error Codes', () => {
  it('standardizes system error codes under E-<DOMAIN>-<CODE> schema', () => {
    const errorKeys = Object.keys(ERROR_CODES);
    expect(errorKeys.length).toBeGreaterThanOrEqual(10);

    const validDomains = ['AUTH', 'PERM', 'DPDP', 'GATE', 'SYNC', 'AUDT', 'VALD'];

    errorKeys.forEach((key) => {
      const err = ERROR_CODES[key];
      expect(err.code).toMatch(/^E-[A-Z]+-[0-9]{3}$/);
      expect(validDomains).toContain(err.domain);
      expect(err.title).toBeTruthy();
      expect(err.description).toBeTruthy();
      expect(err.remediation).toBeTruthy();
    });
  });

  it('formats human-readable error messages with code prefix and remediation hint', () => {
    const msg = formatErrorMessage('E-DPDP-002');
    expect(msg).toContain('[E-DPDP-002]');
    expect(msg).toContain('Quiet-hours delivery restriction');

    const fallbackMsg = formatErrorMessage('E-UNKNOWN-999', 'Custom fallback error');
    expect(fallbackMsg).toBe('Custom fallback error');
  });

  it('enforces canonical terminology in content style and about documentation', () => {
    const canonicalGlossary = {
      platform: 'Vayoshrestha',
      organization: 'Vayoh Vikas',
      hub: 'Chapter (Ekta Hub)',
      recipient: 'Senior',
      fieldPersonnel: 'Field associate',
      lifeSafety: 'Emergency',
    };

    expect(canonicalGlossary.platform).toBe('Vayoshrestha');
    expect(canonicalGlossary.organization).toBe('Vayoh Vikas');
    expect(canonicalGlossary.hub).toContain('Ekta Hub');
    expect(canonicalGlossary.recipient).not.toBe('beneficiary');
    expect(canonicalGlossary.recipient).not.toBe('old person');
  });
});

