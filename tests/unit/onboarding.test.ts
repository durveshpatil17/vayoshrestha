import { describe, it, expect } from 'vitest';
import {
  isValidIndianMobile,
  formatIndianMobile,
  getNextOnboardingStep,
  validateOnboardingStep,
} from '@/domain/onboarding';

describe('Domain: Onboarding State Machine & Mobile Validation (Module 3)', () => {
  it('validates 10-digit Indian mobile numbers starting with 6–9', () => {
    expect(isValidIndianMobile('9822012345')).toBe(true);
    expect(isValidIndianMobile('+919822012345')).toBe(true);
    expect(isValidIndianMobile('+91 98220 12345')).toBe(true);
    expect(isValidIndianMobile('8123456789')).toBe(true);
    expect(isValidIndianMobile('7123456789')).toBe(true);
    expect(isValidIndianMobile('6123456789')).toBe(true);

    expect(isValidIndianMobile('5123456789')).toBe(false); // starts with 5
    expect(isValidIndianMobile('12345')).toBe(false); // too short
    expect(isValidIndianMobile('98220123456789')).toBe(false); // too long
    expect(isValidIndianMobile('')).toBe(false);
  });

  it('formats Indian mobile numbers nicely', () => {
    expect(formatIndianMobile('9822012345')).toBe('+91 98220 12345');
    expect(formatIndianMobile('919822012345')).toBe('+91 98220 12345');
    expect(formatIndianMobile('123')).toBe('123');
    expect(formatIndianMobile('')).toBe('');
  });

  it('validates all onboarding steps (1 through 7)', () => {
    // Step 1
    expect(validateOnboardingStep(1, {}).valid).toBe(true);

    // Step 2
    expect(validateOnboardingStep(2, { fullName: 'A' }).valid).toBe(false);
    expect(validateOnboardingStep(2, { fullName: 'Ramesh Kulkarni' }).valid).toBe(true);

    // Step 3
    expect(validateOnboardingStep(3, {}).valid).toBe(false);
    expect(validateOnboardingStep(3, { language: 'Marathi' }).valid).toBe(true);

    // Step 4
    expect(validateOnboardingStep(4, { emergencyContactName: 'Sunil', emergencyContactPhone: '123' }).valid).toBe(false);
    expect(validateOnboardingStep(4, { emergencyContactName: 'Sunil', emergencyContactPhone: '9822011223' }).valid).toBe(true);
    expect(validateOnboardingStep(4, { emergencyContactName: '', emergencyContactPhone: '9822011223' }).valid).toBe(false);

    // Step 5 (Optional ABHA)
    expect(validateOnboardingStep(5, {}).valid).toBe(true);

    // Step 6 (Optional Medication)
    expect(validateOnboardingStep(6, {}).valid).toBe(true);

    // Step 7 (Confirmation)
    expect(validateOnboardingStep(7, {}).valid).toBe(true);

    // Default invalid step
    expect(validateOnboardingStep(99, {}).valid).toBe(false);

    expect(getNextOnboardingStep(2)).toBe(3);
    expect(getNextOnboardingStep(7)).toBe(7);
  });
});
