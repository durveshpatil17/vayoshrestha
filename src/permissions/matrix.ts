/**
 * Single Source of Truth for Role-Based Access Control (RBAC) in Vayoshreshtha.
 * Codifies Section 6 of the Master Specification into a typed, machine-readable matrix.
 */

export type RoleCode = 'SA' | 'NM' | 'PM' | 'CC' | 'VF' | 'SP' | 'CT' | 'CD' | 'SC' | 'FM';

export interface RoleDefinition {
  code: RoleCode;
  name: string;
  description: string;
  scopeDescription: string;
  isStaff: boolean;
}

export const ROLES: Record<RoleCode, RoleDefinition> = {
  SA: {
    code: 'SA',
    name: 'System Administrator',
    description: 'Platform infrastructure, security policies, and technical integration oversight.',
    scopeDescription: 'Organisation-wide technical access, strictly NO clinical data access.',
    isStaff: true,
  },
  NM: {
    code: 'NM',
    name: 'NGO Management',
    description: 'Vayoh Vikas executive leadership: governance, approvals, and donor releases.',
    scopeDescription: 'Organisation-wide management oversight and maker-checker approvals.',
    isStaff: true,
  },
  PM: {
    code: 'PM',
    name: 'Programme Manager',
    description: 'Central operations lead: centres, programmes, follow-ups, and operational reporting.',
    scopeDescription: 'Organisation-wide operational management.',
    isStaff: true,
  },
  CC: {
    code: 'CC',
    name: 'Centre Coordinator',
    description: 'Ekta Hub lead managing local operations, sessions, and field volunteers.',
    scopeDescription: 'Assigned Ekta Hub(s) only. Strictly isolated from unassigned centres.',
    isStaff: true,
  },
  VF: {
    code: 'VF',
    name: 'Volunteer / Field Staff',
    description: 'Community elder outreach, assisted registrations, and daily attendance recording.',
    scopeDescription: 'Assigned Ekta Hub and assigned sessions only. Masked contact fields.',
    isStaff: true,
  },
  SP: {
    code: 'SP',
    name: 'Approved Service Partner',
    description: 'External verified provider (Clinic, Physiotherapist, Legal Aid, Optometrist).',
    scopeDescription: 'Assigned referrals only with minimal data sharing. DOB reduced to age band.',
    isStaff: false,
  },
  CT: {
    code: 'CT',
    name: 'Care Team / Human Expert',
    description: 'Geriatric social worker or nurse handling health-related triage and escalations.',
    scopeDescription: 'Assigned health escalations and support requests only.',
    isStaff: true,
  },
  CD: {
    code: 'CD',
    name: 'CSR / Donor Reviewer',
    description: 'External funding partner reviewing verified programme impact and attendance metrics.',
    scopeDescription: 'Organisation-wide aggregate reports only. Zero personal data; <5 counts suppressed.',
    isStaff: false,
  },
  SC: {
    code: 'SC',
    name: 'Senior Citizen',
    description: 'Elder beneficiary participating in Ekta Hub programmes and services.',
    scopeDescription: 'Own profile and registrations only. High-contrast large-type portal.',
    isStaff: false,
  },
  FM: {
    code: 'FM',
    name: 'Authorised Family Member',
    description: 'Relative or primary caregiver acting as proxy for linked elders.',
    scopeDescription: 'Linked elders only who have provided recorded consent. Revocable at any time.',
    isStaff: false,
  },
};

