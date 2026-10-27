/**
 * Masking, Privacy Protection, and Sanitization
 * Compliant with DPDP Act, Concept Note, and Section 4
 */

export function maskPhoneNumber(phone: string): string {
  if (!phone) return '';
  const str = String(phone).trim();
  if (str.startsWith('•••')) return str;

  // Extract digits
  const digits = str.replace(/\D/g, '');
  if (digits.length < 4) return '••••••';

  const last4 = digits.slice(-4);
  return `••••••${last4}`;
}

export function isMaskedPhone(phone: string): boolean {
  if (!phone) return false;
  return phone.includes('•••');
}

export function dobToAgeBand(dobString: string, referenceYear: number = 2026): string {
  if (!dobString) return 'Unknown';
  const birthYear = new Date(dobString).getFullYear();
  if (isNaN(birthYear)) return 'Unknown';

  const age = referenceYear - birthYear;
  if (age < 60) return '<60';
  if (age <= 64) return '60–64';
  if (age <= 69) return '65–69';
  if (age <= 74) return '70–74';
  if (age <= 79) return '75–79';
  if (age <= 84) return '80–84';
  return '85+';
}

/**
 * Suppresses small numbers (<5) in CSR/donor aggregate reports
 * to prevent individual re-identification.
 */
export function suppressSmallNumber(count: number): string {
  if (count <= 0) return '0';
  if (count < 5) return '<5';
  return String(count);
}

/**
 * Escapes characters that trigger formula execution in spreadsheets
 * (=, +, -, @) to prevent CSV Injection attacks.
 */
export function escapeCsvFormula(value: string | number | null | undefined): string {
  if (value === null || value === undefined) return '';
  const str = String(value);
  if (/^[=+\-@]/.test(str)) {
    return `'${str}`;
  }
  return str;
}
