import { describe, it, expect } from 'vitest';
import {
  evaluateBloodPressure,
  evaluateBloodGlucose,
  DEFAULT_CLINICIAN_PLACEHOLDER_THRESHOLDS,
} from '@/domain/thresholds';

describe('Domain: Threshold Evaluator (Module 2)', () => {
  it('evaluates Blood Pressure into Normal, Watch, HighRisk, and Critical bands', () => {
    // Normal: 120/80
    const normal = evaluateBloodPressure(120, 80);
    expect(normal.band).toBe('Normal');
    expect(normal.action).toBe('LogOnly');

    // Watch: 135/82 (systolic in watch)
    const watch = evaluateBloodPressure(135, 82);
    expect(watch.band).toBe('Watch');
    expect(watch.action).toBe('LogOnly');

    // HighRisk: 155/95 (prompts wellness call)
    const highRisk = evaluateBloodPressure(155, 95);
    expect(highRisk.band).toBe('HighRisk');
    expect(highRisk.action).toBe('FlagForCall');

    // Critical: 185/110 (triggers SOS equivalent)
    const critical = evaluateBloodPressure(185, 110);
    expect(critical.band).toBe('Critical');
    expect(critical.action).toBe('EscalateToSos');

    // Critical by diastolic: 130/125
    const criticalDiastolic = evaluateBloodPressure(130, 125);
    expect(criticalDiastolic.band).toBe('Critical');
  });

  it('evaluates Blood Glucose into Normal, Watch, HighRisk, and Critical bands', () => {
    // Normal: 100
    const normal = evaluateBloodGlucose(100);
    expect(normal.band).toBe('Normal');
    expect(normal.action).toBe('LogOnly');

    // Watch: 150
    const watch = evaluateBloodGlucose(150);
    expect(watch.band).toBe('Watch');

    // HighRisk: 220
    const highRisk = evaluateBloodGlucose(220);
    expect(highRisk.band).toBe('HighRisk');
    expect(highRisk.action).toBe('FlagForCall');

    // Critical: 380
    const critical = evaluateBloodGlucose(380);
    expect(critical.band).toBe('Critical');
    expect(critical.action).toBe('EscalateToSos');

    // Hypoglycemia critical: 45
    const hypoCritical = evaluateBloodGlucose(45);
    expect(hypoCritical.band).toBe('Critical');

    // Hypoglycemia high risk: 60
    const hypoHigh = evaluateBloodGlucose(60);
    expect(hypoHigh.band).toBe('HighRisk');
  });

  it('contains clinician placeholder indicator flag and version', () => {
    expect(DEFAULT_CLINICIAN_PLACEHOLDER_THRESHOLDS.isClinicianPlaceholder).toBe(true);
    expect(DEFAULT_CLINICIAN_PLACEHOLDER_THRESHOLDS.version).toBe('1.0.0-placeholder');
  });
});