export type CapabilityCode =
  | 'SYSTEM_SETTINGS'        // 1. Users, roles, permissions, settings (FR-01–04, 50)
  | 'OWN_ACCOUNT'            // 2. Own account and security
  | 'MEMBER_PROFILES'        // 3. Member profiles (FR-05–08)
  | 'CONSENT_PREFERENCES'    // 4. Consent & preferences (FR-09, 29)
  | 'CENTRES'                // 5. Centres (FR-10–13)
  | 'PROGRAMMES'             // 6. Programmes & events (FR-14–16)
  | 'REGISTRATIONS'          // 7. Registrations, capacity, waitlist (FR-17, 18)
  | 'ATTENDANCE'             // 8. Attendance records (FR-19, 20, 22)
  | 'ATTENDANCE_CORRECTIONS' // 9. Attendance corrections (FR-21)
  | 'MESSAGE_TEMPLATES'      // 10. Message templates (FR-25–27)
  | 'ANNOUNCEMENTS'          // 11. Announcements & content (FR-27, 54)
  | 'MESSAGE_DELIVERY'       // 12. Delivery status & retry (FR-28, 55)
  | 'OPT_IN_OUT'             // 13. Opt-in / opt-out management (FR-29)
  | 'SERVICES_CATALOGUE'     // 14. Services & consultations (FR-30)
  | 'SERVICE_BOOKINGS'       // 15. Service bookings & requests (FR-31)
  | 'REFERRALS'              // 16. Referrals (FR-32, 33)
  | 'PARTNER_PROFILES'       // 17. Partner profiles & approvals (FR-34, 51)
  | 'FEEDBACK'               // 18. Feedback collection (FR-35)
  | 'FOLLOW_UPS'             // 19. Follow-ups & recommendations (FR-36–38)
  | 'HEALTH_REQUESTS'        // 20. Health requests & escalations (FR-39, 40, 42)
  | 'ESCALATION_RULES'       // 21. Escalation rules config (FR-40)
  | 'VOICE_CHECKINS'         // 22. AI voice check-ins (FR-41)
  | 'DASHBOARDS'             // 23. Dashboards (FR-43–45)
  | 'OPERATIONAL_REPORTS'    // 24. Operational reports (FR-44–47)
  | 'CSR_REPORTS'            // 25. CSR & donor reports (FR-48)
  | 'EXPORTS'                // 26. Data exports (FR-49)
  | 'AUDIT_LOGS'             // 27. Audit logs (FR-52)
  | 'COMPLAINTS'             // 28. Complaints & support requests (FR-53)
  | 'APPROVAL_QUEUE'         // 29. Content & announcement approvals (FR-54)
  | 'INTEGRATION_MONITOR'    // 30. Integration & job monitor (FR-55)
  | 'DATA_GOVERNANCE';       // 31. Data governance & privacy requests

export type ActionCode = 'create' | 'read' | 'update' | 'delete' | 'approve' | 'export';

export type CapabilityKey =
  | CapabilityCode
  | 'systemSettings'
  | 'usersAndRoles'
  | 'ownAccount'
  | 'memberProfiles'
  | 'consentPreferences'
  | 'centres'
  | 'programmes'
  | 'programmesAndEvents'
  | 'registrations'
  | 'attendance'
  | 'attendanceRecords'
  | 'attendanceCorrections'
  | 'messageTemplates'
  | 'announcements'
  | 'messageDelivery'
  | 'deliveryStatus'
  | 'optInOut'
  | 'optInOptOut'
  | 'servicesCatalogue'
  | 'serviceBookings'
  | 'referrals'
  | 'partners'
  | 'partnerProfiles'
  | 'feedback'
  | 'followUps'
  | 'healthRequests'
  | 'escalationRules'
  | 'voiceCheckins'
  | 'dashboards'
  | 'operationalReports'
  | 'csrReports'
  | 'exports'
  | 'dataExports'
  | 'auditLogs'
  | 'complaints'
  | 'approvalQueue'
  | 'approvalsQueue'
  | 'integrationMonitor'
  | 'dataGovernance';

const CAPABILITY_MAP: Record<string, CapabilityCode> = {
  systemSettings: 'SYSTEM_SETTINGS',
  usersAndRoles: 'SYSTEM_SETTINGS',
  ownAccount: 'OWN_ACCOUNT',
  memberProfiles: 'MEMBER_PROFILES',
  consentPreferences: 'CONSENT_PREFERENCES',
  centres: 'CENTRES',
  programmes: 'PROGRAMMES',
  programmesAndEvents: 'PROGRAMMES',
  registrations: 'REGISTRATIONS',
  attendance: 'ATTENDANCE',
  attendanceRecords: 'ATTENDANCE',
  attendanceCorrections: 'ATTENDANCE_CORRECTIONS',
  messageTemplates: 'MESSAGE_TEMPLATES',
  announcements: 'ANNOUNCEMENTS',
  messageDelivery: 'MESSAGE_DELIVERY',
  deliveryStatus: 'MESSAGE_DELIVERY',
  optInOut: 'OPT_IN_OUT',
  optInOptOut: 'OPT_IN_OUT',
  servicesCatalogue: 'SERVICES_CATALOGUE',
  serviceBookings: 'SERVICE_BOOKINGS',
  referrals: 'REFERRALS',
  partners: 'PARTNER_PROFILES',
  partnerProfiles: 'PARTNER_PROFILES',
  feedback: 'FEEDBACK',
  followUps: 'FOLLOW_UPS',
  healthRequests: 'HEALTH_REQUESTS',
  escalationRules: 'ESCALATION_RULES',
  voiceCheckins: 'VOICE_CHECKINS',
  dashboards: 'DASHBOARDS',
  operationalReports: 'OPERATIONAL_REPORTS',
  csrReports: 'CSR_REPORTS',
  exports: 'EXPORTS',
  dataExports: 'EXPORTS',
  auditLogs: 'AUDIT_LOGS',
  complaints: 'COMPLAINTS',
  approvalQueue: 'APPROVAL_QUEUE',
  approvalsQueue: 'APPROVAL_QUEUE',
  integrationMonitor: 'INTEGRATION_MONITOR',
  dataGovernance: 'DATA_GOVERNANCE',
};

