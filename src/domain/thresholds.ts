import { ThresholdConfig } from '@/api/contracts';

export type RiskBand = 'Normal' | 'Watch' | 'HighRisk' | 'Critical';

export interface VitalEvaluationResult {
  band: RiskBand;
  action: 'LogOnly' | 'FlagForCall' | 'EscalateToSos';
  summary: string;
  ruleVersion: string;
}

export const DEFAULT_CLINICIAN_PLACEHOLDER_THRESHOLDS: ThresholdConfig = {
  id: 'thresh-default-v1',
  version: '1.0.0-placeholder',
  label: 'Clinician Placeholder Defaults (Approved for Pilot)',
  bpSystolic: {
    watch: 130, // >= 130 is Watch
    highRisk: 140, // >= 140 is HighRisk
    critical: 180, // >= 180 is Critical (triggers SOS equivalent)
  },
  bpDiastolic: {
    watch: 85,
    highRisk: 90,
    critical: 120,
  },
  glucose: {
    watch: 140,
    highRisk: 200,
    critical: 350,
  },
  isClinicianPlaceholder: true,
  updatedBy: 'Dr. R. Kulkarni (Placeholder Clinician)',
  updatedAt: '2026-10-28T10:00:00.000Z',
  approvedBy: 'Vandana Sharma (NM)',
  approvedAt: '2026-10-28T10:30:00.000Z',
  status: 'Approved',
};

/**
 * Evaluates Blood Pressure reading against active threshold configuration.
 */
export function evaluateBloodPressure(
  systolic: number,
  diastolic: number,
  config: ThresholdConfig = DEFAULT_CLINICIAN_PLACEHOLDER_THRESHOLDS
): VitalEvaluationResult {
  const bpSys = config.bpSystolic || DEFAULT_CLINICIAN_PLACEHOLDER_THRESHOLDS.bpSystolic!;
  const bpDia = config.bpDiastolic || DEFAULT_CLINICIAN_PLACEHOLDER_THRESHOLDS.bpDiastolic!;

  // Check critical first
  if (systolic >= bpSys.critical || diastolic >= bpDia.critical) {
    return {
      band: 'Critical',
      action: 'EscalateToSos',
      summary: `${systolic}/${diastolic} mmHg (Critical Alert)`,
      ruleVersion: config.version,
    };
  }

  // Check high risk
  if (systolic >= bpSys.highRisk || diastolic >= bpDia.highRisk) {
    return {
      band: 'HighRisk',
      action: 'FlagForCall',
      summary: `${systolic}/${diastolic} mmHg (High-Risk)`,
      ruleVersion: config.version,
    };
  }

  // Check watch
  if (systolic >= bpSys.watch || diastolic >= bpDia.watch) {
    return {
      band: 'Watch',
      action: 'LogOnly',
      summary: `${systolic}/${diastolic} mmHg (Watch Band)`,
      ruleVersion: config.version,
    };
  }

  return {
    band: 'Normal',
    action: 'LogOnly',
    summary: `${systolic}/${diastolic} mmHg (Normal)`,
    ruleVersion: config.version,
  };
}

/**
 * Evaluates Blood Glucose reading against active threshold configuration.
 */
export function evaluateBloodGlucose(
  glucoseMgDl: number,
  config: ThresholdConfig = DEFAULT_CLINICIAN_PLACEHOLDER_THRESHOLDS
): VitalEvaluationResult {
  const gluc = config.glucose || DEFAULT_CLINICIAN_PLACEHOLDER_THRESHOLDS.glucose!;

  if (glucoseMgDl >= gluc.critical || glucoseMgDl <= 50) {
    return {
      band: 'Critical',
      action: 'EscalateToSos',
      summary: `${glucoseMgDl} mg/dL (Critical Alert)`,
      ruleVersion: config.version,
    };
  }

  if (glucoseMgDl >= gluc.highRisk || glucoseMgDl <= 65) {
    return {
      band: 'HighRisk',
      action: 'FlagForCall',
      summary: `${glucoseMgDl} mg/dL (High-Risk)`,
      ruleVersion: config.version,
    };
  }

  if (glucoseMgDl >= gluc.watch) {
    return {
      band: 'Watch',
      action: 'LogOnly',
      summary: `${glucoseMgDl} mg/dL (Watch Band)`,
      ruleVersion: config.version,
    };
  }

  return {
    band: 'Normal',
    action: 'LogOnly',
    summary: `${glucoseMgDl} mg/dL (Normal)`,
    ruleVersion: config.version,
  };
}

export function evaluateVitalsReading(
  reading: { readingType: string; systolic?: number; diastolic?: number; glucoseValue?: number },
  config: ThresholdConfig = DEFAULT_CLINICIAN_PLACEHOLDER_THRESHOLDS
): {
  band: 'NORMAL' | 'WATCH' | 'HIGH_RISK' | 'CRITICAL';
  action: 'LOG_ONLY' | 'FLAG_FOR_CALL' | 'ESCALATE_TO_SOS';
} {
  if (reading.readingType === 'BLOOD_PRESSURE' && reading.systolic && reading.diastolic) {
    const res = evaluateBloodPressure(reading.systolic, reading.diastolic, config);
    const bandMap: Record<string, 'NORMAL' | 'WATCH' | 'HIGH_RISK' | 'CRITICAL'> = {
      Normal: 'NORMAL',
      Watch: 'WATCH',
      HighRisk: 'HIGH_RISK',
      Critical: 'CRITICAL',
    };
    const actionMap: Record<string, 'LOG_ONLY' | 'FLAG_FOR_CALL' | 'ESCALATE_TO_SOS'> = {
      LogOnly: 'LOG_ONLY',
      FlagForCall: 'FLAG_FOR_CALL',
      EscalateToSos: 'ESCALATE_TO_SOS',
    };
    return {
      band: bandMap[res.band] || 'NORMAL',
      action: actionMap[res.action] || 'LOG_ONLY',
    };
  } else if (reading.glucoseValue) {
    const res = evaluateBloodGlucose(reading.glucoseValue, config);
    const bandMap: Record<string, 'NORMAL' | 'WATCH' | 'HIGH_RISK' | 'CRITICAL'> = {
      Normal: 'NORMAL',
      Watch: 'WATCH',
      HighRisk: 'HIGH_RISK',
      Critical: 'CRITICAL',
    };
    const actionMap: Record<string, 'LOG_ONLY' | 'FLAG_FOR_CALL' | 'ESCALATE_TO_SOS'> = {
      LogOnly: 'LOG_ONLY',
      FlagForCall: 'FLAG_FOR_CALL',
      EscalateToSos: 'ESCALATE_TO_SOS',
    };
    return {
      band: bandMap[res.band] || 'NORMAL',
      action: actionMap[res.action] || 'LOG_ONLY',
    };
  }
  return { band: 'NORMAL', action: 'LOG_ONLY' };
}
