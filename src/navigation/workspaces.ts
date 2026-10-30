import { RoleCode } from '@/permissions/matrix';
import {
  AlertTriangle,
  Shield,
  Smartphone,
  Settings,
  HeartPulse,
  HeartHandshake,
  Activity,
  Calendar,
  Sliders,
  UserPlus,
  Users,
  ClipboardList,
  FileCheck2,
  CheckSquare,
  MessageSquare,
  ThumbsUp,
  Clock,
  Building2,
  BookOpen,
  Radio,
  Award,
  BarChart3,
  Send,
  FileText,
  Share2,
  Ticket,
  Scale,
  Layers,
  RefreshCw,
  FileSpreadsheet,
  HelpCircle,
  LucideIcon,
} from 'lucide-react';

export type WorkspaceId =
  | 'emergency'
  | 'care'
  | 'seniors'
  | 'community'
  | 'learning'
  | 'messaging'
  | 'partners'
  | 'field-network'
  | 'insights'
  | 'governance'
  | 'administration';

export type AppGroup = 'work' | 'monitor' | 'configure';

export interface WorkspaceApp {
  id: string;
  name: string; // Noun
  path: string;
  icon: LucideIcon;
  group: AppGroup;
  description: string;
  requiredRoles?: RoleCode[];
  isConfigure?: boolean;
}

export interface WorkspaceDefinition {
  id: WorkspaceId;
  name: string;
  purpose: string;
  icon: LucideIcon;
  apps: WorkspaceApp[];
}

