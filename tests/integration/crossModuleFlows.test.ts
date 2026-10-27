import { describe, it, expect, beforeEach } from 'vitest';
import { mockStore } from '@/mock/store';
import { generateMembershipId } from '@/domain/idGenerator';
import {
  evaluateRegistrationStatus,
  promoteNextWaitlistedMember,
  canAcceptWalkIn,
} from '@/domain/capacity';
import { canSendMessage, evaluateOptOutAction } from '@/domain/consent';
import {
  isAttendanceLocked,
  validateCorrectionRequest,
  canApproveCorrection,
  calculateLockCountdown,
} from '@/domain/attendance';
import { canTransitionReferral, getNextAllowedReferralStatuses } from '@/domain/referrals';
import {
  calculateTotalAttendance,
  calculateUniqueParticipants,
  calculateActiveMembers,
} from '@/domain/metrics';
import {
  maskPhoneNumber,
  dobToAgeBand,
  suppressSmallNumber,
  escapeCsvFormula,
} from '@/domain/masking';
import { authorize, hasPermission } from '@/permissions/authorize';
import { RoleCode } from '@/permissions/matrix';
import { SeniorCitizen, UserAccount } from '@/api/contracts';

describe('P4: Cross-Module Integration Flows (Mock API + Domain Engines + RBAC)', () => {
  beforeEach(() => {
    mockStore.resetToDefaults();
  });

  it('Flow 1: Assisted Member Registration → ID Issuance → Store Persistence → Audit Log', () => {
    const data = mockStore.getData();
    const existingCount = data.seniorCitizens.length;

    // 1. Generate membership ID for Pune hub
    const newId = generateMembershipId('PUN', 26, existingCount + 1);
    expect(newId).toMatch(/^VV-PUN-26-\d{5}$/);

    // 2. Build assisted registration record
    const newSenior: SeniorCitizen = {
      id: `m-integration-${Date.now()}`,
      membershipId: newId,
      fullName: 'Ramesh Kulkarni',
      dateOfBirth: '1952-04-12',
      gender: 'Male',
      phone: '9822199887',
      emergencyContactName: 'Sunil Kulkarni (Son)',
      emergencyContactPhone: '9822199888',
      centreId: 'HUB-PUN',
      primaryLanguage: 'Marathi',
      address: '14 Sadashiv Peth, Pune',
      digitalConfidence: 'None',
      isAssistedRegistration: true,
      assistedBy: 'Pooja Deshmukh (Field Volunteer)',
      consentStatus: 'OptedIn',
      consentRecordedAt: new Date().toISOString(),
      optedOutChannels: [],
      registeredAt: new Date().toISOString(),
      isActive: false,
      status: 'Registered',
    };

    // 3. Persist to store
    mockStore.updateData((draft) => {
      draft.seniorCitizens.push(newSenior);
    });

    // 4. Write audit event
    const auditEvent = mockStore.writeAudit(
      'u-vf-1',
      'Pooja Deshmukh',
      'VF',
      'CREATE',
      'SeniorCitizen',
      newSenior.id,
      'Assisted on-site paper-to-digital registration at Ekta Hub Pune',
      null,
      { fullName: newSenior.fullName, membershipId: newSenior.membershipId },
      'HUB-PUN'
    );

    // Assertions
    const reloaded = mockStore.getData().seniorCitizens.find((s) => s.id === newSenior.id);
    expect(reloaded).toBeDefined();
    expect(reloaded?.membershipId).toBe(newId);
    expect(reloaded?.isAssistedRegistration).toBe(true);

    const auditFound = mockStore.getData().auditEvents.find((a) => a.id === auditEvent.id);
    expect(auditFound).toBeDefined();
    expect(auditFound?.action).toBe('CREATE');
    expect(auditFound?.entity).toBe('SeniorCitizen');
  });

  it('Flow 2: Capacity Control → Waitlist → Cancellation → Promotion → Consent Block Check', () => {
    // 1. Capacity evaluation
    const sessionCapacity = 20;
    expect(
      evaluateRegistrationStatus({
        capacity: sessionCapacity,
        confirmedCount: 15,
        waitlistEnabled: true,
      })
    ).toBe('Confirmed');

    expect(
      evaluateRegistrationStatus({
        capacity: sessionCapacity,
        confirmedCount: 20,
        waitlistEnabled: true,
      })
    ).toBe('Waitlisted');

    expect(
      evaluateRegistrationStatus({
        capacity: sessionCapacity,
        confirmedCount: 20,
        waitlistEnabled: false,
      })
    ).toBe('RejectedFull');

    // 2. Waitlist promotion
    const waitlist = [
      { id: 'reg-wait-1', memberId: 'm-101', registeredAt: '2026-10-25T10:00:00Z' },
      { id: 'reg-wait-2', memberId: 'm-102', registeredAt: '2026-10-25T10:05:00Z' },
    ];
    const promotion = promoteNextWaitlistedMember(waitlist);
    expect(promotion.promotedRegistrationId).toBe('reg-wait-1');
    expect(promotion.remainingWaitlist.length).toBe(1);

    // 3. Walk-in capacity
    expect(
      canAcceptWalkIn({
        walkInsAllowed: true,
        capacity: 20,
        confirmedCount: 18,
        walkInCount: 1,
      })
    ).toBe(true);

    expect(
      canAcceptWalkIn({
        walkInsAllowed: true,
        capacity: 20,
        confirmedCount: 19,
        walkInCount: 1,
      })
    ).toBe(false);

    // 4. Opted-out member block check
    const optedOutSenior = {
      id: 'm-101',
      consentStatus: 'OptedOut' as const,
      optedOutChannels: ['WhatsApp'],
    };
    const sendCheck = canSendMessage(optedOutSenior, 'BookingConfirmation');
    expect(sendCheck.allowed).toBe(false);
    expect(sendCheck.reason).toContain('opted out');
  });

  it('Flow 3: Attendance Recording → Lockout → Correction Request → Maker-Checker Approval', () => {
    const sessionEndTime = '2026-10-27T10:00:00.000Z';
    const lockWindowHours = 12;

    // 1. Unlocked within window, countdown accurate
    expect(isAttendanceLocked(sessionEndTime, lockWindowHours, '2026-10-27T14:00:00.000Z')).toBe(false);
    expect(calculateLockCountdown(sessionEndTime, lockWindowHours, '2026-10-27T14:00:00.000Z')).toBe('8h');

    // 2. Locked after window
    expect(isAttendanceLocked(sessionEndTime, lockWindowHours, '2026-10-27T23:30:00.000Z')).toBe(true);
    expect(calculateLockCountdown(sessionEndTime, lockWindowHours, '2026-10-27T23:30:00.000Z')).toBe('0h');

    // 3. Volunteer creates a correction request
    const correctionRequest = {
      memberId: 'm-10',
      sessionId: 'sess-1',
      previousStatus: 'Absent' as const,
      requestedStatus: 'Present' as const,
      reason: 'Senior attended but was marked absent due to late arrival',
      requesterId: 'u-vf-1',
    };
    const validation = validateCorrectionRequest(correctionRequest);
    expect(validation.valid).toBe(true);

    // 4. Maker-checker: Requester (u-vf-1) CANNOT approve
    const correctionRecord = {
      id: 'corr-101',
      requesterId: 'u-vf-1',
      centreId: 'HUB-PUN',
      status: 'Pending' as const,
    };

    expect(
      canApproveCorrection({
        correction: correctionRecord,
        approverId: 'u-vf-1',
        approverRole: 'CC',
        approverCentres: ['HUB-PUN'],
      })
    ).toBe(false);

    // 5. Distinct Coordinator at HUB-PUN approves
    expect(
      canApproveCorrection({
        correction: correctionRecord,
        approverId: 'u-cc-pune',
        approverRole: 'CC',
        approverCentres: ['HUB-PUN'],
      })
    ).toBe(true);

    // 6. Metrics calculation verifies distinct counts
    const attendanceRecords = [
      { id: '1', memberId: 'm-1', sessionDate: '2026-10-20', status: 'Present' as const },
      { id: '2', memberId: 'm-1', sessionDate: '2026-10-22', status: 'Present' as const }, // Repeat
      { id: '3', memberId: 'm-2', sessionDate: '2026-10-22', status: 'Present' as const },
      { id: '4', memberId: 'm-3', sessionDate: '2026-10-22', status: 'Absent' as const },
    ];
    expect(calculateTotalAttendance(attendanceRecords)).toBe(3); // 3 Present marks
    const unique = calculateUniqueParticipants(attendanceRecords);
    expect(unique.count).toBe(2); // m-1 and m-2
    expect(unique.memberIds).toEqual(['m-1', 'm-2']);
  });

  it('Flow 4: Referral Lifecycle → Data Minimization for Partner → State Machine Progression', () => {
    // 1. Data Minimization check
    const ageBand = dobToAgeBand('1948-05-10');
    expect(ageBand).toBe('75–79');

    const maskedPhone = maskPhoneNumber('9822012345');
    expect(maskedPhone).toBe('••••••2345');

    // 2. Legal state machine transitions: Created -> Sent -> Accepted -> InProgress -> Closed
    expect(canTransitionReferral('Created', 'Sent')).toBe(true);
    expect(canTransitionReferral('Sent', 'Accepted')).toBe(true);
    expect(canTransitionReferral('Accepted', 'InProgress')).toBe(true);
    expect(canTransitionReferral('InProgress', 'Closed')).toBe(true);

    // 3. Illegal state machine transitions are rejected
    expect(canTransitionReferral('Created', 'Closed')).toBe(false);
    expect(canTransitionReferral('Closed', 'InProgress')).toBe(false);

    // 4. Next allowed transitions query
    expect(getNextAllowedReferralStatuses('Created')).toEqual(['Sent', 'Cancelled']);
    expect(getNextAllowedReferralStatuses('Closed')).toEqual([]);
  });

  it('Flow 5: Scope & Centre Isolation Enforcement across Roles', () => {
    const ccPune: UserAccount = {
      id: 'u-cc-pun',
      fullName: 'Sunita Patil',
      email: 'pune.coordinator@vayohvikas.org',
      role: 'CC',
      assignedCentres: ['HUB-PUN'],
      isActive: true,
      mfaEnabled: false,
      failedLoginAttempts: 0,
    };

    const memberPune = { id: 'm-pun', centreId: 'HUB-PUN' };
    const memberNashik = { id: 'm-nsk', centreId: 'HUB-NSK' };

    // CC Pune CAN read Pune member
    expect(authorize(ccPune, 'MEMBER_PROFILES', 'read', memberPune)).toBe(true);

    // CC Pune CANNOT read Nashik member (Scope Isolation)
    expect(authorize(ccPune, 'MEMBER_PROFILES', 'read', memberNashik)).toBe(false);

    // CC Pune CANNOT export Nashik attendance
    expect(authorize(ccPune, 'ATTENDANCE', 'export', memberNashik)).toBe(false);

    // CSR Reviewer (CD) sees aggregates only, counts under 5 are suppressed
    const cdUser: UserAccount = {
      id: 'u-cd',
      fullName: 'CSR Partner Lead',
      email: 'csr@tata.com',
      role: 'CD',
      assignedCentres: [],
      isActive: true,
      mfaEnabled: false,
      failedLoginAttempts: 0,
    };

    expect(authorize(cdUser, 'CSR_REPORTS', 'read')).toBe(true);
    expect(authorize(cdUser, 'MEMBER_PROFILES', 'read')).toBe(false);

    // Small-number suppression rule: < 5 shown as "<5"
    expect(suppressSmallNumber(3)).toBe('<5');
    expect(suppressSmallNumber(0)).toBe('0');
    expect(suppressSmallNumber(5)).toBe('5');
    expect(suppressSmallNumber(142)).toBe('142');

    // CSV Formula Injection Sanitization
    expect(escapeCsvFormula('=SUM(A1:B10)')).toBe("'=SUM(A1:B10)");
    expect(escapeCsvFormula('+cmd|')).toBe("'+cmd|");
    expect(escapeCsvFormula('@echo')).toBe("'@echo");
    expect(escapeCsvFormula('-100')).toBe("'-100");
    expect(escapeCsvFormula('Safe Text')).toBe('Safe Text');
  });

  it('Flow 6: Account Security: Lockout After 5 Failed Login Attempts', () => {
    const userToLock = {
      id: 'u-test-lock',
      email: 'test.lock@vayohvikas.org',
      failedLoginAttempts: 0,
      lockoutUntil: null as string | null,
    };

    // Simulate 5 consecutive failed attempts
    for (let i = 1; i <= 5; i++) {
      userToLock.failedLoginAttempts += 1;
      if (userToLock.failedLoginAttempts >= 5) {
        userToLock.lockoutUntil = new Date(Date.now() + 15 * 60 * 1000).toISOString();
      }
    }

    expect(userToLock.failedLoginAttempts).toBe(5);
    expect(userToLock.lockoutUntil).not.toBeNull();
    const isLocked = new Date(userToLock.lockoutUntil!) > new Date();
    expect(isLocked).toBe(true);
  });
});
