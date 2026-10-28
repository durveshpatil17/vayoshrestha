import { describe, it, expect } from 'vitest';
import {
  parseBloodPressure,
  parseBloodGlucose,
  normalizeIndicDigits,
} from '@/domain/vitalsParser';

describe('Domain: Vitals Parser & Indic Normalization (Module 2)', () => {
  it('normalizes Devanagari, Kannada, and Tamil numerals to Arabic digits', () => {
    // Devanagari १२३/८५ -> 123/85
    expect(normalizeIndicDigits('१२३/८५')).toBe('123/85');
    // Kannada ೧೨೦/೮೦ -> 120/80
    expect(normalizeIndicDigits('೧೨೦/೮೦')).toBe('120/80');
    // Tamil ௧௩௦/௮௫ -> 130/85
    expect(normalizeIndicDigits('௧௩௦/௮௫')).toBe('130/85');
  });

  it('parses blood pressure in multiple common text formats', () => {
    expect(parseBloodPressure('130/85')).toEqual({ valid: true, systolic: 130, diastolic: 85, swapped: false });
    expect(parseBloodPressure('130 85')).toEqual({ valid: true, systolic: 130, diastolic: 85, swapped: false });
    expect(parseBloodPressure('130 over 85')).toEqual({ valid: true, systolic: 130, diastolic: 85, swapped: false });
    expect(parseBloodPressure('BP 130/85')).toEqual({ valid: true, systolic: 130, diastolic: 85, swapped: false });
    expect(parseBloodPressure('130-85')).toEqual({ valid: true, systolic: 130, diastolic: 85, swapped: false });
  });

  it('detects swapped systolic and diastolic readings', () => {
    const res = parseBloodPressure('80/120');
    expect(res.valid).toBe(true);
    expect(res.systolic).toBe(120);
    expect(res.diastolic).toBe(80);
    expect(res.swapped).toBe(true);
  });

  it('rejects physiologically implausible readings and malicious input', () => {
    expect(parseBloodPressure('400/250').valid).toBe(false);
    expect(parseBloodPressure('20/10').valid).toBe(false);
    expect(parseBloodPressure('<script>alert(1)</script>').valid).toBe(false);
    expect(parseBloodPressure('random text').valid).toBe(false);
  });

  it('parses blood glucose in mg/dL and plain numeric format', () => {
    expect(parseBloodGlucose('112')).toEqual({ valid: true, glucoseMgDl: 112 });
    expect(parseBloodGlucose('112 mg/dl')).toEqual({ valid: true, glucoseMgDl: 112 });
    expect(parseBloodGlucose('sugar 145 mg/dL')).toEqual({ valid: true, glucoseMgDl: 145 });
    expect(parseBloodGlucose('९५ mg/dl')).toEqual({ valid: true, glucoseMgDl: 95 }); // Indic digit
  });

  it('rejects implausible glucose values', () => {
    expect(parseBloodGlucose('15').valid).toBe(false);
    expect(parseBloodGlucose('750').valid).toBe(false);
    expect(parseBloodGlucose('').valid).toBe(false);
  });
});