export const WORKSPACES: Record<WorkspaceId, WorkspaceDefinition> = {
  emergency: {
    id: 'emergency',
    name: 'Emergency',
    purpose: 'Life-safety triage, escalation & emergency fallback',
    icon: AlertTriangle,
    apps: [
      {
        id: 'sos-live',
        name: 'Live board',
        path: '/sos',
        icon: AlertTriangle,
        group: 'work',
        description: 'Real-time emergency triage board and SLA response tracking',
      },
      {
        id: 'sos-cases',
        name: 'Cases',
        path: '/sos/cases',
        icon: Shield,
        group: 'work',
        description: 'Historical emergency cases, drill records and audit histories',
      },
      {
        id: 'sos-drills',
        name: 'Drills',
        path: '/sos/drills',
        icon: Radio,
        group: 'work',
        description: 'Simulated disaster readiness drills and volunteer response tests',
      },
      {
        id: 'sms-log',
        name: 'Fallback SMS log',
        path: '/sms-log',
        icon: Smartphone,
        group: 'monitor',
        description: 'Cellular SMS outbox records when WhatsApp connectivity drops',
      },
      {
        id: 'sos-settings',
        name: 'Emergency settings',
        path: '/sos/settings',
        icon: Settings,
        group: 'configure',
        isConfigure: true,
        requiredRoles: ['SA', 'NM', 'RA'],
        description: 'Escalation tiers, broadcast channels and auto-escalation timeouts',
      },
    ],
  },

  care: {
    id: 'care',
    name: 'Care',
    purpose: 'Preventive health routines, biomarkers & escalations',
    icon: HeartPulse,
    apps: [
      {
        id: 'care-queue',
        name: 'Care queue',
        path: '/health/queue',
        icon: HeartPulse,
        group: 'work',
        description: 'Triage queue for abnormal biomarker flags, wellness calls and adherence logs',
      },
      {
        id: 'support-queue',
        name: 'Support & escalations',
        path: '/support/queue',
        icon: HeartHandshake,
        group: 'work',
        description: 'Elder support tickets, shift handovers and clinical escalation cases',
      },
      {
        id: 'care-overview',
        name: 'Care overview',
        path: '/health',
        icon: Activity,
        group: 'monitor',
        description: 'Biomarker threshold trends, 7-day vitals charts and chapter performance',
      },
      {
        id: 'schedules-hub',
        name: 'Schedules & reminders',
        path: '/health/schedules-hub',
        icon: Calendar,
        group: 'configure',
        isConfigure: true,
        requiredRoles: ['SA', 'NM', 'RA', 'CM'],
        description: 'Personalized medication regimens and automated WhatsApp check-in templates',
      },
      {
        id: 'care-rules',
        name: 'Care rules',
        path: '/health/rules-hub',
        icon: Sliders,
        group: 'configure',
        isConfigure: true,
        requiredRoles: ['SA', 'NM', 'RA'],
        description: 'Blood pressure and glucose risk bands, hypertensive crisis thresholds',
      },
    ],
  },

  seniors: {
    id: 'seniors',
    name: 'Seniors',
    purpose: 'Civic registry, assisted onboarding & member profiles',
    icon: Users,
    apps: [
      {
        id: 'onboarding',
        name: 'Onboarding',
        path: '/onboarding',
        icon: UserPlus,
        group: 'work',
        description: 'Assisted registration funnel, stalled applications and interactive script',
      },
      {
        id: 'directory',
        name: 'Directory',
        path: '/seniors',
        icon: Users,
        group: 'work',
        description: 'Elder directory, ABHA validation, emergency contacts and ID card export',
      },
      {
        id: 'duplicates',
        name: 'Duplicate review',
        path: '/seniors/duplicates',
        icon: ClipboardList,
        group: 'work',
        description: 'Side-by-side duplicate candidate comparison and resolution queue',
      },
      {
        id: 'consents',
        name: 'Consent & preferences',
        path: '/communication/consents',
        icon: FileCheck2,
        group: 'monitor',
        description: 'DPDP consent records, communication language preferences and opt-outs',
      },
    ],
  },

  community: {
    id: 'community',
    name: 'Community',
    purpose: 'Ekta Hubs, structured sessions & attendance',
    icon: Building2,
    apps: [
      {
        id: 'programmes',
        name: 'Programmes',
        path: '/programmes',
        icon: Calendar,
        group: 'work',
        description: 'Yoga, digital literacy, physiotherapy and community programmes catalogue',
      },
      {
        id: 'attendance',
        name: 'Attendance',
        path: '/attendance',
        icon: CheckSquare,
        group: 'work',
        description: 'Live session presence marking, 2h sheet locking and correction requests',
      },
      {
        id: 'follow-ups',
        name: 'Follow-ups & engagement',
        path: '/feedback/follow-ups',
        icon: MessageSquare,
        group: 'work',
        description: 'Outreach tasks for disengaged elders and chapter engagement score index',
      },
      {
        id: 'feedback',
        name: 'Feedback',
        path: '/feedback',
        icon: ThumbsUp,
        group: 'work',
        description: 'Elder satisfaction surveys, session ratings and quality suggestions',
      },
      {
        id: 'schedule',
        name: 'Schedule calendar',
        path: '/schedule',
        icon: Clock,
        group: 'monitor',
        description: 'Cross-chapter monthly calendar of upcoming events and volunteer rosters',
      },
      {
        id: 'chapters',
        name: 'Chapters (Ekta Hubs)',
        path: '/chapters',
        icon: Building2,
        group: 'monitor',
        description: 'Physical Ekta Hub locations, geofences, facility specs and staff rosters',
      },
    ],
  },

  learning: {
    id: 'learning',
    name: 'Learning',
    purpose: 'Micro-lessons, webinars & gamified quizzes',
    icon: BookOpen,
    apps: [
      {
        id: 'library',
        name: 'Library',
        path: '/learning/library',
        icon: BookOpen,
        group: 'work',
        description: '4-domain elder curriculum: digital payments, cyber safety, nutrition & rights',
      },
      {
        id: 'daily-series',
        name: 'Daily series',
        path: '/learning/series',
        icon: Radio,
        group: 'work',
        description: 'WhatsApp drip campaigns with strict 21:00-08:00 quiet hours enforcement',
      },
      {
        id: 'webinars',
        name: 'Webinars & events',
        path: '/learning/webinars',
        icon: Calendar,
        group: 'work',
        description: 'Virtual geriatric physician webinars, legal literacy talks and community channels',
      },
      {
        id: 'quizzes',
        name: 'Quizzes & channels',
        path: '/learning/quizzes',
        icon: Award,
        group: 'work',
        description: 'Weekly Mastermind quiz rounds and anonymous chapter competitive leaderboards',
      },
      {
        id: 'learning-overview',
        name: 'Learning overview',
        path: '/learning',
        icon: BarChart3,
        group: 'monitor',
        description: 'Curriculum reach metrics, lesson completion rates and topic engagement',
      },
    ],
  },

  messaging: {
    id: 'messaging',
    name: 'Messaging',
    purpose: 'Multi-lingual WhatsApp advisories & delivery logs',
    icon: Send,
    apps: [
      {
        id: 'announcements',
        name: 'Announcements',
        path: '/communication/announcements',
        icon: Send,
        group: 'work',
        description: 'Broadcast community notices, weather alerts and emergency advisories',
      },
      {
        id: 'delivery-log',
        name: 'Delivery log',
        path: '/communication/delivery',
        icon: FileText,
        group: 'work',
        description: 'Real-time WhatsApp transmission tracking, read receipts and failure retries',
      },
      {
        id: 'simulator',
        name: 'Phone simulator',
        path: '/simulator',
        icon: Smartphone,
        group: 'work',
        description: '3-pane virtual WhatsApp mobile device for interactive testing and demos',
      },
      {
        id: 'messaging-overview',
        name: 'Messaging overview',
        path: '/communication',
        icon: BarChart3,
        group: 'monitor',
        description: 'Broadcast volume, opt-out rates and regional language distribution',
      },
      {
        id: 'templates',
        name: 'Templates',
        path: '/communication/templates',
        icon: FileCheck2,
        group: 'configure',
        isConfigure: true,
        requiredRoles: ['SA', 'NM', 'PM', 'CM'],
        description: 'Approved message templates with dynamic variable chips and maker-checker sign-off',
      },
    ],
  },

  partners: {
    id: 'partners',
    name: 'Partners',
    purpose: 'Deterministic service routing & digital vouchers',
    icon: Share2,
    apps: [
      {
        id: 'routing',
        name: 'Routing',
        path: '/routing',
        icon: Share2,
        group: 'work',
        description: 'Deterministic intake queue, decision records and partner capacity heatmaps',
      },
      {
        id: 'referrals',
        name: 'Referrals',
        path: '/referrals',
        icon: Ticket,
        group: 'work',
        description: 'Active partner referrals pipeline, clinical triage handoffs and SLA monitors',
      },
      {
        id: 'vouchers',
        name: 'Vouchers',
        path: '/vouchers',
        icon: Award,
        group: 'work',
        description: 'Crockford Base-32 Modulo-37 voucher campaigns, issuance and redemption logs',
      },
      {
        id: 'legal-intake',
        name: 'Legal intake',
        path: '/legal-intake',
        icon: Scale,
        group: 'work',
        description: 'Pro-bono elder consultation queue with DPDP-aligned access isolation',
      },
      {
        id: 'directory',
        name: 'Partner directory',
        path: '/partners',
        icon: Building2,
        group: 'monitor',
        description: 'Accredited healthcare, diagnostic, nutrition and legal aid partner directory',
      },
      {
        id: 'services',
        name: 'Services catalogue',
        path: '/services',
        icon: Layers,
        group: 'configure',
        isConfigure: true,
        requiredRoles: ['SA', 'NM', 'PM', 'RA'],
        description: 'Service specifications, eligibility criteria, subsidy tiers and price limits',
      },
      {
        id: 'routing-rules',
        name: 'Routing rules',
        path: '/routing/rules',
        icon: Sliders,
        group: 'configure',
        isConfigure: true,
        requiredRoles: ['SA', 'NM', 'PM'],
        description: 'Capacity-aware provider matching policies and interactive rule evaluation tool',
      },
    ],
  },

  'field-network': {
    id: 'field-network',
    name: 'Field network',
    purpose: 'Last-mile associate roster, offline logs & sync supervision',
    icon: RefreshCw,
    apps: [
      {
        id: 'associates',
        name: 'Associates',
        path: '/field-network/associates',
        icon: Users,
        group: 'work',
        description: 'Senior field associate directory, assigned ward geographies and training status',
      },
      {
        id: 'activity',
        name: 'Activity stream',
        path: '/field-network/activity',
        icon: Activity,
        group: 'work',
        description: 'Live field registration feed with consent-gated coarse 2-decimal geo-tags',
      },
      {
        id: 'operations',
        name: 'Field operations',
        path: '/field-network',
        icon: Radio,
        group: 'monitor',
        description: 'Live operational telemetry card, active gigs, and 9-chapter sync progress bars',
      },
      {
        id: 'sync-monitor',
        name: 'Sync monitor',
        path: '/field-network/sync',
        icon: RefreshCw,
        group: 'monitor',
        description: 'Offline queue synchronization health, network drop alerts and late-sync warnings',
      },
    ],
  },

  insights: {
    id: 'insights',
    name: 'Insights',
    purpose: 'Pilot scorecards, DPDP cohort telemetry & impact packs',
    icon: BarChart3,
    apps: [
      {
        id: 'impact-packs',
        name: 'Impact packs',
        path: '/telemetry/packs',
        icon: FileSpreadsheet,
        group: 'work',
        description: 'Audited outcome packs, tamper-evident SHA-256 PDF generator and export registry',
      },
      {
        id: 'pilot-scorecard',
        name: 'Pilot scorecard',
        path: '/reports/pilot',
        icon: Award,
        group: 'monitor',
        description: '90-day pilot execution indicators, SLA performance and funder milestone tracks',
      },
      {
        id: 'operational-reports',
        name: 'Operational reports',
        path: '/reports',
        icon: BarChart3,
        group: 'monitor',
        description: 'Chapter comparative tables, attendance rates, vitals anomalies and CSV exports',
      },
      {
        id: 'live-telemetry',
        name: 'Live telemetry',
        path: '/telemetry',
        icon: Activity,
        group: 'monitor',
        description: 'DPDP cohort analytics with k>=5 cell suppression and differencing attack defense',
      },
      {
        id: 'definitions',
        name: 'Definitions',
        path: '/reports/definitions',
        icon: FileText,
        group: 'configure',
        isConfigure: true,
        requiredRoles: ['SA', 'NM', 'RA', 'PM'],
        description: 'Mathematical indicator definitions, numerator/denominator formulas and targets',
      },
    ],
  },

  governance: {
    id: 'governance',
    name: 'Governance',
    purpose: 'Maker-checker approvals, DPDP requests & audit logs',
    icon: Shield,
    apps: [
      {
        id: 'approvals',
        name: 'Approvals',
        path: '/admin/approvals',
        icon: CheckSquare,
        group: 'work',
        description: 'Dual-control maker-checker review queue for templates, rules and safety policies',
      },
      {
        id: 'complaints',
        name: 'Complaints',
        path: '/admin/complaints',
        icon: HelpCircle,
        group: 'work',
        description: 'Citizen, volunteer and staff grievance records with resolution audit threads',
      },
      {
        id: 'data-governance',
        name: 'Data requests',
        path: '/admin/data-governance',
        icon: Shield,
        group: 'work',
        description: 'DPDP statutory data subject access requests, correction orders and purge workflows',
      },
      {
        id: 'audit-logs',
        name: 'Audit logs',
        path: '/admin/audit-logs',
        icon: FileText,
        group: 'monitor',
        requiredRoles: ['SA', 'NM', 'RA'],
        description: 'Immutable, cryptographically hashed event stream of administrative actions',
      },
      {
        id: 'privacy',
        name: 'Privacy notices',
        path: '/privacy',
        icon: BookOpen,
        group: 'configure',
        isConfigure: true,
        requiredRoles: ['SA', 'NM'],
        description: 'Statutory privacy notice texts, consent disclosures and retention schedules',
      },
    ],
  },

  administration: {
    id: 'administration',
    name: 'Administration',
    purpose: 'User roles, chapter rosters, queues & ecosystem nexus',
    icon: Settings,
    apps: [
      {
        id: 'users',
        name: 'Users',
        path: '/admin/users',
        icon: Users,
        group: 'work',
        requiredRoles: ['SA'],
        description: 'Staff account directory, identity invitations, MFA resets and scope assignments',
      },
      {
        id: 'chapters-rosters',
        name: 'Chapters & rosters',
        path: '/admin/chapters',
        icon: Building2,
        group: 'work',
        requiredRoles: ['SA', 'NM', 'RA'],
        description: 'Chapter operating hours, venue specifications and staff on-call rosters',
      },
      {
        id: 'integrations',
        name: 'Integrations & queues',
        path: '/admin/integrations',
        icon: Radio,
        group: 'monitor',
        requiredRoles: ['SA'],
        description: 'WhatsApp Cloud API health, SMS gateway status and offline sync retry queues',
      },
      {
        id: 'ecosystem',
        name: 'Ecosystem map',
        path: '/ecosystem',
        icon: Layers,
        group: 'monitor',
        requiredRoles: ['SA', 'NM', 'PM', 'RA', 'CD'],
        description: 'Interactive strategic nexus diagram mapping Layers 1 through 4 live metrics',
      },
      {
        id: 'roles',
        name: 'Roles & permissions',
        path: '/admin/roles',
        icon: Shield,
        group: 'configure',
        isConfigure: true,
        requiredRoles: ['SA'],
        description: 'Five-layer RBAC permission matrix explorer and capability rule inspector',
      },
      {
        id: 'settings',
        name: 'System settings',
        path: '/admin/settings',
        icon: Settings,
        group: 'configure',
        isConfigure: true,
        requiredRoles: ['SA', 'NM'],
        description: 'Global system flags, pilot readiness checklist and demo data generator',
      },
      {
        id: 'design',
        name: 'Design gallery',
        path: '/design',
        icon: Layers,
        group: 'configure',
        isConfigure: true,
        requiredRoles: ['SA'],
        description: 'SAP Fiori Horizon + AWS Cloudscape token showcase and component catalog',
      },
    ],
  },
};

