/**
 * Pure Functional Vitals Parser for Senior-Input Messages
 * Handles BP and Glucose readings with Indian language digit normalisation (Devanagari, Kannada, Tamil).
 */

const INDIC_DIGIT_MAP: Record<string, string> = {
  // Devanagari ०-९
  '०': '0', '१': '1', '२': '2', '३': '3', '४': '4', '५': '5', '६': '6', '७': '7', '८': '8', '९': '9',
  // Kannada ೦-೯
  '೦': '0', '೧': '1', '೨': '2', '೩': '3', '೪': '4', '೫': '5', '೬': '6', '೭': '7', '೮': '8', '೯': '9',
  // Tamil ௦-௯
  '௦': '0', '௧': '1', '௨': '2', '௩': '3', '௪': '4', '௫': '5', '௬': '6', '௭': '7', '௮': '8', '௯': '9',
};

export function normalizeIndicDigits(input: string): string {
  if (!input) return '';
  return input.replace(/[०-९೦-೯௦-௯]/g, (ch) => INDIC_DIGIT_MAP[ch] || ch);
}

export interface ParsedBloodPressure {
  valid: boolean;
  systolic?: number;
  diastolic?: number;
  error?: string;
  swapped?: boolean;
}

export interface ParsedBloodGlucose {
  valid: boolean;
  glucoseMgDl?: number;
  error?: string;
}

/**
 * Parses blood pressure readings from various informal text inputs:
 * '130/85', '130 85', '130 over 85', 'BP 130/85', '130-85'
 */
export function parseBloodPressure(rawText: string): ParsedBloodPressure {
  if (!rawText) return { valid: false, error: 'Empty input' };

  // Sanitize and normalize indic digits
  const normalized = normalizeIndicDigits(rawText.trim().toLowerCase());

  // Prevent script/HTML injection
  if (/[<>{}]/.test(normalized)) {
    return { valid: false, error: 'Invalid characters in reading' };
  }

  // Regex matching two groups of numbers separated by slash, hyphen, space, or 'over'
  const match = normalized.match(/(?:bp\s*)?(\d{2,3})\s*(?:\/|-|\s+|over)\s*(\d{2,3})/i);
  if (!match) {
    return { valid: false, error: 'Could not detect blood pressure format. Please enter e.g. 130/85' };
  }

  let num1 = parseInt(match[1], 10);
  let num2 = parseInt(match[2], 10);
  let swapped = false;

  // Swapped detection (e.g. 85/130)
  if (num1 < num2) {
    const temp = num1;
    num1 = num2;
    num2 = temp;
    swapped = true;
  }

  // Plausibility bounds
  if (num1 < 50 || num1 > 300) {
    return { valid: false, error: `Systolic pressure (${num1}) out of plausible physiological bounds (50–300)` };
  }

  if (num2 < 30 || num2 > 200) {
    return { valid: false, error: `Diastolic pressure (${num2}) out of plausible physiological bounds (30–200)` };
  }

  return {
    valid: true,
    systolic: num1,
    diastolic: num2,
    swapped,
  };
}

/**
 * Parses blood glucose readings:
 * '112', '112 mg/dl', '112 mg/dL', 'sugar 112'
 */
export function parseBloodGlucose(rawText: string): ParsedBloodGlucose {
  if (!rawText) return { valid: false, error: 'Empty input' };

  const normalized = normalizeIndicDigits(rawText.trim().toLowerCase());

  if (/[<>{}]/.test(normalized)) {
    return { valid: false, error: 'Invalid characters in reading' };
  }

  const match = normalized.match(/(?:sugar\s*|glucose\s*|bs\s*)?(\d{2,3})(?:\s*mg\s*\/?\s*dl)?/i);
  if (!match) {
    return { valid: false, error: 'Could not detect glucose value. Please enter e.g. 112 or 112 mg/dl' };
  }

  const val = parseInt(match[1], 10);

  if (val < 20 || val > 600) {
    return { valid: false, error: `Blood glucose value (${val}) out of plausible bounds (20–600 mg/dL)` };
  }

  return {
    valid: true,
    glucoseMgDl: val,
  };
}

export function parseVitalsInput(input: string): {
  readingType: 'BLOOD_PRESSURE' | 'BLOOD_GLUCOSE';
  systolic?: number;
  diastolic?: number;
  glucoseValue?: number;
} | null {
  const bp = parseBloodPressure(input);
  if (bp.valid) {
    return {
      readingType: 'BLOOD_PRESSURE',
      systolic: bp.systolic,
      diastolic: bp.diastolic,
    };
  }
  const glucose = parseBloodGlucose(input);
  if (glucose.valid) {
    return {
      readingType: 'BLOOD_GLUCOSE',
      glucoseValue: glucose.glucoseMgDl,
    };
  }
  return null;
}
