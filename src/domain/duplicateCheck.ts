/**
 * Duplicate Member Detection (FR-05, FR-08)
 * Checks candidate against existing records on Name + DOB + Phone.
 */

export interface CandidateMember {
  fullName: string;
  dateOfBirth?: string;
  phone?: string;
}

export interface ExistingMemberRecord {
  id: string;
  fullName: string;
  dateOfBirth?: string;
  phone?: string;
  centreId?: string;
}

export interface DuplicateCheckResult {
  isDuplicate: boolean;
  isPotentialDuplicate: boolean;
  confidence: 'high' | 'medium' | 'none';
  matchedMemberId: string | null;
  matchReasons: string[];
}

export function normalizePhoneNumber(phone?: string): string {
  if (!phone) return '';
  const digits = phone.replace(/\D/g, '');
  // If starts with 91 and has 12 digits, strip country code
  if (digits.length === 12 && digits.startsWith('91')) {
    return digits.slice(2);
  }
  // If starts with 0 and has 11 digits, strip leading 0
  if (digits.length === 11 && digits.startsWith('0')) {
    return digits.slice(1);
  }
  return digits;
}

export function normalizeName(name?: string): string {
  if (!name) return '';
  return name.trim().toLowerCase().replace(/\s+/g, ' ');
}

export function checkDuplicateMember(
  candidate: CandidateMember,
  existingList: ExistingMemberRecord[]
): DuplicateCheckResult {
  const candName = normalizeName(candidate.fullName);
  const candPhone = normalizePhoneNumber(candidate.phone);
  const candDob = candidate.dateOfBirth?.trim();

  for (const item of existingList) {
    const itemName = normalizeName(item.fullName);
    const itemPhone = normalizePhoneNumber(item.phone);
    const itemDob = item.dateOfBirth?.trim();

    const nameMatch = candName.length > 0 && candName === itemName;
    const phoneMatch = candPhone.length > 0 && candPhone === itemPhone;
    const dobMatch = candDob && itemDob && candDob === itemDob;

    // Exact Match (Name + DOB + Phone)
    if (nameMatch && phoneMatch && dobMatch) {
      return {
        isDuplicate: true,
        isPotentialDuplicate: true,
        confidence: 'high',
        matchedMemberId: item.id,
        matchReasons: ['Exact match on Full Name, Date of Birth, and Phone Number'],
      };
    }

    // High Match (Name + Phone)
    if (nameMatch && phoneMatch) {
      return {
        isDuplicate: false,
        isPotentialDuplicate: true,
        confidence: 'medium',
        matchedMemberId: item.id,
        matchReasons: ['Match on Full Name and Phone Number'],
      };
    }

    // Moderate Match (Name + DOB)
    if (nameMatch && dobMatch) {
      return {
        isDuplicate: false,
        isPotentialDuplicate: true,
        confidence: 'medium',
        matchedMemberId: item.id,
        matchReasons: ['Match on Full Name and Date of Birth'],
      };
    }
  }

  return {
    isDuplicate: false,
    isPotentialDuplicate: false,
    confidence: 'none',
    matchedMemberId: null,
    matchReasons: [],
  };
}
