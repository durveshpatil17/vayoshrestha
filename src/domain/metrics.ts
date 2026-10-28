/**
 * Reporting and Measurement Metrics (Pilot Section 1 Definitions)
 *
 * CANONICAL DEFINITIONS:
 * - Registered: completed onboarding (name + language + at least one emergency contact + consent recorded).
 * - Active: responded to any message (tap or text) within the last 14 days (window configurable).
 * - Medication confirmation rate: Taken ÷ reminders delivered.
 * - Vitals logging rate: readings logged ÷ readings expected.
 * - SOS latency: trigger → alert visible on dashboard.
 */

import { SeniorCitizen } from '@/api/contracts';

export function isSeniorRegistered(senior: Partial<SeniorCitizen>): boolean {
  if (!senior.fullName || senior.fullName.trim().length < 2) return false;
  if (!senior.primaryLanguage) return false;
  if (!senior.emergencyContacts || senior.emergencyContacts.length === 0) return false;
  if (!senior.consent?.generalCommunications && !senior.consent?.safetySmsFallback) return false;
  return true;
}

export interface ActivityMessage {
  seniorId: string;
  timestamp: string; // ISO string
  type?: 'inbound_tap' | 'inbound_text' | 'outbound_delivered';
}

export function isSeniorActive(
  seniorId: string,
  activityMessages: ActivityMessage[],
  referenceDate: string = new Date().toISOString(),
  activeWindowDays: number = 14
): boolean {
  const refMs = new Date(referenceDate).getTime();
  const windowMs = activeWindowDays * 24 * 60 * 60 * 1000;
  const thresholdMs = refMs - windowMs;

  return activityMessages.some((msg) => {
    if (msg.seniorId !== seniorId) return false;
    const msgMs = new Date(msg.timestamp).getTime();
    return msgMs >= thresholdMs && msgMs <= refMs;
  });
}

export function calculateMedian(numbers: number[]): number {
  if (numbers.length === 0) return 0;
  const sorted = [...numbers].sort((a, b) => a - b);
  const mid = Math.floor(sorted.length / 2);
  return sorted.length % 2 !== 0 ? sorted[mid] : Math.round((sorted[mid - 1] + sorted[mid]) / 2);
}

export function calculatePercentage(part: number, total: number): number {
  if (total <= 0) return 0;
  return Math.min(100, Math.round((part / total) * 1000) / 10);
}

// --- Backwards-compatible session metrics helpers ---
export interface AttendanceItem {
  id: string;
  memberId: string;
  sessionDate: string;
  status: 'Present' | 'Absent';
}

export function isMemberActive(
  memberId: string,
  attendanceRecords: AttendanceItem[],
  referenceDate: string = new Date().toISOString(),
  activeWindowDays: number = 30
): boolean {
  const refMs = new Date(referenceDate).getTime();
  const windowMs = activeWindowDays * 24 * 60 * 60 * 1000;
  const thresholdMs = refMs - windowMs;

  return attendanceRecords.some((rec) => {
    if (rec.memberId !== memberId) return false;
    if (rec.status !== 'Present') return false;
    const sessionMs = new Date(rec.sessionDate).getTime();
    return sessionMs >= thresholdMs && sessionMs <= refMs;
  });
}

export function calculateActiveMembers(
  members: { id: string }[],
  attendanceRecords: AttendanceItem[],
  referenceDate: string = new Date().toISOString(),
  activeWindowDays: number = 30
): string[] {
  const activeIds: string[] = [];
  for (const m of members) {
    if (isMemberActive(m.id, attendanceRecords, referenceDate, activeWindowDays)) {
      activeIds.push(m.id);
    }
  }
  return activeIds;
}

export function calculateTotalAttendance(attendanceRecords: AttendanceItem[]): number {
  return attendanceRecords.filter((rec) => rec.status === 'Present').length;
}

export interface UniqueParticipantsResult {
  count: number;
  memberIds: string[];
}

export function calculateUniqueParticipants(
  attendanceRecords: AttendanceItem[]
): UniqueParticipantsResult {
  const presentMembers = new Set<string>();
  for (const rec of attendanceRecords) {
    if (rec.status === 'Present' && rec.memberId) {
      presentMembers.add(rec.memberId);
    }
  }
  const ids = Array.from(presentMembers);
  return {
    count: ids.length,
    memberIds: ids,
  };
}