export function normalizeCapability(cap: CapabilityCode | CapabilityKey | string): CapabilityCode {
  if (cap in CAPABILITY_MAP) {
    return CAPABILITY_MAP[cap];
  }
  return cap as CapabilityCode;
}

export type ScopeQualifier =
  | 'all'
  | 'assigned_centres'
  | 'own'
  | 'linked_only'
  | 'assigned_items'
  | 'masked'
  | 'aggregates_only'
  | 'published_only'
  | 'public_only';

export interface PermissionRule {
  allowed: boolean;
  actions: ActionCode[];
  scope: ScopeQualifier;
  requiresReason?: boolean;
  maskedFields?: string[];
  notes?: string;
}

/**
 * 10 Roles × 31 Capabilities Matrix
 * Directly mirrors Section 6.2 of the Specification.
 */
export const PERMISSION_MATRIX: Record<CapabilityCode, Record<RoleCode, PermissionRule>> = {
  SYSTEM_SETTINGS: {
    SA: { allowed: true, actions: ['create', 'read', 'update', 'delete'], scope: 'all' },
    NM: { allowed: true, actions: ['read'], scope: 'all' },
    PM: { allowed: false, actions: [], scope: 'all' },
    CC: { allowed: false, actions: [], scope: 'all' },
    VF: { allowed: false, actions: [], scope: 'all' },
    SP: { allowed: false, actions: [], scope: 'all' },
    CT: { allowed: false, actions: [], scope: 'all' },
    CD: { allowed: false, actions: [], scope: 'all' },
    SC: { allowed: false, actions: [], scope: 'all' },
    FM: { allowed: false, actions: [], scope: 'all' },
  },

  OWN_ACCOUNT: {
    SA: { allowed: true, actions: ['read', 'update'], scope: 'own' },
    NM: { allowed: true, actions: ['read', 'update'], scope: 'own' },
    PM: { allowed: true, actions: ['read', 'update'], scope: 'own' },
    CC: { allowed: true, actions: ['read', 'update'], scope: 'own' },
    VF: { allowed: true, actions: ['read', 'update'], scope: 'own' },
    SP: { allowed: true, actions: ['read', 'update'], scope: 'own' },
    CT: { allowed: true, actions: ['read', 'update'], scope: 'own' },
    CD: { allowed: true, actions: ['read', 'update'], scope: 'own' },
    SC: { allowed: true, actions: ['read', 'update'], scope: 'own' },
    FM: { allowed: true, actions: ['read', 'update'], scope: 'own' },
  },

  MEMBER_PROFILES: {
    SA: { allowed: true, actions: ['read'], scope: 'masked', maskedFields: ['phone', 'healthNotes'] },
    NM: { allowed: true, actions: ['read'], scope: 'all' },
    PM: { allowed: true, actions: ['create', 'read', 'update'], scope: 'all' },
    CC: { allowed: true, actions: ['create', 'read', 'update'], scope: 'assigned_centres' },
    VF: { allowed: true, actions: ['create', 'read', 'update'], scope: 'assigned_centres', maskedFields: ['phone'] },
    SP: { allowed: true, actions: ['read'], scope: 'assigned_items', maskedFields: ['phone', 'dob_as_age_band'] },
    CT: { allowed: true, actions: ['read'], scope: 'assigned_items' },
    CD: { allowed: false, actions: [], scope: 'aggregates_only' },
    SC: { allowed: true, actions: ['read', 'update'], scope: 'own' },
    FM: { allowed: true, actions: ['read', 'update'], scope: 'linked_only' },
  },

  CONSENT_PREFERENCES: {
    SA: { allowed: true, actions: ['read'], scope: 'all' },
    NM: { allowed: true, actions: ['read'], scope: 'all' },
    PM: { allowed: true, actions: ['read', 'update'], scope: 'all' },
    CC: { allowed: true, actions: ['read', 'update'], scope: 'assigned_centres' },
    VF: { allowed: true, actions: ['create', 'read'], scope: 'assigned_centres' },
    SP: { allowed: false, actions: [], scope: 'all' },
    CT: { allowed: false, actions: [], scope: 'all' },
    CD: { allowed: false, actions: [], scope: 'all' },
    SC: { allowed: true, actions: ['read', 'update'], scope: 'own' },
    FM: { allowed: true, actions: ['read'], scope: 'linked_only' },
  },

  CENTRES: {
    SA: { allowed: true, actions: ['create', 'read', 'update', 'delete'], scope: 'all' },
    NM: { allowed: true, actions: ['create', 'read', 'update', 'delete'], scope: 'all' },
    PM: { allowed: true, actions: ['create', 'read', 'update'], scope: 'all' },
    CC: { allowed: true, actions: ['read', 'update'], scope: 'assigned_centres' },
    VF: { allowed: true, actions: ['read'], scope: 'assigned_centres' },
    SP: { allowed: false, actions: [], scope: 'all' },
    CT: { allowed: true, actions: ['read'], scope: 'all' },
    CD: { allowed: true, actions: ['read'], scope: 'aggregates_only' },
    SC: { allowed: true, actions: ['read'], scope: 'public_only' },
    FM: { allowed: true, actions: ['read'], scope: 'public_only' },
  },

  PROGRAMMES: {
    SA: { allowed: true, actions: ['read'], scope: 'all' },
    NM: { allowed: true, actions: ['create', 'read', 'update', 'delete'], scope: 'all' },
    PM: { allowed: true, actions: ['create', 'read', 'update', 'delete'], scope: 'all' },
    CC: { allowed: true, actions: ['read', 'update'], scope: 'assigned_centres' },
    VF: { allowed: true, actions: ['read'], scope: 'assigned_centres' },
    SP: { allowed: true, actions: ['read'], scope: 'public_only' },
    CT: { allowed: true, actions: ['read'], scope: 'all' },
    CD: { allowed: true, actions: ['read'], scope: 'aggregates_only' },
    SC: { allowed: true, actions: ['read'], scope: 'published_only' },
    FM: { allowed: true, actions: ['read'], scope: 'published_only' },
  },

  REGISTRATIONS: {
    SA: { allowed: true, actions: ['read'], scope: 'all' },
    NM: { allowed: true, actions: ['read'], scope: 'all' },
    PM: { allowed: true, actions: ['create', 'read', 'update', 'delete'], scope: 'all' },
    CC: { allowed: true, actions: ['create', 'read', 'update', 'delete'], scope: 'assigned_centres' },
    VF: { allowed: true, actions: ['create', 'read', 'update'], scope: 'assigned_centres' },
    SP: { allowed: false, actions: [], scope: 'all' },
    CT: { allowed: false, actions: [], scope: 'all' },
    CD: { allowed: false, actions: [], scope: 'all' },
    SC: { allowed: true, actions: ['create', 'read', 'delete'], scope: 'own' },
    FM: { allowed: true, actions: ['create', 'read', 'delete'], scope: 'linked_only' },
  },

  ATTENDANCE: {
    SA: { allowed: true, actions: ['read'], scope: 'all' },
    NM: { allowed: true, actions: ['read'], scope: 'all' },
    PM: { allowed: true, actions: ['read'], scope: 'all' },
    CC: { allowed: true, actions: ['create', 'read', 'update'], scope: 'assigned_centres' },
    VF: { allowed: true, actions: ['create', 'read', 'update'], scope: 'assigned_centres' },
    SP: { allowed: false, actions: [], scope: 'all' },
    CT: { allowed: false, actions: [], scope: 'all' },
    CD: { allowed: false, actions: [], scope: 'all' },
    SC: { allowed: true, actions: ['read'], scope: 'own' },
    FM: { allowed: true, actions: ['read'], scope: 'linked_only' },
  },

  ATTENDANCE_CORRECTIONS: {
    SA: { allowed: true, actions: ['read'], scope: 'all' },
    NM: { allowed: true, actions: ['read'], scope: 'all' },
    PM: { allowed: true, actions: ['approve'], scope: 'all' },
    CC: { allowed: true, actions: ['approve'], scope: 'assigned_centres' },
    VF: { allowed: true, actions: ['create'], scope: 'assigned_centres' },
    SP: { allowed: false, actions: [], scope: 'all' },
    CT: { allowed: false, actions: [], scope: 'all' },
    CD: { allowed: false, actions: [], scope: 'all' },
    SC: { allowed: false, actions: [], scope: 'all' },
    FM: { allowed: false, actions: [], scope: 'all' },
  },

  MESSAGE_TEMPLATES: {
    SA: { allowed: true, actions: ['read'], scope: 'all' },
    NM: { allowed: true, actions: ['approve'], scope: 'all' },
    PM: { allowed: true, actions: ['create', 'read', 'update'], scope: 'all' },
    CC: { allowed: true, actions: ['read'], scope: 'all' },
    VF: { allowed: false, actions: [], scope: 'all' },
    SP: { allowed: false, actions: [], scope: 'all' },
    CT: { allowed: false, actions: [], scope: 'all' },
    CD: { allowed: false, actions: [], scope: 'all' },
    SC: { allowed: false, actions: [], scope: 'all' },
    FM: { allowed: false, actions: [], scope: 'all' },
  },

  ANNOUNCEMENTS: {
    SA: { allowed: true, actions: ['read'], scope: 'all' },
    NM: { allowed: true, actions: ['approve'], scope: 'all' },
    PM: { allowed: true, actions: ['create', 'read', 'update'], scope: 'all' },
    CC: { allowed: true, actions: ['create'], scope: 'assigned_centres' },
    VF: { allowed: false, actions: [], scope: 'all' },
    SP: { allowed: false, actions: [], scope: 'all' },
    CT: { allowed: false, actions: [], scope: 'all' },
    CD: { allowed: false, actions: [], scope: 'all' },
    SC: { allowed: true, actions: ['read'], scope: 'own' },
    FM: { allowed: true, actions: ['read'], scope: 'linked_only' },
  },

  MESSAGE_DELIVERY: {
    SA: { allowed: true, actions: ['read', 'update'], scope: 'all' },
    NM: { allowed: true, actions: ['read'], scope: 'all' },
    PM: { allowed: true, actions: ['read'], scope: 'all' },
    CC: { allowed: true, actions: ['read'], scope: 'assigned_centres' },
    VF: { allowed: false, actions: [], scope: 'all' },
    SP: { allowed: false, actions: [], scope: 'all' },
    CT: { allowed: false, actions: [], scope: 'all' },
    CD: { allowed: false, actions: [], scope: 'all' },
    SC: { allowed: false, actions: [], scope: 'all' },
    FM: { allowed: false, actions: [], scope: 'all' },
  },

  OPT_IN_OUT: {
    SA: { allowed: true, actions: ['read'], scope: 'all' },
    NM: { allowed: true, actions: ['read'], scope: 'all' },
    PM: { allowed: true, actions: ['update'], scope: 'all' },
    CC: { allowed: true, actions: ['update'], scope: 'assigned_centres' },
    VF: { allowed: true, actions: ['update'], scope: 'assigned_centres' },
    SP: { allowed: false, actions: [], scope: 'all' },
    CT: { allowed: false, actions: [], scope: 'all' },
    CD: { allowed: false, actions: [], scope: 'all' },
    SC: { allowed: true, actions: ['update'], scope: 'own' },
    FM: { allowed: true, actions: ['update'], scope: 'linked_only' },
  },

  SERVICES_CATALOGUE: {
    SA: { allowed: true, actions: ['read'], scope: 'all' },
    NM: { allowed: true, actions: ['create', 'read', 'update', 'delete', 'approve'], scope: 'all' },
    PM: { allowed: true, actions: ['create', 'read', 'update', 'delete'], scope: 'all' },
    CC: { allowed: true, actions: ['read'], scope: 'all' },
    VF: { allowed: true, actions: ['read'], scope: 'all' },
    SP: { allowed: true, actions: ['create', 'read', 'update'], scope: 'own' },
    CT: { allowed: true, actions: ['read'], scope: 'all' },
    CD: { allowed: false, actions: [], scope: 'all' },
    SC: { allowed: true, actions: ['read'], scope: 'public_only' },
    FM: { allowed: true, actions: ['read'], scope: 'public_only' },
  },

  SERVICE_BOOKINGS: {
    SA: { allowed: true, actions: ['read'], scope: 'all' },
    NM: { allowed: true, actions: ['read'], scope: 'all' },
    PM: { allowed: true, actions: ['read', 'update'], scope: 'all' },
    CC: { allowed: true, actions: ['create', 'read', 'update'], scope: 'assigned_centres' },
    VF: { allowed: true, actions: ['create', 'read'], scope: 'assigned_centres' },
    SP: { allowed: true, actions: ['read'], scope: 'assigned_items' },
    CT: { allowed: false, actions: [], scope: 'all' },
    CD: { allowed: false, actions: [], scope: 'all' },
    SC: { allowed: true, actions: ['create', 'read'], scope: 'own' },
    FM: { allowed: true, actions: ['create', 'read'], scope: 'linked_only' },
  },

  REFERRALS: {
    SA: { allowed: true, actions: ['read'], scope: 'all' },
    NM: { allowed: true, actions: ['read'], scope: 'all' },
    PM: { allowed: true, actions: ['create', 'read', 'update', 'delete'], scope: 'all' },
    CC: { allowed: true, actions: ['create', 'read', 'update'], scope: 'assigned_centres' },
    VF: { allowed: true, actions: ['create', 'read'], scope: 'assigned_centres' },
    SP: { allowed: true, actions: ['read', 'update'], scope: 'assigned_items' },
    CT: { allowed: true, actions: ['create', 'read'], scope: 'assigned_items' },
    CD: { allowed: true, actions: ['read'], scope: 'aggregates_only' },
    SC: { allowed: true, actions: ['read'], scope: 'own' },
    FM: { allowed: true, actions: ['read'], scope: 'linked_only' },
  },

  PARTNER_PROFILES: {
    SA: { allowed: true, actions: ['read'], scope: 'all' },
    NM: { allowed: true, actions: ['approve', 'read'], scope: 'all' },
    PM: { allowed: true, actions: ['create', 'read', 'update'], scope: 'all' },
    CC: { allowed: true, actions: ['read'], scope: 'all' },
    VF: { allowed: true, actions: ['read'], scope: 'all' },
    SP: { allowed: true, actions: ['read', 'update'], scope: 'own' },
    CT: { allowed: true, actions: ['read'], scope: 'all' },
    CD: { allowed: false, actions: [], scope: 'all' },
    SC: { allowed: false, actions: [], scope: 'all' },
    FM: { allowed: false, actions: [], scope: 'all' },
  },

  FEEDBACK: {
    SA: { allowed: false, actions: [], scope: 'all' },
    NM: { allowed: true, actions: ['read'], scope: 'all' },
    PM: { allowed: true, actions: ['read'], scope: 'all' },
    CC: { allowed: true, actions: ['read'], scope: 'assigned_centres' },
    VF: { allowed: true, actions: ['create'], scope: 'assigned_centres' },
    SP: { allowed: false, actions: [], scope: 'all' },
    CT: { allowed: false, actions: [], scope: 'all' },
    CD: { allowed: true, actions: ['read'], scope: 'aggregates_only' },
    SC: { allowed: true, actions: ['create'], scope: 'own' },
    FM: { allowed: true, actions: ['create'], scope: 'linked_only' },
  },

  FOLLOW_UPS: {
    SA: { allowed: false, actions: [], scope: 'all' },
    NM: { allowed: true, actions: ['read'], scope: 'all' },
    PM: { allowed: true, actions: ['create', 'read', 'update', 'delete'], scope: 'all' },
    CC: { allowed: true, actions: ['create', 'read', 'update', 'delete'], scope: 'assigned_centres' },
    VF: { allowed: true, actions: ['create', 'read', 'update'], scope: 'assigned_items' },
    SP: { allowed: false, actions: [], scope: 'all' },
    CT: { allowed: true, actions: ['read'], scope: 'assigned_items' },
    CD: { allowed: false, actions: [], scope: 'all' },
    SC: { allowed: true, actions: ['read'], scope: 'own' },
    FM: { allowed: true, actions: ['read'], scope: 'linked_only' },
  },

  HEALTH_REQUESTS: {
    SA: { allowed: false, actions: [], scope: 'all' },
    NM: { allowed: true, actions: ['read'], scope: 'aggregates_only' },
    PM: { allowed: true, actions: ['read'], scope: 'all' },
    CC: { allowed: true, actions: ['create', 'read', 'update'], scope: 'assigned_centres' },
    VF: { allowed: true, actions: ['create'], scope: 'assigned_centres' },
    SP: { allowed: false, actions: [], scope: 'all' },
    CT: { allowed: true, actions: ['read', 'update'], scope: 'assigned_items' },
    CD: { allowed: false, actions: [], scope: 'all' },
    SC: { allowed: true, actions: ['create'], scope: 'own' },
    FM: { allowed: true, actions: ['create'], scope: 'linked_only' },
  },

  ESCALATION_RULES: {
    SA: { allowed: true, actions: ['create', 'read', 'update'], scope: 'all' },
    NM: { allowed: true, actions: ['approve'], scope: 'all' },
    PM: { allowed: true, actions: ['read'], scope: 'all' },
    CC: { allowed: false, actions: [], scope: 'all' },
    VF: { allowed: false, actions: [], scope: 'all' },
    SP: { allowed: false, actions: [], scope: 'all' },
    CT: { allowed: true, actions: ['read'], scope: 'all' },
    CD: { allowed: false, actions: [], scope: 'all' },
    SC: { allowed: false, actions: [], scope: 'all' },
    FM: { allowed: false, actions: [], scope: 'all' },
  },

  VOICE_CHECKINS: {
    SA: { allowed: true, actions: ['update'], scope: 'all', notes: 'Feature flag toggle' },
    NM: { allowed: true, actions: ['approve'], scope: 'all' },
    PM: { allowed: true, actions: ['create', 'read', 'update'], scope: 'all' },
    CC: { allowed: true, actions: ['read'], scope: 'assigned_centres' },
    VF: { allowed: false, actions: [], scope: 'all' },
    SP: { allowed: false, actions: [], scope: 'all' },
    CT: { allowed: true, actions: ['read'], scope: 'all' },
    CD: { allowed: false, actions: [], scope: 'all' },
    SC: { allowed: true, actions: ['read'], scope: 'own' },
    FM: { allowed: false, actions: [], scope: 'all' },
  },

  DASHBOARDS: {
    SA: { allowed: true, actions: ['read'], scope: 'all' },
    NM: { allowed: true, actions: ['read'], scope: 'all' },
    PM: { allowed: true, actions: ['read'], scope: 'all' },
    CC: { allowed: true, actions: ['read'], scope: 'assigned_centres' },
    VF: { allowed: true, actions: ['read'], scope: 'assigned_items' },
    SP: { allowed: true, actions: ['read'], scope: 'assigned_items' },
    CT: { allowed: true, actions: ['read'], scope: 'assigned_items' },
    CD: { allowed: true, actions: ['read'], scope: 'aggregates_only' },
    SC: { allowed: true, actions: ['read'], scope: 'own' },
    FM: { allowed: true, actions: ['read'], scope: 'linked_only' },
  },

  OPERATIONAL_REPORTS: {
    SA: { allowed: true, actions: ['read'], scope: 'all' },
    NM: { allowed: true, actions: ['read', 'export'], scope: 'all', requiresReason: true },
    PM: { allowed: true, actions: ['read', 'export'], scope: 'all', requiresReason: true },
    CC: { allowed: true, actions: ['read', 'export'], scope: 'assigned_centres', requiresReason: true },
    VF: { allowed: false, actions: [], scope: 'all' },
    SP: { allowed: true, actions: ['read'], scope: 'assigned_items' },
    CT: { allowed: false, actions: [], scope: 'all' },
    CD: { allowed: true, actions: ['read'], scope: 'aggregates_only' },
    SC: { allowed: false, actions: [], scope: 'all' },
    FM: { allowed: false, actions: [], scope: 'all' },
  },

  CSR_REPORTS: {
    SA: { allowed: false, actions: [], scope: 'all' },
    NM: { allowed: true, actions: ['approve', 'read', 'export'], scope: 'all', requiresReason: true },
    PM: { allowed: true, actions: ['create', 'read', 'update'], scope: 'all' },
    CC: { allowed: false, actions: [], scope: 'all' },
    VF: { allowed: false, actions: [], scope: 'all' },
    SP: { allowed: false, actions: [], scope: 'all' },
    CT: { allowed: false, actions: [], scope: 'all' },
    CD: { allowed: true, actions: ['read', 'export'], scope: 'aggregates_only', requiresReason: true },
    SC: { allowed: false, actions: [], scope: 'all' },
    FM: { allowed: false, actions: [], scope: 'all' },
  },

  EXPORTS: {
    SA: { allowed: true, actions: ['export'], scope: 'all', requiresReason: true },
    NM: { allowed: true, actions: ['export'], scope: 'all', requiresReason: true },
    PM: { allowed: true, actions: ['export'], scope: 'all', requiresReason: true },
    CC: { allowed: true, actions: ['export'], scope: 'assigned_centres', requiresReason: true },
    VF: { allowed: false, actions: [], scope: 'all' },
    SP: { allowed: false, actions: [], scope: 'all' },
    CT: { allowed: false, actions: [], scope: 'all' },
    CD: { allowed: true, actions: ['export'], scope: 'aggregates_only', requiresReason: true },
    SC: { allowed: true, actions: ['export'], scope: 'own', requiresReason: false },
    FM: { allowed: false, actions: [], scope: 'all' },
  },

  AUDIT_LOGS: {
    SA: { allowed: true, actions: ['read', 'export'], scope: 'all', requiresReason: true },
    NM: { allowed: true, actions: ['read'], scope: 'aggregates_only' },
    PM: { allowed: false, actions: [], scope: 'all' },
    CC: { allowed: true, actions: ['read'], scope: 'assigned_centres', notes: 'Correction logs only' },
    VF: { allowed: false, actions: [], scope: 'all' },
    SP: { allowed: false, actions: [], scope: 'all' },
    CT: { allowed: false, actions: [], scope: 'all' },
    CD: { allowed: false, actions: [], scope: 'all' },
    SC: { allowed: false, actions: [], scope: 'all' },
    FM: { allowed: false, actions: [], scope: 'all' },
  },

  COMPLAINTS: {
    SA: { allowed: true, actions: ['read', 'update'], scope: 'all' },
    NM: { allowed: true, actions: ['read'], scope: 'all' },
    PM: { allowed: true, actions: ['read', 'update'], scope: 'all' },
    CC: { allowed: true, actions: ['read', 'update'], scope: 'assigned_centres' },
    VF: { allowed: true, actions: ['create'], scope: 'all' },
    SP: { allowed: true, actions: ['create'], scope: 'all' },
    CT: { allowed: true, actions: ['create'], scope: 'all' },
    CD: { allowed: false, actions: [], scope: 'all' },
    SC: { allowed: true, actions: ['create', 'read'], scope: 'own' },
    FM: { allowed: true, actions: ['create', 'read'], scope: 'linked_only' },
  },

  APPROVAL_QUEUE: {
    SA: { allowed: true, actions: ['read'], scope: 'all' },
    NM: { allowed: true, actions: ['approve'], scope: 'all' },
    PM: { allowed: true, actions: ['read'], scope: 'own' },
    CC: { allowed: true, actions: ['read'], scope: 'own' },
    VF: { allowed: false, actions: [], scope: 'all' },
    SP: { allowed: false, actions: [], scope: 'all' },
    CT: { allowed: false, actions: [], scope: 'all' },
    CD: { allowed: false, actions: [], scope: 'all' },
    SC: { allowed: false, actions: [], scope: 'all' },
    FM: { allowed: false, actions: [], scope: 'all' },
  },

  INTEGRATION_MONITOR: {
    SA: { allowed: true, actions: ['read', 'update'], scope: 'all' },
    NM: { allowed: true, actions: ['read'], scope: 'all' },
    PM: { allowed: true, actions: ['read'], scope: 'all' },
    CC: { allowed: false, actions: [], scope: 'all' },
    VF: { allowed: false, actions: [], scope: 'all' },
    SP: { allowed: false, actions: [], scope: 'all' },
    CT: { allowed: false, actions: [], scope: 'all' },
    CD: { allowed: false, actions: [], scope: 'all' },
    SC: { allowed: false, actions: [], scope: 'all' },
    FM: { allowed: false, actions: [], scope: 'all' },
  },

  DATA_GOVERNANCE: {
    SA: { allowed: true, actions: ['update'], scope: 'all' },
    NM: { allowed: true, actions: ['approve'], scope: 'all' },
    PM: { allowed: true, actions: ['read'], scope: 'all' },
    CC: { allowed: false, actions: [], scope: 'all' },
    VF: { allowed: false, actions: [], scope: 'all' },
    SP: { allowed: false, actions: [], scope: 'all' },
    CT: { allowed: false, actions: [], scope: 'all' },
    CD: { allowed: false, actions: [], scope: 'all' },
    SC: { allowed: true, actions: ['create'], scope: 'own' },
    FM: { allowed: true, actions: ['create'], scope: 'linked_only' },
  },
};
