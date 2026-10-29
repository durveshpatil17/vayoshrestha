import fs from 'fs';
import path from 'path';

const ledgerPath = path.resolve('./docs/feature-ledger.json');
const ledgerMdPath = path.resolve('./docs/FEATURE_LEDGER.md');

const processSteps = [
  // P1
  { id: 'P01-S1', name: 'P1: Demographic capture (Wizard, Field, Chatbot)', fr: 'P1', routes: ['/onboarding/new', '/field/onboard'], roles: ['VF', 'CM', 'SF', 'SC'], status: 'Built', notes: 'Assisted wizard and mobile field capture operational.' },
  { id: 'P01-S2', name: 'P1: Consent capture & DPDP recording', fr: 'P1', routes: ['/onboarding/new', '/field/onboard'], roles: ['VF', 'CM', 'SF'], status: 'Built', notes: 'In-person checkbox and double-consent state machine.' },
  { id: 'P01-S3', name: 'P1: Duplicate detection evaluation & PM inbox task', fr: 'P1', routes: ['/seniors/duplicates'], roles: ['PM'], status: 'Partial', notes: 'Detection logic exists; handoff task in PM inbox missing (Loop R4/R6).' },
  { id: 'P01-S4', name: 'P1: Member ID issuance & chapter assignment', fr: 'P1', routes: ['/seniors'], roles: ['CM', 'VF'], status: 'Built', notes: 'Luhn-like VV-HBL-26 ID generator and chapter roster.' },
  { id: 'P01-S5', name: 'P1: Consent-gated welcome message dispatch', fr: 'P1', routes: ['/communication/delivery'], roles: ['CM'], status: 'Partial', notes: 'Gateway mock exists; auto-trigger upon duplicate resolution missing.' },

  // P2
  { id: 'P02-S1', name: 'P2: Emergency SOS trigger (Portal/Chat/On-behalf)', fr: 'P2', routes: ['/sos', '/me'], roles: ['SC', 'VF', 'CT'], status: 'Built', notes: 'BroadcastChannel dispatch and real-time state machine.' },
  { id: 'P02-S2', name: 'P2: Real-time chime & Live Board alert', fr: 'P2', routes: ['/sos'], roles: ['CT', 'CM', 'RA'], status: 'Built', notes: 'Solid red chip and audio alert.' },
  { id: 'P02-S3', name: 'P2: 60s WhatsApp timeout & Cellular fallback SMS', fr: 'P2', routes: ['/sms-log'], roles: ['CT', 'SA'], status: 'Built', notes: 'Cellular fallback decision and SMS outbox logging.' },
  { id: 'P02-S4', name: 'P2: Multi-tier escalation chain (CT -> RA -> NM)', fr: 'P2', routes: ['/sos'], roles: ['CT', 'RA', 'NM'], status: 'Built', notes: 'Escalation timers at 120s and 300s.' },
  { id: 'P02-S5', name: 'P2: Triage notes & outcome resolution code', fr: 'P2', routes: ['/sos/:id'], roles: ['CT', 'CM'], status: 'Built', notes: 'Case detail notes and terminal resolution codes.' },
  { id: 'P02-S6', name: 'P2: Mandatory post-case review task for CM', fr: 'P2', routes: ['/sos/:id'], roles: ['CM'], status: 'Missing', notes: 'Mandatory 24h CM review checklist task (Loop R4/R7).' },

  // P3
  { id: 'P03-S1', name: 'P3: Scheduled vitals & medication prompt dispatch', fr: 'P3', routes: ['/health/schedules'], roles: ['CT', 'CM'], status: 'Built', notes: 'Reminders engine with 08:00 AM morning prompt.' },
  { id: 'P03-S2', name: 'P3: Vitals response string NLP parsing', fr: 'P3', routes: ['/health/logs'], roles: ['CT'], status: 'Built', notes: 'Systolic/diastolic/glucose regex extraction.' },
  { id: 'P03-S3', name: 'P3: Risk band classification', fr: 'P3', routes: ['/health/rules'], roles: ['CT', 'CM'], status: 'Built', notes: 'Normal, Watch, High-Risk, Critical bands.' },
  { id: 'P03-S4', name: 'P3: High-risk flag generation', fr: 'P3', routes: ['/health/flags'], roles: ['CT', 'CM'], status: 'Built', notes: 'Flags triage queue with threshold indicators.' },
  { id: 'P03-S5', name: 'P3: Wellness-call task generation & Take Next outreach', fr: 'P3', routes: ['/health/calls'], roles: ['CT'], status: 'Partial', notes: 'Calls list exists; task in inbox and Take Next queue missing (Loop R4/R7).' },

  // P4
  { id: 'P04-S1', name: 'P4: Programme scheduling & registration', fr: 'P4', routes: ['/programmes', '/schedule'], roles: ['PM', 'CM'], status: 'Built', notes: 'Recurrence engine and capacity limits.' },
  { id: 'P04-S2', name: 'P4: Session attendance marking & locking', fr: 'P4', routes: ['/attendance'], roles: ['VF', 'CM'], status: 'Built', notes: 'Presence toggle and 2h session locking.' },
  { id: 'P04-S3', name: 'P4: Attendance correction request submission', fr: 'P4', routes: ['/attendance/corrections'], roles: ['VF'], status: 'Built', notes: 'Correction modal with reason documentation.' },
  { id: 'P04-S4', name: 'P4: Attendance correction approval task for CM', fr: 'P4', routes: ['/attendance/corrections'], roles: ['CM'], status: 'Partial', notes: 'Approval action exists; task in CM inbox missing (Loop R4/R8).' },
  { id: 'P04-S5', name: 'P4: 3-session absence drop-off outreach task', fr: 'P4', routes: ['/feedback/follow-ups'], roles: ['VF', 'CM'], status: 'Missing', notes: 'Disengagement detection and outreach task (Loop R8).' },

  // P5
  { id: 'P05-S1', name: 'P5: Campaign template authoring & variable chips', fr: 'P5', routes: ['/communication/templates'], roles: ['PM'], status: 'Built', notes: 'Multi-lingual template builder with token chips.' },
  { id: 'P05-S2', name: 'P5: DPDP consent-gated audience filtering', fr: 'P5', routes: ['/communication/consents'], roles: ['PM', 'NM'], status: 'Built', notes: 'Automatic stripping of opted-out recipients.' },
  { id: 'P05-S3', name: 'P5: Maker-checker submission to NM inbox', fr: 'P5', routes: ['/communication/templates'], roles: ['NM'], status: 'Partial', notes: 'Template status exists; inbox task for NM missing (Loop R4/R8).' },
  { id: 'P05-S4', name: 'P5: Quiet hours (21:00-08:00) broadcast guard', fr: 'P5', routes: ['/communication/announcements'], roles: ['PM', 'SA'], status: 'Partial', notes: 'Enforced on learning series; broadcaster deferral missing (Loop R8).' },
  { id: 'P05-S5', name: 'P5: Delivery log & failure retry queue', fr: 'P5', routes: ['/communication/delivery'], roles: ['SA', 'PM'], status: 'Built', notes: 'Delivery states (Sent/Delivered/Read) and retry action.' },

  // P6
  { id: 'P06-S1', name: 'P6: Service request initiation', fr: 'P6', routes: ['/services/requests'], roles: ['SC', 'VF', 'CM'], status: 'Built', notes: 'Diagnostic/mobility service requests.' },
  { id: 'P06-S2', name: 'P6: Deterministic capacity routing engine', fr: 'P6', routes: ['/routing'], roles: ['PM', 'NM'], status: 'Built', notes: 'Capacity-aware provider matching.' },
  { id: 'P06-S3', name: 'P6: Crockford-32 Modulo-37 voucher issuance', fr: 'P6', routes: ['/vouchers'], roles: ['PM', 'SP'], status: 'Built', notes: 'VCH-26-XXXX alphanumeric voucher codes.' },
  { id: 'P06-S4', name: 'P6: Partner referral action task in partner inbox', fr: 'P6', routes: ['/partner/referrals'], roles: ['SP'], status: 'Partial', notes: 'Referrals view exists; inbox task model missing (Loop R4/R9).' },
  { id: 'P06-S5', name: 'P6: Idempotent partner voucher redemption', fr: 'P6', routes: ['/partner/vouchers/redeem'], roles: ['SP'], status: 'Built', notes: 'Checksum validation and single-use lock.' },

  // P7
  { id: 'P07-S1', name: 'P7: Pro-bono legal intake submission', fr: 'P7', routes: ['/legal-intake'], roles: ['CM', 'SC'], status: 'Built', notes: 'WebCrypto AES-GCM envelope encryption.' },
  { id: 'P07-S2', name: 'P7: Client-advocate privilege badge & statutory disclaimer', fr: 'P7', routes: ['/legal-intake/:id'], roles: ['SP', 'CM'], status: 'Built', notes: 'Staff metadata-only view; non-legal advice notice.' },
  { id: 'P07-S3', name: 'P7: Advocate consultation task & statutory closure codes', fr: 'P7', routes: ['/legal-intake/:id'], roles: ['SP'], status: 'Partial', notes: 'Outcome codes exist; advocate inbox task missing (Loop R4/R9).' },

  // P8
  { id: 'P08-S1', name: 'P8: Micro-lesson authoring & phone preview', fr: 'P8', routes: ['/learning/library/new'], roles: ['PM'], status: 'Built', notes: '4-step lesson creator with simulated bubbles.' },
  { id: 'P08-S2', name: 'P8: Curriculum maker-checker approval task for NM', fr: 'P8', routes: ['/learning/library'], roles: ['NM'], status: 'Partial', notes: 'Status flag exists; NM approval task missing (Loop R4/R10).' },
  { id: 'P08-S3', name: 'P8: Quiet hours 21:00-08:00 drip campaign delivery', fr: 'P8', routes: ['/learning/series'], roles: ['PM'], status: 'Built', notes: 'Night window delivery block.' },
  { id: 'P08-S4', name: 'P8: Mastermind quiz & anonymous chapter leaderboard', fr: 'P8', routes: ['/learning/quizzes', '/me/quizzes'], roles: ['SC', 'PM'], status: 'Built', notes: 'Instant score evaluation and chapter totals.' },

  // P9
  { id: 'P09-S1', name: 'P9: Field associate roster & ward allocation', fr: 'P9', routes: ['/field-network/associates'], roles: ['PM', 'CM'], status: 'Built', notes: 'Staff directory and geographical wards.' },
  { id: 'P09-S2', name: 'P9: Mobile offline capture with WebCrypto encryption', fr: 'P9', routes: ['/field/onboard'], roles: ['SF'], status: 'Built', notes: 'Client-side AES-GCM IndexedDB storage.' },
  { id: 'P09-S3', name: 'P9: Coarse 2-decimal geo-stamping (~1.1 km radius)', fr: 'P9', routes: ['/field/activity'], roles: ['SF', 'CM'], status: 'Built', notes: 'Zero continuous GPS tracking.' },
  { id: 'P09-S4', name: 'P9: Sync monitor & >24h late-sync warnings', fr: 'P9', routes: ['/field-network/sync'], roles: ['CM', 'RA'], status: 'Built', notes: 'Delayed sync health tracking.' },
  { id: 'P09-S5', name: 'P9: Supervisor sync review task in CM inbox', fr: 'P9', routes: ['/field-network/sync'], roles: ['CM'], status: 'Partial', notes: 'Late-sync flag exists; supervisor inbox task missing (Loop R4/R6).' },

  // P10
  { id: 'P10-S1', name: 'P10: Maker submission of sensitive parameter change', fr: 'P10', routes: ['/admin/approvals'], roles: ['ALL'], status: 'Built', notes: 'Draft hold on thresholds and templates.' },
  { id: 'P10-S2', name: 'P10: Strict maker-checker dual control enforcement', fr: 'P10', routes: ['/admin/approvals'], roles: ['NM', 'SA'], status: 'Built', notes: 'Self-approval blocked (maker_id !== checker_id).' },
  { id: 'P10-S3', name: 'P10: Governance approval task in NM inbox', fr: 'P10', routes: ['/admin/approvals'], roles: ['NM'], status: 'Partial', notes: 'Approvals queue exists; task in inbox missing (Loop R4/R11).' },
  { id: 'P10-S4', name: 'P10: Cryptographic SHA-256 audit entry recording', fr: 'P10', routes: ['/admin/audit-logs'], roles: ['SA'], status: 'Built', notes: 'Tamper-evident audit chain write.' },

  // P11
  { id: 'P11-S1', name: 'P11: DPDP deletion/export request submission', fr: 'P11', routes: ['/admin/data-governance'], roles: ['SC', 'CM'], status: 'Built', notes: 'Statutory request intake.' },
  { id: 'P11-S2', name: 'P11: NM identity verification & approval task', fr: 'P11', routes: ['/admin/data-governance'], roles: ['NM'], status: 'Partial', notes: 'Review modal exists; inbox task missing (Loop R4/R11).' },
  { id: 'P11-S3', name: 'P11: SA irrevocable purge execution with type-to-confirm', fr: 'P11', routes: ['/admin/data-governance'], roles: ['SA'], status: 'Partial', notes: 'Purge modal exists; SA execution task missing (Loop R4/R11).' },

  // P12
  { id: 'P12-S1', name: 'P12: Grievance/complaint lodging with severity', fr: 'P12', routes: ['/admin/complaints/new'], roles: ['ALL'], status: 'Built', notes: 'Complaint submission form.' },
  { id: 'P12-S2', name: 'P12: Chapter scope-based auto-assignment', fr: 'P12', routes: ['/admin/complaints'], roles: ['CM', 'NM'], status: 'Built', notes: 'Assigned to jurisdictional CM.' },
  { id: 'P12-S3', name: 'P12: Investigation task & internal notes thread', fr: 'P12', routes: ['/admin/complaints/:id'], roles: ['CM'], status: 'Partial', notes: 'Thread notes exist; inbox task missing (Loop R4/R11).' },
  { id: 'P12-S4', name: 'P12: Remediation action & resolution code recording', fr: 'P12', routes: ['/admin/complaints/:id'], roles: ['CM', 'NM'], status: 'Built', notes: 'Resolution status updates.' },

  // P13
  { id: 'P13-S1', name: 'P13: Event store aggregation across 9 chapters', fr: 'P13', routes: ['/telemetry/packs/new'], roles: ['PM'], status: 'Built', notes: 'Multi-chapter metric aggregator.' },
  { id: 'P13-S2', name: 'P13: k >= 5 cell suppression privacy defense', fr: 'P13', routes: ['/telemetry/packs'], roles: ['PM', 'NM'], status: 'Built', notes: 'Small-cell suppression against differencing.' },
  { id: 'P13-S3', name: 'P13: In-browser SHA-256 digest computation & PDF export', fr: 'P13', routes: ['/telemetry/packs/:id'], roles: ['PM', 'NM', 'CD'], status: 'Built', notes: 'Tamper-evident client cryptographic digest.' },
  { id: 'P13-S4', name: 'P13: Impact pack release sign-off task in NM inbox', fr: 'P13', routes: ['/telemetry/packs/:id'], roles: ['NM'], status: 'Partial', notes: 'Release button exists; inbox task missing (Loop R4/R10).' },
  { id: 'P13-S5', name: 'P13: Unauthenticated public verification gateway', fr: 'P13', routes: ['/verify'], roles: ['ALL'], status: 'Built', notes: 'Zero-login public hash verification.' },

  // P14
  { id: 'P14-S1', name: 'P14: Partner organization profile & 80G/12A details', fr: 'P14', routes: ['/partners/new'], roles: ['PM'], status: 'Built', notes: 'Statutory verification registration.' },
  { id: 'P14-S2', name: 'P14: Partner accreditation task in NM inbox', fr: 'P14', routes: ['/admin/approvals'], roles: ['NM'], status: 'Partial', notes: 'Approvals queue exists; inbox task missing (Loop R4/R9).' },
  { id: 'P14-S3', name: 'P14: Capacity-aware routing pool activation', fr: 'P14', routes: ['/partners'], roles: ['PM', 'NM'], status: 'Built', notes: 'Active status in routing engine.' },

  // P15
  { id: 'P15-S1', name: 'P15: Chapter provisioning & regional geofence', fr: 'P15', routes: ['/chapters/new'], roles: ['RA', 'SA'], status: 'Built', notes: 'Chapter creation and locality setup.' },
  { id: 'P15-S2', name: 'P15: Chapter staff roster allocation', fr: 'P15', routes: ['/admin/chapters'], roles: ['CM', 'RA'], status: 'Built', notes: 'Staff assigned to Ekta Hub.' },
  { id: 'P15-S3', name: 'P15: Real-time Pilot Readiness Checklist with remediation links', fr: 'P15', routes: ['/admin/settings'], roles: ['CM', 'NM'], status: 'Missing', notes: 'Dynamic checklist tab computed from store state (Loop R11).' },
  { id: 'P15-S4', name: 'P15: Chapter Go-Live milestone authorization task', fr: 'P15', routes: ['/admin/settings'], roles: ['NM'], status: 'Missing', notes: 'Go-live milestone authorization task for NM (Loop R11).' }
];

