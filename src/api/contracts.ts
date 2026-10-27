import { RoleCode } from '@/permissions/matrix';

export interface UserAccount {
  id: string;
  email: string;
  phone?: string;
  fullName: string;
  role: RoleCode;
  assignedCentres: string[];
  linkedSeniors?: string[];
  partnerOrganisationId?: string;
  partnerId?: string;
  isActive: boolean;
  mfaEnabled: boolean;
  failedLoginAttempts: number;
  failedAttempts?: number;
  lockoutUntil?: string | null;
  lockedUntil?: string | null;
  mustChangePassword?: boolean;
  lastLoginAt?: string;
  avatarUrl?: string;
}

export interface EktaHub {
  id: string;
  code: string; // e.g. 'PUN', 'NSK', 'NAG', 'IND', 'JAI', 'LUK'
  name: string;
  city: string;
  state: string;
  address: string;
  contactPerson: string;
  contactPhone: string;
  seatingCapacity: number;
  facilities: string[];
  operatingSchedule: string;
  status: 'Active' | 'UnderMaintenance' | 'Inactive';
}

export interface SeniorCitizen {
  id: string;
  membershipId: string; // VV-PUN-26-00001
  fullName: string;
  dateOfBirth: string; // YYYY-MM-DD
  gender: 'Female' | 'Male' | 'Other';
  phone: string; // e.g. 9822012345
  emergencyContactName: string;
  emergencyContactPhone: string;
  centreId: string;
  primaryLanguage: 'Hindi' | 'Marathi' | 'English' | 'Gujarati';
  preferredLanguage?: 'Hindi' | 'Marathi' | 'English' | 'Gujarati' | string;
  address: string;
  digitalConfidence: 'Basic' | 'Assisted' | 'Confident' | 'None';
  isAssistedRegistration: boolean;
  isAssisted?: boolean;
  assistedBy?: string; // Volunteer or Family name
  consentStatus: 'OptedIn' | 'OptedOut' | 'Pending';
  consentRecordedAt?: string;
  optedOutChannels: string[];
  registeredAt: string;
  isActive: boolean; // Active = attended session in last 30d
  status: 'Registered' | 'Active' | 'OptedOut' | 'Suspended';
}

export interface FamilyLink {
  id: string;
  seniorId: string;
  familyUserId: string;
  relationship: 'Son' | 'Daughter' | 'Spouse' | 'Guardian' | 'Other';
  consentGranted: boolean;
  consentGrantedAt: string;
  status: 'Active' | 'Pending' | 'Revoked';
}

export interface Programme {
  id: string;
  title: string;
  category: 'Yoga & Wellness' | 'Digital Literacy' | 'Health Camp' | 'Legal Aid' | 'Social Meet' | 'Nutrition';
  description: string;
  eligibility: string;
  capacityPerSession: number;
  waitlistEnabled: boolean;
  walkInsAllowed: boolean;
  assignedCentres: string[];
  status: 'Draft' | 'Published' | 'Ongoing' | 'Completed' | 'Cancelled';
  createdAt: string;
}

export interface ProgrammeSession {
  id: string;
  programmeId: string;
  programmeTitle: string;
  centreId: string;
  centreName: string;
  date: string; // YYYY-MM-DD
  startTime: string; // HH:mm
  endTime: string; // HH:mm
  capacity: number;
  confirmedCount: number;
  waitlistCount: number;
  walkInCount: number;
  attendanceRecorded: boolean;
  attendanceRecordedAt?: string;
  attendanceRecordedBy?: string;
  status: 'Scheduled' | 'Completed' | 'Cancelled';
}

export interface SessionRegistration {
  id: string;
  sessionId: string;
  memberId: string;
  memberName: string;
  status: 'Confirmed' | 'Waitlisted' | 'Cancelled' | 'Attended';
  isWalkIn: boolean;
  registeredAt: string;
  cancelledAt?: string;
}

export interface AttendanceRecord {
  id: string;
  sessionId: string;
  centreId: string;
  memberId: string;
  memberName: string;
  membershipId: string;
  sessionDate: string;
  status: 'Present' | 'Absent';
  recordedBy: string;
  recordedAt: string;
  corrected: boolean;
}

export interface AttendanceCorrection {
  id: string;
  attendanceRecordId: string;
  sessionId: string;
  centreId: string;
  memberId: string;
  memberName: string;
  previousStatus: 'Present' | 'Absent';
  requestedStatus: 'Present' | 'Absent';
  reason: string;
  requesterId: string;
  requesterName: string;
  requestedAt: string;
  status: 'Pending' | 'Approved' | 'Rejected';
  reviewedBy?: string;
  reviewedAt?: string;
  reviewComment?: string;
}

export interface MessageTemplate {
  id: string;
  code: string;
  title: string;
  category: 'BookingConfirmation' | 'SessionReminder' | 'Announcement' | 'EducationalTip';
  body: string;
  variables: string[];
  languages: ('English' | 'Hindi' | 'Marathi')[];
  status: 'Draft' | 'Submitted' | 'Approved' | 'Rejected';
  submittedBy: string;
  reviewedBy?: string;
  reviewComment?: string;
  updatedAt: string;
}

