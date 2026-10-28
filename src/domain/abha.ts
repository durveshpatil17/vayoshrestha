/**
 * ABHA (Ayushman Bharat Health Account) Format Validator & Masker (FR-Module 3)
 * Structure-only in the pilot (Hard Constraint 8).
 * Never marks as "verified"; strictly validates 14-digit hyphenated format: XX-XXXX-XXXX-XXXX
 */

const ABHA_NUMBER_REGEX = /^\d{2}-\d{4}-\d{4}-\d{4}$/;
const ABHA_RAW_14_DIGITS_REGEX = /^\d{14}$/;
const ABHA_ADDRESS_REGEX = /^[a-zA-Z0-9._-]+@(abdm|sbx)$/;

export function isValidAbhaNumber(value: string): boolean {
  if (!value) return false;
  const clean = value.trim();
  return ABHA_NUMBER_REGEX.test(clean);
}

export function formatRawAbha(rawDigits: string): string {
  if (!rawDigits) return '';
  const digits = rawDigits.replace(/\D/g, '');
  if (digits.length !== 14) return rawDigits;
  return `${digits.slice(0, 2)}-${digits.slice(2, 6)}-${digits.slice(6, 10)}-${digits.slice(10, 14)}`;
}

export const formatAbhaNumber = formatRawAbha;

export function isValidAbhaAddress(value: string): boolean {
  if (!value) return false;
  const clean = value.trim().toLowerCase();
  return ABHA_ADDRESS_REGEX.test(clean);
}

export function maskAbhaNumber(value: string): string {
  if (!value) return '';
  const clean = value.trim();
  if (clean.startsWith('••-')) return clean;

  const digits = clean.replace(/\D/g, '');
  if (digits.length < 4) return '••-••••-••••-••••';

  const last4 = digits.slice(-4);
  return `••-••••-••••-${last4}`;
}
