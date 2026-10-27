/**
 * Membership ID Generator (FR-05, FR-08)
 * Standard Format: VV-<CENTRE>-<YY>-<5-DIGIT SEQUENCE>
 * Example: VV-PUN-26-00001
 */

const MEMBERSHIP_ID_REGEX = /^VV-([A-Z]{3})-(\d{2})-(\d{5})$/;

export function generateMembershipId(
  centreCode: string,
  year: number = 26,
  sequenceNumber: number
): string {
  const cleanCentre = centreCode.trim().toUpperCase();
  const yearStr = String(year).padStart(2, '0');
  const seqStr = String(sequenceNumber).padStart(5, '0');
  return `VV-${cleanCentre}-${yearStr}-${seqStr}`;
}

export function isValidMembershipId(id: string): boolean {
  if (!id) return false;
  return MEMBERSHIP_ID_REGEX.test(id.trim());
}

export interface ParsedMembershipId {
  valid: boolean;
  centreCode?: string;
  year?: number;
  sequence?: number;
}

export function parseMembershipId(id: string): ParsedMembershipId {
  if (!id) return { valid: false };
  const match = id.trim().match(MEMBERSHIP_ID_REGEX);
  if (!match) return { valid: false };

  return {
    valid: true,
    centreCode: match[1],
    year: parseInt(match[2], 10),
    sequence: parseInt(match[3], 10),
  };
}
