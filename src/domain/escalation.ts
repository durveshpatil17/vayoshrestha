/**
 * Health Escalation & Warning-Sign Triage (FR-39, FR-40, FR-42)
 *
 * MANDATORY INSTITUTIONAL NOTICE:
 * "Vayoshreshtha does not diagnose or give clinical advice. Health-related requests are routed to qualified professionals."
 */

export const NON_CLINICAL_DISCLAIMER =
  'Vayoshreshtha does not diagnose or give clinical advice. Health-related requests are routed to qualified professionals.';

export type EscalationSeverity = 'Immediate' | 'High' | 'Standard';

export interface WarningTriggerResult {
  triggered: boolean;
  severity: EscalationSeverity | null;
  matchedKeywords: string[];
  slaHours: number;
}

const IMMEDIATE_KEYWORDS = [
  'chest pain',
  'breathlessness',
  'unconscious',
  'severe bleeding',
  'stroke',
  'collapse',
];

const HIGH_KEYWORDS = [
  'dizziness',
  'fell down',
  'fall',
  'fracture',
  'severe pain',
  'confused',
  'high fever',
  'palpitations',
];

const STANDARD_KEYWORDS = [
  'lonely',
  'depression',
  'anxious',
  'sad',
  'difficulty walking',
  'medication help',
  'routine checkup',
];

export function evaluateWarningSigns(text: string): WarningTriggerResult {
  if (!text) {
    return { triggered: false, severity: null, matchedKeywords: [], slaHours: 24 };
  }

  const lower = text.toLowerCase();
  const immediateMatches = IMMEDIATE_KEYWORDS.filter((kw) => lower.includes(kw));
  if (immediateMatches.length > 0) {
    return {
      triggered: true,
      severity: 'Immediate',
      matchedKeywords: immediateMatches,
      slaHours: 2,
    };
  }

  const highMatches = HIGH_KEYWORDS.filter((kw) => lower.includes(kw));
  if (highMatches.length > 0) {
    return {
      triggered: true,
      severity: 'High',
      matchedKeywords: highMatches,
      slaHours: 6,
    };
  }

  const standardMatches = STANDARD_KEYWORDS.filter((kw) => lower.includes(kw));
  if (standardMatches.length > 0) {
    return {
      triggered: true,
      severity: 'Standard',
      matchedKeywords: standardMatches,
      slaHours: 24,
    };
  }

  return {
    triggered: false,
    severity: null,
    matchedKeywords: [],
    slaHours: 24,
  };
}

export interface SlaStatus {
  isBreached: boolean;
  remainingMinutes: number;
  overdueMinutes: number;
}

export function calculateSlaStatus(
  createdAt: string,
  slaHours: number,
  currentTime: string = new Date().toISOString()
): SlaStatus {
  const createdMs = new Date(createdAt).getTime();
  const currentMs = new Date(currentTime).getTime();
  const slaDeadlineMs = createdMs + slaHours * 60 * 60 * 1000;

  const diffMs = slaDeadlineMs - currentMs;
  const diffMinutes = Math.round(diffMs / (60 * 1000));

  if (diffMinutes >= 0) {
    return {
      isBreached: false,
      remainingMinutes: diffMinutes,
      overdueMinutes: 0,
    };
  } else {
    return {
      isBreached: true,
      remainingMinutes: diffMinutes,
      overdueMinutes: Math.abs(diffMinutes),
    };
  }
}

export function formatSlaCountdown(remainingMinutes: number): string {
  if (remainingMinutes >= 0) {
    const hours = Math.floor(remainingMinutes / 60);
    const mins = remainingMinutes % 60;
    if (hours > 0) {
      return `${hours}h ${mins}m left`;
    }
    return `${mins}m left`;
  } else {
    const overdue = Math.abs(remainingMinutes);
    const hours = Math.floor(overdue / 60);
    const mins = overdue % 60;
    if (hours > 0) {
      return `${hours}h ${mins}m overdue`;
    }
    return `${mins}m overdue`;
  }
}