const ledger = JSON.parse(fs.readFileSync(ledgerPath, 'utf8'));

// Filter out existing process steps if any, keeping F-001 through F-105
ledger.features = ledger.features.filter(f => !f.id.startsWith('P'));

// Append the new process step rows
ledger.features.push(...processSteps);

fs.writeFileSync(ledgerPath, JSON.stringify(ledger, null, 2));

// Regenerate docs/FEATURE_LEDGER.md
const builtCount = ledger.features.filter(f => f.status === 'Built').length;
const partialCount = ledger.features.filter(f => f.status === 'Partial').length;
const missingCount = ledger.features.filter(f => f.status === 'Missing' || f.status === 'Planned').length;

let md = `# Vayoshrestha Feature Ledger (Features F-001..F-105 & Process Steps P1..P15)

Total Items: ${ledger.features.length} | Built: ${builtCount} | Partial: ${partialCount} | Missing/Planned: ${missingCount}

| ID | Name | Module / FR | Routes | Roles | Status | Notes |
| --- | --- | --- | --- | --- | --- | --- |
`;

for (const f of ledger.features) {
  const routesStr = f.routes.join(', ');
  const rolesStr = f.roles.join(',');
  md += `| ${f.id} | ${f.name} | ${f.fr} | ${routesStr} | ${rolesStr} | ${f.status} | ${f.notes} |\n`;
}

fs.writeFileSync(ledgerMdPath, md);

console.log(`Updated ledger: ${ledger.features.length} total (${builtCount} Built, ${partialCount} Partial, ${missingCount} Missing)`);

