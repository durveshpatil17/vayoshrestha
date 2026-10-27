/**
 * Reporting and Measurement Metrics (Section 1)
 *
 * CANONICAL DEFINITIONS:
 * - Registered: has a valid membership record.
 * - Active: attended at least one session in the last 30 days (configurable window).
 * - Participant: attended at least one session in the selected period.
 * - Total Attendance: count of attendance marks (Present).
 * - Unique Participants: distinct members attending at least once.
 */

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
