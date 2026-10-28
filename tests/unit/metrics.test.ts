import { describe, it, expect } from 'vitest';
import {
  calculateActiveMembers,
  calculateUniqueParticipants,
  calculateTotalAttendance,
  isMemberActive,
  isSeniorRegistered,
  isSeniorActive,
  calculateMedian,
  calculatePercentage,
  AttendanceItem,
} from '@/domain/metrics';

describe('Measurement & Reporting Definitions (Section 1)', () => {
  const members = [
    { id: 'm-1', membershipId: 'VV-PUN-26-00001' },
    { id: 'm-2', membershipId: 'VV-PUN-26-00002' },
    { id: 'm-3', membershipId: 'VV-PUN-26-00003' },
    { id: 'm-4', membershipId: 'VV-PUN-26-00004' },
  ];

  const attendanceRecords: AttendanceItem[] = [
    { id: 'a-1', memberId: 'm-1', sessionDate: '2026-10-25', status: 'Present' },
    { id: 'a-2', memberId: 'm-1', sessionDate: '2026-10-20', status: 'Present' },
    { id: 'a-3', memberId: 'm-1', sessionDate: '2026-10-15', status: 'Present' },
    { id: 'a-4', memberId: 'm-2', sessionDate: '2026-10-10', status: 'Present' },
    { id: 'a-5', memberId: 'm-3', sessionDate: '2026-07-15', status: 'Present' },
    { id: 'a-6', memberId: 'm-4', sessionDate: '2026-10-25', status: 'Absent' },
  ];

  it('verifies v2 Pilot canonical Registered condition', () => {
    // Valid registered senior
    expect(
      isSeniorRegistered({
        fullName: 'Ramesh Kulkarni',
        primaryLanguage: 'Marathi',
        emergencyContacts: [{ id: 'c1', name: 'Sunil', relationship: 'Son', phone: '9822011223', isPrimary: true, safetySmsConsent: true, priorityOrder: 1 }],
        consent: { generalCommunications: true, safetySmsFallback: true, abdmLinkage: false, recordedAt: '2026-10-01', version: 'v1' },
      })
    ).toBe(true);

    // Incomplete without emergency contacts
    expect(
      isSeniorRegistered({
        fullName: 'Ramesh Kulkarni',
        primaryLanguage: 'Marathi',
        emergencyContacts: [],
      })
    ).toBe(false);
  });

  it('identifies Active senior who responded within 14 days', () => {
    const now = '2026-10-28T10:00:00.000Z';
    const logs = [
      { seniorId: 'm-1', timestamp: '2026-10-25T10:00:00.000Z' }, // 3 days ago (active)
      { seniorId: 'm-2', timestamp: '2026-10-01T10:00:00.000Z' }, // 27 days ago (>14d, inactive)
    ];

    expect(isSeniorActive('m-1', logs, now, 14)).toBe(true);
    expect(isSeniorActive('m-2', logs, now, 14)).toBe(false);
    expect(isSeniorActive('m-3', logs, now, 14)).toBe(false);
  });

  it('computes medians and percentages cleanly', () => {
    expect(calculateMedian([10, 20, 30, 40, 50])).toBe(30);
    expect(calculateMedian([10, 20, 30, 40])).toBe(25);
    expect(calculateMedian([])).toBe(0);

    expect(calculatePercentage(85, 100)).toBe(85);
    expect(calculatePercentage(1, 3)).toBe(33.3);
    expect(calculatePercentage(0, 0)).toBe(0);
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
    const total = calculateTotalAttendance(attendanceRecords);
    expect(total).toBe(5);

    const unique = calculateUniqueParticipants(attendanceRecords);
    expect(unique.count).toBe(3);
    expect(unique.memberIds).toEqual(expect.arrayContaining(['m-1', 'm-2', 'm-3']));
  });
});