/**
 * Role to Workspaces Matrix (from docs/IA.md Section 4 & Section A5)
 */
export const ROLE_WORKSPACES: Record<RoleCode, { primary: WorkspaceId[]; secondary: WorkspaceId[] }> = {
  NM: {
    primary: ['insights', 'governance', 'emergency', 'partners', 'field-network'],
    secondary: ['seniors', 'community', 'learning', 'messaging', 'care', 'administration'],
  },
  PM: {
    primary: ['community', 'seniors', 'partners', 'learning', 'insights'],
    secondary: ['messaging', 'care', 'field-network', 'emergency', 'governance'],
  },
  RA: {
    primary: ['emergency', 'care', 'seniors', 'community', 'insights'],
    secondary: ['field-network', 'governance'],
  },
  CM: {
    primary: ['emergency', 'care', 'seniors', 'community', 'messaging'],
    secondary: ['insights', 'field-network', 'governance'],
  },
  VF: {
    primary: ['seniors', 'care', 'community'],
    secondary: [],
  },
  CT: {
    primary: ['emergency', 'care'],
    secondary: [],
  },
  SA: {
    primary: ['administration', 'governance', 'messaging', 'insights'],
    secondary: ['emergency'],
  },
  CD: {
    primary: ['insights', 'administration'],
    secondary: [],
  },
  SF: {
    primary: ['field-network'],
    secondary: [],
  },
  SP: {
    primary: ['partners'],
    secondary: [],
  },
  SC: {
    primary: ['care', 'community', 'learning'],
    secondary: [],
  },
  FM: {
    primary: ['care'],
    secondary: [],
  },
  NK: {
    primary: ['care'],
    secondary: [],
  },
};

