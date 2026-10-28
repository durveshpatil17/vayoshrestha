/**
 * Pure Functional Onboarding State Machine & Validation
 */

const INDIAN_MOBILE_REGEX = /^(?:\+91|91)?[6-9]\d{9}$/;

export function isValidIndianMobile(phone: string): boolean {
  if (!phone) return false;
  const clean = phone.replace(/[\s-]/g, '');
  return INDIAN_MOBILE_REGEX.test(clean);
}

export function formatIndianMobile(phone: string): string {
  if (!phone) return '';
  const digits = phone.replace(/\D/g, '');
  if (digits.length === 10) {
    return `+91 ${digits.slice(0, 5)} ${digits.slice(5)}`;
  }
  if (digits.length === 12 && digits.startsWith('91')) {
    return `+91 ${digits.slice(2, 7)} ${digits.slice(7)}`;
  }
  return phone;
}

export interface OnboardingState {
  step: number; // 1 to 7
  fullName?: string;
  language?: string;
  emergencyContactName?: string;
  emergencyContactPhone?: string;
  emergencyContactRelationship?: string;
  safetySmsConsent?: boolean;
  abhaNumber?: string;
  abdmConsent?: boolean;
  medicationLabel?: string;
  medicationTime?: string;
  completed: boolean;
}

export const ONBOARDING_STEP_NAMES = [
  'Welcome & Consent',
  'Full Name',
  'Language Preference',
  'Emergency Contact',
  'ABHA Details (Phase 2)',
  'Medication Schedule',
  'Confirmation',
];

export function getNextOnboardingStep(currentStep: number): number {
  if (currentStep >= 7) return 7;
  return currentStep + 1;
}

export function validateOnboardingStep(
  step: number,
  data: Partial<OnboardingState>
): { valid: boolean; error?: string } {
  switch (step) {
    case 1: // Welcome & Consent
      return { valid: true };

    case 2: // Full Name
      if (!data.fullName || data.fullName.trim().length < 2) {
        return { valid: false, error: 'Please enter a valid full name (at least 2 characters).' };
      }
      return { valid: true };

    case 3: // Language
      if (!data.language) {
        return { valid: false, error: 'Please select a preferred language.' };
      }
      return { valid: true };

    case 4: // Emergency Contact
      if (!data.emergencyContactName || data.emergencyContactName.trim().length < 2) {
        return { valid: false, error: 'Emergency contact name is required.' };
      }
      if (!data.emergencyContactPhone || !isValidIndianMobile(data.emergencyContactPhone)) {
        return { valid: false, error: 'Valid 10-digit Indian mobile number starting with 6–9 is required.' };
      }
      return { valid: true };

    case 5: // ABHA (Optional)
      return { valid: true };

    case 6: // Medication (Optional)
      return { valid: true };

    case 7: // Final
      return { valid: true };

    default:
      return { valid: false, error: 'Invalid step' };
  }
}
