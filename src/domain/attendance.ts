/**
 * Attendance Lock & Corrections (FR-19–22)
 */

export function isAttendanceLocked(
  sessionEndTime: string,
  lockWindowHours: number = 12,
  currentTime: string = new Date().toISOString()
): boolean {
  const endMs = new Date(sessionEndTime).getTime();
  const currentMs = new Date(currentTime).getTime();
  const lockMs = endMs + lockWindowHours * 60 * 60 * 1000;

  return currentMs >= lockMs;
}

export function getLockRemainingHours(
  sessionEndTime: string,
  lockWindowHours: number = 12,
  currentTime: string = new Date().toISOString()
): number {
  const endMs = new Date(sessionEndTime).getTime();
  const currentMs = new Date(currentTime).getTime();
  const lockMs = endMs + lockWindowHours * 60 * 60 * 1000;

  const diffMs = lockMs - currentMs;
  if (diffMs <= 0) return 0;

  return Math.ceil(diffMs / (60 * 60 * 1000));
}

export function calculateLockCountdown(
  sessionEndTime: string,
  lockWindowHours: number = 12,
  currentTime: string = new Date().toISOString()
): string {
  const hours = getLockRemainingHours(sessionEndTime, lockWindowHours, currentTime);
  if (hours <= 0) return '0h';
  return `${hours}h`;
}

export interface AttendanceCorrectionRequest {
  memberId: string;
  sessionId: string;
  previousStatus: 'Present' | 'Absent';
  requestedStatus: 'Present' | 'Absent';
  reason: string;
  requesterId: string;
}

export function validateCorrectionRequest(
  request: AttendanceCorrectionRequest
): { valid: boolean; errors: string[] } {
  const errors: string[] = [];

  if (!request.memberId) errors.push('Member ID is required');
  if (!request.sessionId) errors.push('Session ID is required');
  if (!request.reason || request.reason.trim().length === 0) {
    errors.push('Mandatory justification reason is required for attendance correction');
  }
  if (request.previousStatus === request.requestedStatus) {
    errors.push('Requested status must differ from previous status');
  }
  if (!request.requesterId) errors.push('Requester ID is required');

  return {
    valid: errors.length === 0,
    errors,
  };
}

export interface ApproveCorrectionParams {
  correction: {
    id: string;
    requesterId: string;
    centreId: string;
    status: 'Pending' | 'Approved' | 'Rejected';
  };
  approverId: string;
  approverRole: string;
  approverCentres: string[];
}

export function canApproveCorrection(params: ApproveCorrectionParams): boolean {
  const { correction, approverId, approverRole, approverCentres } = params;

  if (correction.status !== 'Pending') return false;

  // Maker cannot approve own request (Maker-Checker rule)
  if (correction.requesterId === approverId) {
    return false;
  }

  // Programme Manager (PM) can approve organisation-wide
  if (approverRole === 'PM') {
    return true;
  }

  // Centre Coordinator (CC) can only approve corrections for their assigned centres
  if (approverRole === 'CC') {
    return approverCentres.includes(correction.centreId);
  }

  return false;
}
