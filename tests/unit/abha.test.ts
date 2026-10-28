import { describe, it, expect } from 'vitest';
import { isValidAbhaNumber, isValidAbhaAddress, maskAbhaNumber, formatRawAbha } from '@/domain/abha';

describe('Domain: ABHA Structure-Only Validation (Module 3 & Hard Constraint 8)', () => {
  it('validates 14-digit hyphenated ABHA number format', () => {
    expect(isValidAbhaNumber('12-3456-7890-1234')).toBe(true);
    expect(isValidAbhaNumber('99-8888-7777-6666')).toBe(true);
    expect(isValidAbhaNumber('12345678901234')).toBe(false); // missing hyphens
    expect(isValidAbhaNumber('12-345-7890-1234')).toBe(false); // bad length
    expect(isValidAbhaNumber('ab-cdef-ghij-klmn')).toBe(false); // letters
    expect(isValidAbhaNumber('')).toBe(false);
  });

  it('formats raw 14 digits into canonical hyphenated format', () => {
    expect(formatRawAbha('12345678901234')).toBe('12-3456-7890-1234');
    expect(formatRawAbha('12-3456-7890-1234')).toBe('12-3456-7890-1234');
  });

  it('validates ABHA addresses ending with @abdm or @sbx', () => {
    expect(isValidAbhaAddress('ramesh.k@abdm')).toBe(true);
    expect(isValidAbhaAddress('sunita123@sbx')).toBe(true);
    expect(isValidAbhaAddress('invalid@gmail.com')).toBe(false);
    expect(isValidAbhaAddress('')).toBe(false);
  });

  it('masks ABHA numbers preserving only the final 4 digits', () => {
    expect(maskAbhaNumber('12-3456-7890-1234')).toBe('••-••••-••••-1234');
    expect(maskAbhaNumber('••-••••-••••-1234')).toBe('••-••••-••••-1234');
  });
});
