/**
 * Single Source of Truth for Role-Based Access Control (RBAC) in Vayoshreshtha v2 Pilot.
 * Codifies Section 6.2 of the Master Specification into a typed, machine-readable matrix.
 */

export type RoleCode = 'SA' | 'NM' | 'RA' | 'CM' | 'VF' | 'CT' | 'CD' | 'SC' | 'NK';

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
    description: 'IT and platform administration, users, security settings, integrations, audit logs.',
    scopeDescription: 'Organisation-wide technical access. Strictly NO clinical or health-log data access.',
    isStaff: true,
  },
  NM: {
    code: 'NM',
    name: 'NGO Management',
    description: 'Vayoh Vikas executive leadership: governance, approvals, and donor releases.',
    scopeDescription: 'Organisation-wide management oversight and maker-checker approvals.',
    isStaff: true,
  },
  RA: {
    code: 'RA',
    name: 'Regional Admin',
    description: 'Regional director overseeing assigned chapters, critical SOS alerts, and escalations.',
    scopeDescription: 'Assigned region only (e.g. South, West, North).',
    isStaff: true,
  },
  CM: {
    code: 'CM',
    name: 'Chapter Manager',
    description: 'Ekta Hub centre manager: runs chapter operations, wellness check-in calls, onboarding.',
    scopeDescription: 'Assigned chapter only. Strictly isolated from unassigned chapters.',
    isStaff: true,
  },
  VF: {
    code: 'VF',
    name: 'Field Volunteer',
    description: 'Community elder outreach, assisted onboarding, assisted vitals logging, assigned calls.',
    scopeDescription: 'Assigned chapter and assigned seniors only. Masked contact fields.',
    isStaff: true,
  },
  CT: {
    code: 'CT',
    name: 'Care Team / Responder',
    description: 'Human responders for SOS events and critical health anomaly flags.',
    scopeDescription: 'Assigned cases only. Emergency contacts unmasked during open case; expires 24h post-closure.',
    isStaff: true,
  },
  CD: {
    code: 'CD',
    name: 'CSR / Donor Reviewer',
    description: 'Corporate grant reviewer, institutional donor auditor.',
    scopeDescription: 'Organisation-wide aggregate reports only. Zero personal data; counts <5 suppressed to <5.',
    isStaff: false,
  },
  SC: {
    code: 'SC',
    name: 'Senior Citizen',
    description: 'Registered elder accessing the platform via the simulated WhatsApp chat channel.',
    scopeDescription: 'Own profile and self-service interactions only.',
    isStaff: false,
  },
  NK: {
    code: 'NK',
    name: 'Next-of-Kin',
    description: 'Pre-registered family contact receiving transactional fallback SMS during data drops.',
    scopeDescription: 'No web login. Contact appears strictly as an SMS recipient.',
    isStaff: false,
  },
};

export type ActionCode = 'create' | 'read' | 'update' | 'delete' | 'approve' | 'export';

export type ScopeQualifier =
  | 'all'
  | 'own'
  | 'region'
  | 'chapter'
  | 'assigned'
  | 'masked'
  | 'aggregates_only'
  | 'open_case_only'
  | 'none';

export interface RoleCapabilityRule {
  allowed: boolean;
  actions: ActionCode[];
  scope: ScopeQualifier;
  qualifiers?: string[];
  maskedFields?: string[];
}

export type CapabilityCode =
  | 'CAP-01'
  | 'CAP-02'
  | 'CAP-03'
  | 'CAP-04'
  | 'CAP-05'
  | 'CAP-06'
  | 'CAP-07'
  | 'CAP-08'
  | 'CAP-09'
  | 'CAP-10'
  | 'CAP-11'
  | 'CAP-12'
  | 'CAP-13'
  | 'CAP-14'
  | 'CAP-15'
  | 'CAP-16'
  | 'CAP-17'
  | 'CAP-18'
  | 'CAP-19'
  | 'CAP-20'
  | 'CAP-21'
  | 'CAP-22'
  | 'CAP-23'
  | 'CAP-24'
  | 'CAP-25'
  | 'CAP-26'
  | 'CAP-27'
  | 'CAP-28';