export interface OutboundMessage {
  id: string;
  recipientMemberId: string;
  recipientPhone: string;
  recipientName: string;
  centreId: string;
  templateCode: string;
  category: string;
  content: string;
  status: 'Queued' | 'Sent' | 'Delivered' | 'Read' | 'Failed';
  failureReason?: string;
  scheduledFor: string;
  sentAt?: string;
  deliveredAt?: string;
  readAt?: string;
  retryCount: number;
}

export interface Announcement {
  id: string;
  title: string;
  content: string;
  category: 'Event' | 'HealthAlert' | 'Closure' | 'General';
  targetCentres: string[];
  targetLanguages: string[];
  audienceSize: number;
  excludedNoConsent: number;
  excludedOptedOut: number;
  scheduledFor: string;
  status: 'Draft' | 'Submitted' | 'Approved' | 'Sent' | 'Cancelled';
  submittedBy: string;
  submittedAt: string;
  approvedBy?: string;
  approvedAt?: string;
}

export interface ServicePartner {
  id: string;
  name: string;
  category: 'Clinic' | 'Physiotherapy' | 'Legal Aid' | 'Eye Care' | 'Pension Helpdesk';
  contactPerson: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  approvalStatus: 'Approved' | 'Pending' | 'Suspended';
  approvedAt?: string;
  notes: string;
}

export interface ServiceItem {
  id: string;
  partnerId: string;
  partnerName: string;
  title: string;
  category: string;
  description: string;
  eligibility: string;
  availableDays: string[];
  centresServed: string[];
  status: 'Approved' | 'Pending' | 'Inactive';
}

export interface Referral {
  id: string;
  memberId: string;
  memberName: string;
  memberAgeBand: string;
  centreId: string;
  partnerId: string;
  partnerName: string;
  serviceId: string;
  serviceName: string;
  urgency: 'Immediate' | 'High' | 'Normal';
  nonClinicalReason: string;
  status: 'Created' | 'Sent' | 'Accepted' | 'InProgress' | 'Closed' | 'Declined' | 'Cancelled';
  createdBy: string;
  createdByName: string;
  createdAt: string;
  partnerNotes?: string;
  closedAt?: string;
  closureOutcome?: 'Resolved' | 'Declined' | 'NoResponse';
}

export interface FeedbackItem {
  id: string;
  memberId: string;
  memberName: string;
  programmeId: string;
  programmeTitle: string;
  sessionId: string;
  centreId: string;
  rating: number; // 1-5 stars
  theme: 'Instructor' | 'Venue' | 'Content' | 'Assistance' | 'General';
  comment: string;
  isAssistedEntry: boolean;
  recordedBy?: string;
  createdAt: string;
}

export interface FollowUpTask {
  id: string;
  memberId: string;
  memberName: string;
  centreId: string;
  reason: string;
  assigneeId: string;
  assigneeName: string;
  dueDate: string;
  status: 'Pending' | 'Contacted' | 'Escalated' | 'Closed';
  outcomeNotes?: string;
  createdAt: string;
}

export interface HealthEscalation {
  id: string;
  memberId: string;
  memberName: string;
  centreId: string;
  severity: 'Immediate' | 'High' | 'Standard';
  source: 'WhatsApp' | 'CentreWalkIn' | 'FamilyCall' | 'StaffFlag';
  triggerKeywords: string[];
  summary: string;
  slaHours: number;
  assignedExpertId?: string;
  assignedExpertName?: string;
  status: 'Open' | 'Acknowledged' | 'InProgress' | 'Resolved' | 'Closed';
  createdAt: string;
  acknowledgedAt?: string;
  resolvedAt?: string;
  resolutionSummary?: string;
  handoverNotes?: string;
}

export interface AuditEvent {
  id: string;
  actorId: string;
  actorName: string;
  actorRole: RoleCode;
  centreId?: string;
  action: 'CREATE' | 'UPDATE' | 'DELETE' | 'APPROVE' | 'EXPORT' | 'CONSENT_CHANGE' | 'ATTENDANCE_CORRECTION' | 'PII_REVEAL';
  entity: string;
  entityId: string;
  reason?: string;
  diffBefore?: Record<string, any> | any | null;
  diffAfter?: Record<string, any> | any | null;
  timestamp: string;
  hash: string;
}

export interface ComplaintTicket {
  id: string;
  category: 'Staff Conduct' | 'Facility' | 'Scheduling' | 'Communication' | 'Other';
  complainantName: string;
  complainantRole: RoleCode;
  complainantContact: string;
  centreId?: string;
  subject: string;
  description: string;
  urgency: 'Low' | 'Medium' | 'High';
  status: 'New' | 'Assigned' | 'InProgress' | 'Resolved';
  assignedTo?: string;
  createdAt: string;
  replies: {
    id: string;
    senderName: string;
    senderRole: RoleCode;
    message: string;
    sentAt: string;
  }[];
}

export interface SystemSettings {
  organisationName: string;
  pilotStartDate: string;
  pilotEndDate: string;
  pilotRegistrationTarget: number;
  activeMemberWindowDays: number;
  attendanceLockHours: number;
  whatsappMessageVolumeCap: number;
  supportedLanguages: string[];
  sessionTimeoutMinutes: number;
  featureFlags: {
    voiceCheckins: boolean;
    familyAccess: boolean;
    advancedReferrals: boolean;
  };
  consentTextVersion: string;
}
