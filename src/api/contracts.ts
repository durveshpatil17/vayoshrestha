/**
 * Comprehensive Typed API Contracts for Vayoshrestha Pilot v2.
 * Strictly browser-side mock backend simulating state persisted to localStorage.
 */

import { RoleCode } from '@/permissions/matrix';
export type { RoleCode };

export interface Region {
  id: string; // e.g. 'REG-S'
  name: string; // e.g. 'South Region'
  code: string; // 'S'
  regionalAdminId?: string;
  regionalAdminName?: string;
  regionalAdminEmail?: string;
}

export interface DutyRosterMember {
  userId: string;
  userName: string;
  role: RoleCode;
  shift: string;
  onCallPhone: string;
  isPrimaryResponder: boolean;
}

export interface Chapter {
  id: string; // e.g. 'HUB-BLR'
  code: string; // 'BLR'
  name: string; // 'Bengaluru Ekta Hub (Jayanagar)'
  regionId: string; // 'REG-S'
  city: string; // 'Bengaluru'
  state: string; // 'Karnataka'
  address: string;
  contactPerson: string;
  contactPhone: string;
  languagesServed: string[];
  status: 'Active' | 'Paused' | 'Inactive' | string;
  onDutyRoster: DutyRosterMember[];
}

export interface UserAccount {
  id: string; // e.g. 'u-cm-blr'
  email: string;
  fullName: string;
  name?: string;
  role: RoleCode;
  phone?: string;
  assignedRegion?: string;
  assignedChapter?: string;
  chapterId?: string;
  regionId?: string;
  assignedCentres: string[]; // for backwards compatibility
  isActive: boolean;
  mfaEnabled: boolean;
  failedLoginAttempts: number;
  lockoutUntil?: string | null;
  lockedUntil?: string | null;
  mustChangePassword?: boolean;
  lastLoginAt?: string;
}