export type CapabilityKey =
  | 'SYSTEM_SETTINGS'
  | 'OWN_ACCOUNT'
  | 'CHAPTERS_ROSTERS'
  | 'SENIOR_PROFILES'
  | 'ONBOARDING'
  | 'CONSENT_LANGUAGE'
  | 'EMERGENCY_CONTACTS'
  | 'ABHA_PROFILE'
  | 'TRIGGER_SOS'
  | 'SOS_CASES'
  | 'SOS_FALLBACK_LOG'
  | 'SOS_SETTINGS'
  | 'DRILL_MODE'
  | 'MEDICATION_SCHEDULES'
  | 'REMINDER_TEMPLATES'
  | 'MESSAGE_DELIVERY_STATUS'
  | 'MEDICATION_CONFIRMATIONS'
  | 'VITALS_LOG'
  | 'THRESHOLD_RULES'
  | 'HEALTH_FLAGS'
  | 'WELLNESS_CALLS'
  | 'DASHBOARDS'
  | 'PILOT_REPORTS'
  | 'DATA_EXPORTS'
  | 'AUDIT_LOGS'
  | 'APPROVALS_QUEUE'
  | 'ONBOARDING_SCRIPT'
  | 'INTEGRATION_MONITOR'
  | 'MEMBER_PROFILES'
  | 'ATTENDANCE'
  | 'HEALTH_REQUESTS'
  | 'usersAndRoles';

export const CAPABILITY_MAP: Record<CapabilityKey, CapabilityCode> = {
  SYSTEM_SETTINGS: 'CAP-01',
  usersAndRoles: 'CAP-01',
  OWN_ACCOUNT: 'CAP-02',
  CHAPTERS_ROSTERS: 'CAP-03',
  SENIOR_PROFILES: 'CAP-04',
  ONBOARDING: 'CAP-05',
  CONSENT_LANGUAGE: 'CAP-06',
  EMERGENCY_CONTACTS: 'CAP-07',
  ABHA_PROFILE: 'CAP-08',
  TRIGGER_SOS: 'CAP-09',
  SOS_CASES: 'CAP-10',
  SOS_FALLBACK_LOG: 'CAP-11',
  SOS_SETTINGS: 'CAP-12',
  DRILL_MODE: 'CAP-13',
  MEDICATION_SCHEDULES: 'CAP-14',
  REMINDER_TEMPLATES: 'CAP-15',
  MESSAGE_DELIVERY_STATUS: 'CAP-16',
  MEDICATION_CONFIRMATIONS: 'CAP-17',
  VITALS_LOG: 'CAP-18',
  THRESHOLD_RULES: 'CAP-19',
  HEALTH_FLAGS: 'CAP-20',
  WELLNESS_CALLS: 'CAP-21',
  DASHBOARDS: 'CAP-22',
  PILOT_REPORTS: 'CAP-23',
  DATA_EXPORTS: 'CAP-24',
  AUDIT_LOGS: 'CAP-25',
  APPROVALS_QUEUE: 'CAP-26',
  ONBOARDING_SCRIPT: 'CAP-27',
  INTEGRATION_MONITOR: 'CAP-28',
  // Backwards-compatible aliases
  MEMBER_PROFILES: 'CAP-04',
  ATTENDANCE: 'CAP-03',
  HEALTH_REQUESTS: 'CAP-20',
};

export const REVERSE_CAPABILITY_MAP: Record<CapabilityCode, CapabilityKey> = Object.entries(
  CAPABILITY_MAP
).reduce((acc, [key, code]) => {
  acc[code as CapabilityCode] = key as CapabilityKey;
  return acc;
}, {} as Record<CapabilityCode, CapabilityKey>);

const DENIED: RoleCapabilityRule = { allowed: false, actions: [], scope: 'none' };

