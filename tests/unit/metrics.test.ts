import { describe, it, expect } from 'vitest';
import {
  calculateActiveMembers,
  calculateUniqueParticipants,
  calculateTotalAttendance,
  isMemberActive,
} from '@/domain/metrics';

describe('Measurement & Reporting Definitions (Section 1)', () => {
  const members = [
    { id: 'm-1', membershipId: 'VV-PUN-26-00001' },
    { id: 'm-2', membershipId: 'VV-PUN-26-00002' },
    { id: 'm-3', membershipId: 'VV-PUN-26-00003' },
    { id: 'm-4', membershipId: 'VV-PUN-26-00004' },
  ];

  // Reference date: 2026-10-27
  const attendanceRecords = [
    // m-1 attended 3 sessions in October 2026 (Active & Participant)
    { id: 'a-1', memberId: 'm-1', sessionDate: '2026-10-25', status: 'Present' },
    { id: 'a-2', memberId: 'm-1', sessionDate: '2026-10-20', status: 'Present' },
    { id: 'a-3', memberId: 'm-1', sessionDate: '2026-10-15', status: 'Present' },
    // m-2 attended 1 session in October 2026 (Active & Participant)
    { id: 'a-4', memberId: 'm-2', sessionDate: '2026-10-10', status: 'Present' },
    // m-3 attended in July 2026 (> 30 days ago, not active in current 30-day window)
    { id: 'a-5', memberId: 'm-3', sessionDate: '2026-07-15', status: 'Present' },
    // m-4 has an absent mark
    { id: 'a-6', memberId: 'm-4', sessionDate: '2026-10-25', status: 'Absent' },
  ];

  it('should verify Registered count is total membership records', () => {
    expect(members.length).toBe(4);
  });

  it('should identify Active members (attended at least 1 session in last 30 days)', () => {
    const referenceDate = '2026-10-27';
    const activeWindowDays = 30;

    expect(isMemberActive('m-1', attendanceRecords, referenceDate, activeWindowDays)).toBe(true);
    expect(isMemberActive('m-2', attendanceRecords, referenceDate, activeWindowDays)).toBe(true);
    expect(isMemberActive('m-3', attendanceRecords, referenceDate, activeWindowDays)).toBe(false);
    expect(isMemberActive('m-4', attendanceRecords, referenceDate, activeWindowDays)).toBe(false);

    const activeList = calculateActiveMembers(members, attendanceRecords, referenceDate, activeWindowDays);
    expect(activeList.length).toBe(2);
    expect(activeList).toContain('m-1');
    expect(activeList).toContain('m-2');
  });

  it('should distinguish Total Attendance marks from Unique Participants', () => {
    // Total attendance = count of present marks
    const total = calculateTotalAttendance(attendanceRecords);
    expect(total).toBe(5); // 3 for m-1 + 1 for m-2 + 1 for m-3

    // Unique participants = distinct members who attended at least once
    const unique = calculateUniqueParticipants(attendanceRecords);
    expect(unique.count).toBe(3); // m-1, m-2, m-3
    expect(unique.memberIds).toEqual(expect.arrayContaining(['m-1', 'm-2', 'm-3']));
  });
});