export interface EmergencyContact {
  id: string;
  seniorId?: string;
  name: string;
  relationship: string;
  phoneNumber?: string; // +91 Indian format
  phone?: string;
  safetySmsConsent?: boolean;
  priority?: number; // 1 = Primary Next-of-Kin, 2 = Secondary
  priorityOrder?: number;
  isPrimary?: boolean;
  consentRecorded?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface AbhaRecord {
  abhaNumber?: string; // 14-digit format XX-XXXX-XXXX-XXXX
  number?: string; // alias
  abhaAddress?: string; // e.g. ramesh.rao@abdm
  address?: string; // alias
  consentRecorded?: boolean; // separate ABDM consent
  abdmConsent?: boolean;
  consentProvided?: boolean;
  verificationStatus?: 'NotProvided' | 'ProvidedUnverified' | string; // NEVER "Verified" in pilot
  status?: 'not_provided' | 'provided_unverified' | string;
  phase2Note?: string; // Explicitly: "Structure only — Federated lookup scheduled for Phase 2"
}

export interface SeniorConsent {
  generalCommunications?: boolean;
  safetySmsFallback?: boolean;
  dataProcessing?: boolean;
  abdmRecordLinkage?: boolean;
  abdmLinkage?: boolean;
  withdrawnAt?: string | null;
  recordedAt?: string;
  timestamp?: string;
  version?: string;
}

export interface SeniorCitizen {
  id: string; // e.g. 'snr-001'
  memberId?: string; // e.g. 'VV-BLR-26-00042'
  membershipId?: string;
  fullName: string;
  name?: string;
  phoneNumber?: string; // +91 10-digit
  phone?: string;
  dateOfBirth?: string;
  age?: number;
  ageBand?: string;
  gender?: 'Male' | 'Female' | 'Other' | string;
  preferredLanguage?: 'English' | 'Hindi' | 'Kannada' | 'Marathi' | 'Tamil' | string;
  primaryLanguage?: string;
  address?: string;
  city?: string;
  pincode?: string;
  chapterId: string;
  centreId?: string; // alias
  regionId?: string;
  consentRecorded?: boolean;
  consent?: SeniorConsent;
  emergencyContacts?: EmergencyContact[];
  emergencyContactName?: string;
  emergencyContactPhone?: string;
  consentTimestamp?: string;
  consentVersion?: string;
  optedOut?: boolean;
  optedOutAt?: string;
  isOnboarded?: boolean;
  isAssistedRegistration?: boolean;
  assistedBy?: string; // User ID of volunteer if assisted onboarding
  abha: AbhaRecord;
  status: 'Registered' | 'Active' | 'Stalled' | 'Deactivated' | 'ACTIVE' | 'INACTIVE' | string;
  isActive: boolean; // Active = responded to any message in last 14 days
  lastActivityAt?: string;
  registeredAt: string;
  stalledAtStep?: number; // 1..7 for stalled onboarding funnel
  digitalConfidence?: string;
}

export type SosStatus =
  | 'Triggered'
  | 'Acknowledged'
  | 'Assigned'
  | 'Resolved'
  | 'CancelledBySenior'
  | 'TRIGGERED'
  | 'ACKNOWLEDGED'
  | 'RESPONDED'
  | 'RESOLVED'
  | 'CANCELLED_BY_SENIOR'
  | string;

export interface SosEvent {
  id: string; // e.g. 'SOS-20261028-001'
  seniorId: string;
  seniorName?: string;
  seniorPhone?: string;
  chapterId: string;
  regionId?: string;
  triggeredAt: string; // ISO timestamp
  enqueuedAt?: string;
  dashboardAlertedAt?: string;
  latencyMs: number; // Enqueue-to-dashboard latency (simulated, under 1000ms)
  networkStatus?: 'Online' | 'Disconnected' | string;
  networkStatusAtTrigger?: 'Online' | 'Disconnected' | 'ONLINE' | 'DISCONNECTED' | string;
  status: SosStatus;
  isDrill: boolean;
  assigneeId?: string;
  assignedResponderId?: string;
  assigneeName?: string;
  acknowledgedAt?: string;
  resolvedAt?: string;
  cancelledAt?: string;
  outcomeCode?: string;
  notes?: string | string[];
  escalationLevel?: number; // 1: CM, 2: RA, 3: NM/CT
  slaRemainingSeconds?: number;
  slaBreached?: boolean;
  fallbackSmsDispatched?: boolean;
  cellularFallbackTriggered?: boolean;
  cellularFallbackDelivered?: boolean;
  fallbackSmsStatus?: string;
  locationAddress?: string;
}

export interface SmsFallbackRecord {
  id: string;
  sosId?: string;
  sosEventId?: string;
  seniorId?: string;
  recipientName?: string;
  recipientPhone?: string;
  recipientPhoneNumber?: string;
  relationship?: string;
  templateId?: string;
  dltTemplateId?: string;
  messageText: string;
  status: 'Queued' | 'Sent' | 'Delivered' | 'Failed' | 'QUEUED' | 'SENT' | 'DELIVERED' | 'FAILED' | string;
  failureReason?: string;
  triggerReason?: string;
  dispatchedAt?: string;
  sentAt?: string;
  deliveredAt?: string;
  retryCount?: number;
}

export interface MedicationSchedule {
  id: string;
  seniorId: string;
  seniorName?: string;
  chapterId?: string;
  medicationLabel?: string;
  label?: string; // e.g. "Morning wellness prescription"
  scheduledTime?: string;
  time?: string; // e.g. "08:00"
  recurrence?: 'DAILY' | 'WEEKLY' | 'Daily' | 'Weekly' | string;
  frequency?: 'Daily' | 'Weekly' | string;
  days?: string[];
  language?: string;
  status: 'Active' | 'Paused' | 'ACTIVE' | 'PAUSED' | string;
  createdAt?: string;
  updatedAt?: string;
}

export interface MedicationConfirmation {
  id: string;
  seniorId: string;
  scheduleId: string;
  scheduledTime: string;
  response: 'Taken' | 'NotYet' | 'Skip' | string;
  respondedAt: string;
}

export interface VitalLog {
  id: string;
  seniorId: string;
  chapterId?: string;
  readingType?: 'BLOOD_PRESSURE' | 'BLOOD_GLUCOSE' | 'MEDICATION_CONFIRMATION' | string;
  type?: 'BloodPressure' | 'BloodGlucose' | string;
  systolic?: number;
  diastolic?: number;
  glucoseValue?: number;
  glucoseMgDl?: number;
  rawText?: string;
  rawInput?: string;
  medicationStatus?: string;
  riskBand?: 'NORMAL' | 'WATCH' | 'HIGH_RISK' | 'CRITICAL' | string;
  band?: 'Normal' | 'Watch' | 'HighRisk' | 'Critical' | string;
  recordedAt?: string;
  loggedAt?: string;
  isFlagged?: boolean;
  flagged?: boolean;
  ruleVersion?: string;
  isAssisted?: boolean;
}

export interface HealthFlag {
  id: string;
  seniorId: string;
  seniorName?: string;
  chapterId?: string;
  readingValue?: string;
  bandCrossed?: string;
  ruleVersion?: string;
  flaggedAt?: string;
  slaDueAt?: string;
  vitalLogId?: string;
  readingId?: string;
  vitalType?: string;
  readingSummary?: string;
  createdAt?: string;
  status: 'NEW' | 'CALL_ASSIGNED' | 'CLOSED' | 'New' | 'CallAssigned' | 'Closed' | string;
  callOutcome?: string;
  callCompletedAt?: string;
}

export interface WellnessCallTask {
  id: string;
  flagId?: string;
  seniorId: string;
  seniorName?: string;
  seniorPhone?: string;
  chapterId: string;
  reason: string;
  dueAt?: string;
  dueDate?: string;
  assignedToId?: string;
  assignedVolunteerId?: string;
  assignedToName?: string;
  attempts?: number;
  status?: 'PENDING' | 'IN_PROGRESS' | 'COMPLETED' | 'Pending' | 'InProgress' | 'Completed' | string;
  outcome?: string | null;
  notes?: string;
  createdAt?: string;
  completedAt?: string | null;
}

export interface ThresholdConfig {
  id?: string;
  version: string;
  label?: string;
  bloodPressure?: any;
  bloodGlucose?: any;
  bpSystolic?: { watch: number; highRisk: number; critical: number };
  bpDiastolic?: { watch: number; highRisk: number; critical: number };
  glucose?: { watch: number; highRisk: number; critical: number };
  isClinicianPlaceholder?: boolean;
  updatedBy?: string;
  updatedAt?: string;
  proposedBy?: string;
  approvedBy?: string;
  approvedAt?: string;
  approvalStatus?: string;
  status?: 'Draft' | 'PendingApproval' | 'Approved' | string;
}

export interface SosSettings {
  id?: string;
  version?: string;
  acknowledgementSlaMinutes?: number;
  ackSlaMinutes?: number;
  escalationChainMinutes?: number[];
  escalationChain?: { level: number; role: RoleCode; afterMinutes: number }[];
  fallbackBehavior?: 'first_delivered' | 'all_contacts' | string;
  cellularFallbackMode?: string;
  smsWording?: Record<string, string>;
  smsTemplates?: Record<string, string>;
  emergency112Notice?: string;
  drillModeEnabled?: boolean;
  approvalStatus?: string;
  status?: 'Draft' | 'PendingApproval' | 'Approved' | string;
  updatedBy?: string;
  updatedAt?: string;
  approvedBy?: string;
}

export interface ReminderTemplate {
  id: string;
  name?: string;
  title?: string;
  type?: 'Medication' | 'Vitals' | 'General' | string;
  content?: Record<string, string>;
  languages?: string[];
  buttons?: string[];
  vitalsPrompt?: string;
  variables?: string[];
  approvalStatus?: string;
  status?: 'Draft' | 'PendingApproval' | 'Approved' | string;
  updatedBy?: string;
  updatedAt?: string;
  approvedBy?: string | null;
}

export interface OnboardingScriptStep {
  stepNumber: number;
  key: string;
  promptText: Record<string, string>;
  validationRegex?: string;
  required: boolean;
}

export interface OnboardingScript {
  id: string;
  version: string;
  approvalStatus?: string;
  status?: 'Draft' | 'PendingApproval' | 'Approved' | string;
  steps: OnboardingScriptStep[];
  updatedBy?: string;
  updatedAt?: string;
  proposedBy?: string;
  approvedBy?: string;
}

export interface OnboardingSession {
  id: string;
  seniorId?: string;
  seniorName?: string;
  seniorPhone?: string;
  phoneNumber?: string;
  chapterId: string;
  currentStep: number;
  stepName: string;
  startedAt: string;
  lastUpdatedAt: string;
  stalledDays: number;
  nudgeCount: number;
  assignedVolunteerId?: string;
}

export interface SystemSettings {
  pilotTargetSeniors: number; // 1000
  pilotRegistrationTarget?: number;
  organisationName?: string;
  pilotStartDate?: string;
  pilotEndDate?: string;
  activeWindowDays: number; // 14
  activeMemberWindowDays?: number;
  attendanceLockHours?: number;
  whatsappMessageVolumeCap?: number;
  quietHoursStart: string; // "21:00"
  quietHoursEnd: string; // "07:00"
  dailyMessageVolumeCap: number; // 5
  supportedLanguages: string[];
  sessionTimeoutMinutes: number; // 15
  idleWarningSeconds: number; // 60
  featureFlags: {
    abhaCapture: boolean;
    drillMode: boolean;
    sosChimeDefault: boolean;
    voiceCheckins?: boolean;
    familyAccess?: boolean;
    advancedReferrals?: boolean;
  };
}

export interface AuditEvent {
  id: string;
  timestamp: string;
  actorId: string;
  actorName?: string;
  actorRole: RoleCode | string;
  chapterId?: string;
  regionId?: string;
  action:
    | 'CREATE'
    | 'UPDATE'
    | 'DELETE'
    | 'APPROVE'
    | 'EXPORT'
    | 'PII_REVEAL'
    | 'SOS_TRIGGER'
    | 'SOS_ACK'
    | 'SOS_RESOLVE'
    | 'CONSENT_CHANGE'
    | string;
  entityType:
    | 'SENIOR'
    | 'SOS'
    | 'HEALTH_FLAG'
    | 'TEMPLATE'
    | 'THRESHOLD'
    | 'USER'
    | 'SETTINGS'
    | 'ONBOARDING_SCRIPT'
    | 'SCHEDULE'
    | 'FLAG'
    | 'CALL'
    | 'CHAPTER'
    | 'REPORT'
    | string;
  entityId: string;
  details: string;
  reason?: string | null;
  diff?: any;
  previousHash?: string;
  hash?: string;
}

export interface OutboundMessage {
  id: string;
  channel: 'WhatsApp' | 'SMS';
  recipientPhone: string;
  recipientName: string;
  templateId?: string;
  content: string;
  status: 'Queued' | 'Sent' | 'Delivered' | 'Read' | 'Failed';
  failureReason?: string;
  sentAt: string;
  deliveredAt?: string;
  readAt?: string;
  retryCount: number;
}

// === Expanded v3 Domain Contracts ===

export interface Programme {
  id: string;
  code: string;
  name: string;
  category: 'Health & Wellness' | 'Digital Empowerment' | 'Mental Health & Social' | 'Financial & Legal' | 'Recreation & Arts';
  description: string;
  targetAudience: string;
  chapterIds: string[];
  status: 'Draft' | 'Active' | 'Paused' | 'Archived';
  sessionsCount: number;
  enrolledCount: number;
  leadCoordinatorId?: string;
  partnerId?: string;
  createdAt: string;
}

export interface ProgrammeSession {
  id: string;
  programmeId: string;
  programmeName: string;
  chapterId: string;
  chapterName: string;
  title: string;
  dateTime: string;
  durationMinutes: number;
  location: string;
  instructorName: string;
  capacity: number;
  enrolledCount: number;
  attendedCount?: number;
  attendanceStatus: 'Scheduled' | 'Completed' | 'Pending_Attendance' | 'Cancelled';
  attendanceLocked?: boolean;
}

export interface AttendanceRecord {
  id: string;
  sessionId: string;
  seniorId: string;
  seniorName: string;
  status: 'Present' | 'Absent' | 'Excused' | 'Walk_in';
  markedAt: string;
  markedByUserId: string;
  correctionRequested?: boolean;
  correctionReason?: string;
}

export interface ServiceItem {
  id: string;
  name: string;
  category: string;
  description: string;
  partnerId: string;
  partnerName: string;
  costType: 'Free' | 'Subsidised' | 'Fee_for_service';
  contactPerson: string;
  contactPhone: string;
  activeStatus: 'Active' | 'Inactive';
}

export interface ReferralRecord {
  id: string;
  seniorId: string;
  seniorName: string;
  chapterId: string;
  serviceId: string;
  serviceName: string;
  partnerId: string;
  partnerName: string;
  status: 'Requested' | 'Assigned' | 'In_Progress' | 'Completed' | 'Declined';
  notes: string;
  referredByUserId: string;
  referredAt: string;
  outcome?: string;
}

export interface PartnerOrganization {
  id: string;
  name: string;
  type: 'Clinical / Hospital' | 'Diagnostic Lab' | 'Legal Aid' | 'Mobility Aids' | 'Social Services';
  contactPerson: string;
  email: string;
  phone: string;
  city: string;
  mouStatus: 'Active' | 'Under_Renewal' | 'Draft';
  activeReferralsCount: number;
}

export interface FeedbackRecord {
  id: string;
  seniorId?: string;
  seniorName?: string;
  chapterId: string;
  programmeId?: string;
  programmeName?: string;
  rating: number; // 1-5
  satisfactionCategory: 'Excellent' | 'Good' | 'Average' | 'Needs_Improvement';
  feedbackText: string;
  submittedAt: string;
  channel: 'In_Person' | 'WhatsApp' | 'IVR';
}

export interface FollowUpTask {
  id: string;
  seniorId: string;
  seniorName: string;
  chapterId: string;
  reason: 'Absence_Followup' | 'Health_Flag' | 'Referral_Status' | 'General_Wellness';
  dueDate: string;
  priority: 'High' | 'Medium' | 'Low';
  assignedUserId: string;
  status: 'Pending' | 'Completed' | 'Escalated';
  outcomeNotes?: string;
}

export interface HealthSupportEscalation {
  id: string;
  seniorId: string;
  seniorName: string;
  chapterId: string;
  triggeredBy: string;
  severity: 'Critical' | 'High' | 'Medium';
  status: 'Open' | 'Assigned' | 'Resolved';
  assignedDoctorOrStaff: string;
  openedAt: string;
  resolvedAt?: string;
  resolutionSummary?: string;
}

export interface ComplaintRecord {
  id: string;
  seniorId?: string;
  complainantName: string;
  complainantPhone: string;
  chapterId: string;
  category: 'Service_Quality' | 'Staff_Behavior' | 'Transport' | 'Facilities' | 'Data_Privacy';
  description: string;
  status: 'Open' | 'Investigating' | 'Resolved';
  resolutionDetails?: string;
  submittedAt: string;
}

// ==========================================
// ECOSYSTEM ADDENDUM v3.1 DATA CONTRACTS
// ==========================================

export interface FieldAssociate {
  id: string; // e.g. 'fa-001'
  userId: string; // e.g. 'u-sf-1'
  fullName: string;
  phone: string;
  chapterId: string;
  regionId: string;
  trainingStatus: 'Certified' | 'In Training' | 'Needs Refresher';
  isActive: boolean;
  onboardedCount: number;
  activityCount: number;
  lastActiveAt: string;
  joinedAt: string;
  deactivationReason?: string;
}

export interface FieldActivityRecord {
  id: string;
  associateId: string;
  associateName: string;
  chapterId: string;
  regionId: string;
  activityType: 'onboarding' | 'check_in_visit' | 'consent_follow_up';
  peerNameMasked: string;
  peerPhoneMasked: string;
  areaLabel: string;
  latitude: number;
  longitude: number;
  doubleConsentStatus: 'confirmed' | 'consent_2_requested' | 'consent_1_captured' | 'expired' | 'declined';
  capturedOffline: boolean;
  capturedAt: string;
  syncedAt?: string;
  syncDelayMinutes: number;
  isLateSync: boolean;
  status: 'synced' | 'pending' | 'conflict' | 'rejected';
}

export interface RoutingRule {
  id: string;
  name: string;
  category: 'Hospital' | 'Diagnostic lab' | 'Legal network' | 'Financial expert' | 'Insurer';
  regionId?: string; // all or specific region
  languages: string[];
  priority: number;
  capacityStrategy: 'round-robin' | 'least-loaded';
  maxDailyCapacity: number;
  slaHours: number;
  fallbackTimeoutHours: number;
  fallbackPartnerId?: string;
  status: 'Draft' | 'Submitted' | 'Active' | 'Archived';
  version: number;
  authorId: string;
  authorName: string;
  approvedBy?: string;
  approvedAt?: string;
}

export interface RoutingDecisionRecord {
  id: string;
  requestId: string;
  serviceCategory: string;
  seniorId: string;
  seniorNameMasked: string;
  seniorPhoneMasked: string;
  chapterId: string;
  regionId: string;
  selectedPartnerId: string;
  selectedPartnerName: string;
  rulesMatched: string[];
  strategyUsed: string;
  loadAtRouting: string;
  routedAt: string;
  status: 'Auto_Routed' | 'Manual_Assigned' | 'Reassigned_Fallback' | 'Accepted' | 'Declined_Age_Bar' | 'Completed';
  declineReason?: 'Age_Bar_Exclusion' | 'No_Cover_Available' | 'Capacity_Exceeded' | 'Other';
  reassignedFromPartnerId?: string;
  reassignmentReason?: string;
  slaBreached: boolean;
  notes?: string;
}

export interface VoucherCampaign {
  id: string;
  title: string;
  partnerId: string;
  partnerName: string;
  category: 'Diagnostic lab' | 'Hospital' | 'Specialist Consultation';
  packageDescription: string;
  discountPercentage: number;
  maxVouchers: number;
  issuedCount: number;
  redeemedCount: number;
  budgetAllocated: number;
  validityDays: number;
  status: 'Draft' | 'Submitted' | 'Active' | 'Expired' | 'Paused';
  authorId: string;
  authorName: string;
  approvedBy?: string;
  approvedAt?: string;
  expiresAt: string;
}

export interface VoucherRecord {
  id: string;
  code: string; // 10-char Crockford Base32 + Check Digit
  campaignId: string;
  campaignTitle: string;
  partnerId: string;
  partnerName: string;
  seniorId: string;
  seniorNameMasked: string;
  seniorAgeBand: string;
  issuedAt: string;
  deliveredViaWhatsAppAt?: string;
  expiresAt: string;
  status: 'Issued' | 'Delivered' | 'Redeemed' | 'Expired' | 'Cancelled';
  redeemedAt?: string;
  redeemedByPartnerUserId?: string;
}

export interface LegalIntakeRecord {
  id: string;
  seniorId: string;
  seniorNameMasked: string;
  seniorAgeBand: string;
  chapterId: string;
  regionId: string;
  category: 'Property & Wills' | 'Maintenance & Welfare Act' | 'Pension Dispute' | 'Consumer Protection' | 'Elder Abuse';
  descriptionEncrypted: string;
  consentToShare: boolean;
  assignedLegalPartnerId: string;
  assignedLegalPartnerName: string;
  status: 'New' | 'Assigned' | 'In_Consultation' | 'Closed';
  closureReasonCode?: 'Advise_Provided' | 'Settlement_Reached' | 'Declined_Age_Bar_Exclusion' | 'Declined_Jurisdiction' | 'Referred_District_Legal_Services';
  submittedAt: string;
  closedAt?: string;
  accessLogs: { userId: string; role: string; accessedAt: string; reason: string }[];
}

export interface MicroLesson {
  id: string;
  title: string;
  category: 'Fraud & cyber safety' | 'Digital literacy' | 'Wellness' | 'Schemes awareness';
  cards: {
    cardIndex: number;
    title: string;
    bodyText: string;
    bulletPoints?: string[];
  }[];
  checkQuestion: {
    questionText: string;
    options: string[];
    correctIndex: number;
    explanation: string;
  };
  languageVariants: {
    language: 'English' | 'Hindi' | 'Kannada' | 'Marathi' | 'Tamil';
    isFullTranslation: boolean;
    title: string;
    cards: { cardIndex: number; title: string; bodyText: string }[];
    questionText: string;
    options: string[];
  }[];
  status: 'Draft' | 'Submitted' | 'Approved' | 'Archived';
  authorId: string;
  authorName: string;
  approvedBy?: string;
  approvedAt?: string;
}

export interface LessonSeries {
  id: string;
  title: string;
  description: string;
  category: string;
  lessonIds: string[];
  sendTimeIST: string; // e.g. "10:30"
  quietHours: { start: string; end: string }; // "21:00" to "07:00"
  audienceFilter: {
    chapters: string[];
    languages: string[];
    consentRequired: true;
  };
  totalSubscribers: number;
  status: 'Active' | 'Paused' | 'Draft';
  authorId: string;
  approvedBy?: string;
}

export interface WebinarRecord {
  id: string;
  title: string;
  category: string;
  language: string;
  scheduledAt: string;
  durationMinutes: number;
  presenterName: string;
  presenterAffiliation: string;
  description: string;
  capacity: number;
  enrolledCount: number;
  attendedCount: number;
  joinLinkPlaceholder: string;
  status: 'Scheduled' | 'Live' | 'Completed' | 'Cancelled';
}

export interface BroadcastChannelRecord {
  id: string;
  name: string;
  regionId: string;
  description: string;
  subscribersCount: number;
  status: 'Active' | 'Under_Review';
}

export interface QuizRecord {
  id: string;
  title: string;
  roundNumber: number;
  regionalChannelId: string;
  scheduledDate: string;
  questions: {
    id: string;
    questionText: string;
    options: string[];
    correctIndex: number;
  }[];
  signUpsCount: number;
  status: 'Upcoming' | 'Active' | 'Closed';
  leaderboard: {
    rank: number;
    firstNameOnly: string;
    chapterInitial: string;
    score: number;
    timeTakenSeconds: number;
  }[];
}

export interface VaccinationRecord {
  id: string;
  seniorId: string;
  chapterId: string;
  regionId: string;
  vaccineCategory: 'Influenza' | 'Pneumococcal' | 'COVID-19' | 'Shingles' | 'Tetanus_Td';
  status: 'Yes' | 'No' | 'Unsure' | 'Not_Asked';
  consentGated: boolean;
  recordedAt: string;
}

export interface ImpactPack {
  id: string;
  templateType: 'CSR Impact Brief' | 'Government Health Brief' | 'Insurance Age-Bar Evidence' | 'Elder Protection Evidence';
  title: string;
  version: number;
  periodStart: string;
  periodEnd: string;
  geography: 'National' | 'West Region' | 'South Region' | 'North Region';
  releasedAudiences: ('CSR' | 'Government' | 'Policy' | 'Public')[];
  narrativeSummary: string;
  sha256Hash?: string;
  syntheticDataWatermark: true;
  status: 'Draft' | 'Submitted' | 'Released' | 'Superseded' | 'Revoked';
  authorId: string;
  authorName: string;
  releasedBy?: string;
  releasedAt?: string;
}

export interface ExportRegistryEntry {
  id: string;
  packId: string;
  packTitle: string;
  version: number;
  sha256Hash: string;
  exportedByUserId: string;
  exportedByUserName: string;
  exportedAt: string;
  audience: string;
  isRevoked: boolean;
  revokedAt?: string;
  revokedReason?: string;
}