export const PERMISSION_MATRIX: Record<CapabilityCode, Record<RoleCode, RoleCapabilityRule>> = {
  // CAP-01: Users, roles, system settings
  'CAP-01': {
    SA: { allowed: true, actions: ['create', 'read', 'update', 'delete'], scope: 'all' },
    NM: { allowed: true, actions: ['read'], scope: 'all' },
    RA: DENIED,
    CM: DENIED,
    VF: DENIED,
    CT: DENIED,
    CD: DENIED,
    SC: DENIED,
    NK: DENIED,
  },

  // CAP-02: Own account & security
  'CAP-02': {
    SA: { allowed: true, actions: ['read', 'update'], scope: 'own' },
    NM: { allowed: true, actions: ['read', 'update'], scope: 'own' },
    RA: { allowed: true, actions: ['read', 'update'], scope: 'own' },
    CM: { allowed: true, actions: ['read', 'update'], scope: 'own' },
    VF: { allowed: true, actions: ['read', 'update'], scope: 'own' },
    CT: { allowed: true, actions: ['read', 'update'], scope: 'own' },
    CD: { allowed: true, actions: ['read', 'update'], scope: 'own' },
    SC: DENIED,
    NK: DENIED,
  },

  // CAP-03: Chapters, regions, duty rosters
  'CAP-03': {
    SA: { allowed: true, actions: ['create', 'read', 'update', 'delete'], scope: 'all' },
    NM: { allowed: true, actions: ['create', 'read', 'update', 'delete'], scope: 'all' },
    RA: { allowed: true, actions: ['read', 'update'], scope: 'region', qualifiers: ['roster', 'contacts'] },
    CM: { allowed: true, actions: ['read', 'update'], scope: 'chapter', qualifiers: ['roster'] },
    VF: { allowed: true, actions: ['read'], scope: 'chapter' },
    CT: { allowed: true, actions: ['read'], scope: 'all' },
    CD: { allowed: true, actions: ['read'], scope: 'aggregates_only' },
    SC: DENIED,
    NK: DENIED,
  },

  // CAP-04: Senior profiles
  'CAP-04': {
    SA: { allowed: true, actions: ['read'], scope: 'masked' },
    NM: { allowed: true, actions: ['read'], scope: 'all' },
    RA: { allowed: true, actions: ['read', 'update'], scope: 'region' },
    CM: { allowed: true, actions: ['create', 'read', 'update'], scope: 'chapter' },
    VF: { allowed: true, actions: ['create', 'read', 'update'], scope: 'chapter', qualifiers: ['masked'] },
    CT: { allowed: true, actions: ['read'], scope: 'assigned', qualifiers: ['case-limited'] },
    CD: DENIED,
    SC: { allowed: true, actions: ['read', 'update'], scope: 'own' },
    NK: DENIED,
  },

  // CAP-05: Onboarding (funnel, sessions, assisted onboarding)
  'CAP-05': {
    SA: { allowed: true, actions: ['read'], scope: 'all' },
    NM: { allowed: true, actions: ['read'], scope: 'all' },
    RA: { allowed: true, actions: ['read'], scope: 'region' },
    CM: { allowed: true, actions: ['create', 'read', 'update'], scope: 'chapter' },
    VF: { allowed: true, actions: ['create', 'read', 'update'], scope: 'chapter' },
    CT: DENIED,
    CD: { allowed: true, actions: ['read'], scope: 'aggregates_only' },
    SC: { allowed: true, actions: ['create'], scope: 'own' },
    NK: DENIED,
  },

  // CAP-06: Consent, language, opt-out
  'CAP-06': {
    SA: { allowed: true, actions: ['read'], scope: 'all' },
    NM: { allowed: true, actions: ['read'], scope: 'all' },
    RA: { allowed: true, actions: ['read'], scope: 'region' },
    CM: { allowed: true, actions: ['read', 'update'], scope: 'chapter' },
    VF: { allowed: true, actions: ['create', 'read'], scope: 'chapter' },
    CT: DENIED,
    CD: DENIED,
    SC: { allowed: true, actions: ['read', 'update'], scope: 'own' },
    NK: DENIED,
  },

  // CAP-07: Emergency contacts (next-of-kin)
  'CAP-07': {
    SA: { allowed: true, actions: ['read'], scope: 'masked' },
    NM: { allowed: true, actions: ['read'], scope: 'all' },
    RA: { allowed: true, actions: ['read'], scope: 'region' },
    CM: { allowed: true, actions: ['create', 'read', 'update'], scope: 'chapter' },
    VF: { allowed: true, actions: ['create', 'read', 'update'], scope: 'chapter' },
    CT: { allowed: true, actions: ['read'], scope: 'open_case_only' },
    CD: DENIED,
    SC: { allowed: true, actions: ['create', 'read', 'update'], scope: 'own' },
    NK: DENIED,
  },

  // CAP-08: ABHA number, ABHA address, ABDM consent (structure only, Phase 2)
  'CAP-08': {
    SA: DENIED,
    NM: { allowed: true, actions: ['read'], scope: 'masked' },
    RA: { allowed: true, actions: ['read'], scope: 'region', qualifiers: ['masked'] },
    CM: { allowed: true, actions: ['read', 'update'], scope: 'chapter', qualifiers: ['masked'] },
    VF: { allowed: true, actions: ['create', 'update'], scope: 'chapter', qualifiers: ['masked'] },
    CT: DENIED,
    CD: DENIED,
    SC: { allowed: true, actions: ['read', 'update'], scope: 'own' },
    NK: DENIED,
  },

  // CAP-09: Trigger SOS
  'CAP-09': {
    SA: DENIED,
    NM: DENIED,
    RA: DENIED,
    CM: { allowed: true, actions: ['create'], scope: 'chapter', qualifiers: ['on_behalf'] },
    VF: { allowed: true, actions: ['create'], scope: 'chapter', qualifiers: ['on_behalf'] },
    CT: DENIED,
    CD: DENIED,
    SC: { allowed: true, actions: ['create'], scope: 'own' },
    NK: DENIED,
  },

  // CAP-10: SOS alerts and cases
  'CAP-10': {
    SA: { allowed: true, actions: ['read'], scope: 'masked', qualifiers: ['system_metadata_only'] },
    NM: { allowed: true, actions: ['read'], scope: 'all' },
    RA: { allowed: true, actions: ['read', 'update'], scope: 'region', qualifiers: ['acknowledge', 'assign', 'escalate'] },
    CM: { allowed: true, actions: ['read', 'update'], scope: 'chapter', qualifiers: ['acknowledge', 'assign'] },
    VF: { allowed: true, actions: ['read'], scope: 'own', qualifiers: ['own_raised'] },
    CT: { allowed: true, actions: ['read', 'update'], scope: 'assigned', qualifiers: ['respond', 'resolve'] },
    CD: { allowed: true, actions: ['read'], scope: 'aggregates_only' },
    SC: { allowed: true, actions: ['read'], scope: 'own', qualifiers: ['status_only'] },
    NK: DENIED,
  },

  // CAP-11: SOS escalation chain & SMS fallback log
  'CAP-11': {
    SA: { allowed: true, actions: ['read', 'update'], scope: 'all', qualifiers: ['retry'] },
    NM: { allowed: true, actions: ['read'], scope: 'all' },
    RA: { allowed: true, actions: ['read'], scope: 'region' },
    CM: { allowed: true, actions: ['read'], scope: 'chapter' },
    VF: DENIED,
    CT: { allowed: true, actions: ['read'], scope: 'assigned' },
    CD: DENIED,
    SC: DENIED,
    NK: DENIED,
  },

  // CAP-12: SOS settings (SLA, escalation chain, fallback behaviour, SMS wording)
  'CAP-12': {
    SA: { allowed: true, actions: ['read'], scope: 'all' },
    NM: { allowed: true, actions: ['approve'], scope: 'all' },
    RA: { allowed: true, actions: ['create', 'read', 'update'], scope: 'region', qualifiers: ['submit'] },
    CM: { allowed: true, actions: ['read'], scope: 'chapter' },
    VF: DENIED,
    CT: { allowed: true, actions: ['read'], scope: 'all' },
    CD: DENIED,
    SC: DENIED,
    NK: DENIED,
  },

  // CAP-13: Drill mode events
  'CAP-13': {
    SA: { allowed: true, actions: ['read'], scope: 'all' },
    NM: { allowed: true, actions: ['create', 'read', 'update'], scope: 'all' },
    RA: { allowed: true, actions: ['create', 'read', 'update'], scope: 'region' },
    CM: { allowed: true, actions: ['create', 'read', 'update'], scope: 'chapter' },
    VF: DENIED,
    CT: { allowed: true, actions: ['read'], scope: 'all' },
    CD: DENIED,
    SC: DENIED,
    NK: DENIED,
  },

  // CAP-14: Medication schedules (label + time)
  'CAP-14': {
    SA: DENIED,
    NM: { allowed: true, actions: ['read'], scope: 'aggregates_only' },
    RA: { allowed: true, actions: ['read'], scope: 'region' },
    CM: { allowed: true, actions: ['create', 'read', 'update'], scope: 'chapter' },
    VF: { allowed: true, actions: ['create', 'read', 'update'], scope: 'assigned' },
    CT: { allowed: true, actions: ['read'], scope: 'assigned' },
    CD: DENIED,
    SC: { allowed: true, actions: ['read', 'update'], scope: 'own', qualifiers: ['preferred_time'] },
    NK: DENIED,
  },

  // CAP-15: Reminder templates (per language)
  'CAP-15': {
    SA: { allowed: true, actions: ['read'], scope: 'all' },
    NM: { allowed: true, actions: ['approve'], scope: 'all' },
    RA: { allowed: true, actions: ['create', 'read', 'update'], scope: 'all', qualifiers: ['submit'] },
    CM: { allowed: true, actions: ['read'], scope: 'chapter' },
    VF: DENIED,
    CT: { allowed: true, actions: ['read'], scope: 'all' },
    CD: DENIED,
    SC: DENIED,
    NK: DENIED,
  },

  // CAP-16: Reminder & message delivery status
  'CAP-16': {
    SA: { allowed: true, actions: ['read', 'update'], scope: 'all', qualifiers: ['retry'] },
    NM: { allowed: true, actions: ['read'], scope: 'all' },
    RA: { allowed: true, actions: ['read'], scope: 'region' },
    CM: { allowed: true, actions: ['read'], scope: 'chapter' },
    VF: DENIED,
    CT: DENIED,
    CD: { allowed: true, actions: ['read'], scope: 'aggregates_only' },
    SC: DENIED,
    NK: DENIED,
  },

  // CAP-17: Medication confirmations (adherence log)
  'CAP-17': {
    SA: DENIED,
    NM: { allowed: true, actions: ['read'], scope: 'aggregates_only' },
    RA: { allowed: true, actions: ['read'], scope: 'region' },
    CM: { allowed: true, actions: ['read'], scope: 'chapter' },
    VF: { allowed: true, actions: ['read'], scope: 'assigned' },
    CT: { allowed: true, actions: ['read'], scope: 'assigned' },
    CD: { allowed: true, actions: ['read'], scope: 'aggregates_only' },
    SC: { allowed: true, actions: ['create', 'read'], scope: 'own' },
    NK: DENIED,
  },

  // CAP-18: Vitals log (BP, glucose)
  'CAP-18': {
    SA: DENIED,
    NM: { allowed: true, actions: ['read'], scope: 'aggregates_only' },
    RA: { allowed: true, actions: ['read'], scope: 'region' },
    CM: { allowed: true, actions: ['read'], scope: 'chapter' },
    VF: { allowed: true, actions: ['create', 'read'], scope: 'assigned', qualifiers: ['assisted'] },
    CT: { allowed: true, actions: ['read'], scope: 'assigned', qualifiers: ['flagged'] },
    CD: { allowed: true, actions: ['read'], scope: 'aggregates_only' },
    SC: { allowed: true, actions: ['create', 'read'], scope: 'own' },
    NK: DENIED,
  },

  // CAP-19: Threshold rules (risk bands)
  'CAP-19': {
    SA: { allowed: true, actions: ['read'], scope: 'all' },
    NM: { allowed: true, actions: ['approve'], scope: 'all' },
    RA: { allowed: true, actions: ['read'], scope: 'all' },
    CM: { allowed: true, actions: ['read'], scope: 'all' },
    VF: DENIED,
    CT: { allowed: true, actions: ['create', 'read', 'update'], scope: 'all', qualifiers: ['propose'] },
    CD: DENIED,
    SC: DENIED,
    NK: DENIED,
  },

  // CAP-20: Health flags / anomaly queue
  'CAP-20': {
    SA: DENIED,
    NM: { allowed: true, actions: ['read'], scope: 'aggregates_only' },
    RA: { allowed: true, actions: ['read'], scope: 'region' },
    CM: { allowed: true, actions: ['read', 'update'], scope: 'chapter', qualifiers: ['assign', 'close'] },
    VF: { allowed: true, actions: ['read'], scope: 'assigned' },
    CT: { allowed: true, actions: ['read', 'update'], scope: 'assigned' },
    CD: { allowed: true, actions: ['read'], scope: 'aggregates_only' },
    SC: DENIED,
    NK: DENIED,
  },

  // CAP-21: Wellness check-in calls (tasks and outcomes)
  'CAP-21': {
    SA: DENIED,
    NM: { allowed: true, actions: ['read'], scope: 'aggregates_only' },
    RA: { allowed: true, actions: ['read'], scope: 'region' },
    CM: { allowed: true, actions: ['create', 'read', 'update'], scope: 'chapter' },
    VF: { allowed: true, actions: ['create', 'read', 'update'], scope: 'assigned' },
    CT: { allowed: true, actions: ['create', 'read', 'update'], scope: 'assigned' },
    CD: DENIED,
    SC: DENIED,
    NK: DENIED,
  },

  // CAP-22: Dashboards
  'CAP-22': {
    SA: { allowed: true, actions: ['read'], scope: 'all', qualifiers: ['system'] },
    NM: { allowed: true, actions: ['read'], scope: 'all' },
    RA: { allowed: true, actions: ['read'], scope: 'region' },
    CM: { allowed: true, actions: ['read'], scope: 'chapter' },
    VF: { allowed: true, actions: ['read'], scope: 'assigned', qualifiers: ['my_tasks'] },
    CT: { allowed: true, actions: ['read'], scope: 'assigned', qualifiers: ['caseload'] },
    CD: { allowed: true, actions: ['read'], scope: 'aggregates_only' },
    SC: DENIED,
    NK: DENIED,
  },

  // CAP-23: Pilot outcome reports
  'CAP-23': {
    SA: { allowed: true, actions: ['read'], scope: 'all', qualifiers: ['system'] },
    NM: { allowed: true, actions: ['read', 'export'], scope: 'all' },
    RA: { allowed: true, actions: ['read', 'export'], scope: 'region' },
    CM: { allowed: true, actions: ['read', 'export'], scope: 'chapter', qualifiers: ['no_pii'] },
    VF: DENIED,
    CT: DENIED,
    CD: { allowed: true, actions: ['read'], scope: 'aggregates_only' },
    SC: DENIED,
    NK: DENIED,
  },

  // CAP-24: Data exports (any)
  'CAP-24': {
    SA: { allowed: true, actions: ['export'], scope: 'all', qualifiers: ['audit_system'] },
    NM: { allowed: true, actions: ['export'], scope: 'all' },
    RA: { allowed: true, actions: ['export'], scope: 'region' },
    CM: { allowed: true, actions: ['export'], scope: 'chapter' },
    VF: DENIED,
    CT: DENIED,
    CD: { allowed: true, actions: ['export'], scope: 'aggregates_only', qualifiers: ['pilot_summary'] },
    SC: { allowed: true, actions: ['export'], scope: 'own', qualifiers: ['my_data'] },
    NK: DENIED,
  },

  // CAP-25: Audit logs
  'CAP-25': {
    SA: { allowed: true, actions: ['read', 'export'], scope: 'all' },
    NM: { allowed: true, actions: ['read'], scope: 'all', qualifiers: ['summary'] },
    RA: { allowed: true, actions: ['read'], scope: 'region', qualifiers: ['sos_and_access'] },
    CM: DENIED,
    VF: DENIED,
    CT: DENIED,
    CD: DENIED,
    SC: DENIED,
    NK: DENIED,
  },

  // CAP-26: Approvals queue
  'CAP-26': {
    SA: { allowed: true, actions: ['read'], scope: 'all' },
    NM: { allowed: true, actions: ['approve'], scope: 'all' },
    RA: { allowed: true, actions: ['read'], scope: 'own' },
    CM: { allowed: true, actions: ['read'], scope: 'own' },
    VF: DENIED,
    CT: { allowed: true, actions: ['read'], scope: 'own' },
    CD: DENIED,
    SC: DENIED,
    NK: DENIED,
  },

  // CAP-27: Onboarding script (WhatsApp flow)
  'CAP-27': {
    SA: { allowed: true, actions: ['read'], scope: 'all' },
    NM: { allowed: true, actions: ['approve'], scope: 'all' },
    RA: { allowed: true, actions: ['create', 'read', 'update'], scope: 'all', qualifiers: ['submit'] },
    CM: { allowed: true, actions: ['read'], scope: 'chapter' },
    VF: { allowed: true, actions: ['read'], scope: 'chapter' },
    CT: DENIED,
    CD: DENIED,
    SC: DENIED,
    NK: DENIED,
  },

  // CAP-28: Integration & queue monitor
  'CAP-28': {
    SA: { allowed: true, actions: ['read', 'update'], scope: 'all' },
    NM: { allowed: true, actions: ['read'], scope: 'all' },
    RA: { allowed: true, actions: ['read'], scope: 'region' },
    CM: DENIED,
    VF: DENIED,
    CT: DENIED,
    CD: DENIED,
    SC: DENIED,
    NK: DENIED,
  },
};

/**
 * Normalizes either a CAP-XX code or named key into a CapabilityCode.
 */
export function normalizeCapability(cap: CapabilityCode | CapabilityKey): CapabilityCode {
  if (cap.startsWith('CAP-')) {
    return cap as CapabilityCode;
  }
  return CAPABILITY_MAP[cap as CapabilityKey] || ('CAP-01' as CapabilityCode);
}