/**
 * Returns all permitted workspaces for a given role (primary + secondary)
 */
export function getPermittedWorkspaces(role: RoleCode): WorkspaceDefinition[] {
  const mapping = ROLE_WORKSPACES[role];
  if (!mapping) return [];
  const allIds = [...mapping.primary, ...mapping.secondary];
  return allIds.map((id) => WORKSPACES[id]).filter(Boolean);
}

/**
 * Returns primary workspaces (top <= 5 inline tabs in shell bar)
 */
export function getPrimaryWorkspaces(role: RoleCode): WorkspaceDefinition[] {
  const mapping = ROLE_WORKSPACES[role];
  if (!mapping) return [];
  return mapping.primary.slice(0, 5).map((id) => WORKSPACES[id]).filter(Boolean);
}

/**
 * Detects workspace matching current URL path
 */
export function findWorkspaceForPath(pathname: string): WorkspaceId | null {
  if (pathname.startsWith('/w/')) {
    const candidate = pathname.split('/')[2] as WorkspaceId;
    if (candidate && WORKSPACES[candidate]) return candidate;
  }

  // Exact or sub-path match against registered apps
  for (const [wsId, ws] of Object.entries(WORKSPACES)) {
    for (const app of ws.apps) {
      if (pathname === app.path || (app.path !== '/' && (pathname.startsWith(app.path + '/') || pathname.startsWith(app.path + '?')))) {
        return wsId as WorkspaceId;
      }
    }
  }

  if (pathname.startsWith('/sos') || pathname.startsWith('/sms-log')) return 'emergency';
  if (pathname.startsWith('/health') || pathname.startsWith('/support')) return 'care';
  if (pathname.startsWith('/seniors') || pathname.startsWith('/onboarding')) return 'seniors';
  if (
    pathname.startsWith('/programmes') ||
    pathname.startsWith('/attendance') ||
    pathname.startsWith('/schedule') ||
    pathname.startsWith('/chapters') ||
    pathname.startsWith('/feedback')
  ) {
    return 'community';
  }
  if (pathname.startsWith('/learning')) return 'learning';
  if (pathname.startsWith('/communication') || pathname.startsWith('/simulator')) return 'messaging';
  if (
    pathname.startsWith('/routing') ||
    pathname.startsWith('/referrals') ||
    pathname.startsWith('/vouchers') ||
    pathname.startsWith('/legal-intake') ||
    pathname.startsWith('/partners') ||
    pathname.startsWith('/services')
  ) {
    return 'partners';
  }
  if (pathname.startsWith('/field-network')) return 'field-network';
  if (pathname.startsWith('/reports') || pathname.startsWith('/telemetry')) return 'insights';
  if (
    pathname.startsWith('/admin/approvals') ||
    pathname.startsWith('/admin/complaints') ||
    pathname.startsWith('/admin/data-governance') ||
    pathname.startsWith('/admin/audit-logs') ||
    pathname.startsWith('/privacy')
  ) {
    return 'governance';
  }
  if (
    pathname.startsWith('/admin') ||
    pathname.startsWith('/ecosystem') ||
    pathname.startsWith('/design')
  ) {
    return 'administration';
  }
  return null;
}
