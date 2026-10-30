/**
 * Vayoshrestha Scenario Engine (S1 through S6)
 * Codifies deterministic operational scenarios for CSR funder demonstrations.
 */
import { mockStore } from '@/mock/store';
import { TaskService } from '@/services/tasks';
import { IN_FLIGHT_DEMO_STORIES } from '@/mock/demoStories';

export interface DemoScenario {
  id: 'S1' | 'S2' | 'S3' | 'S4' | 'S5' | 'S6';
  name: string;
  tagline: string;
  description: string;
  recommendedRole: string;
  startingRoute: string;
  talkingPoints: string[];
  steps: {
    title: string;
    description: string;
    targetRole: string;
    targetRoute: string;
    actionLabel?: string;
  }[];
}

export const DEMO_SCENARIOS: DemoScenario[] = [
  {
    id: 'S1',
    name: 'Normal Weekday Rhythms',
    tagline: 'Standard day-in-the-life across 9 community Ekta Hubs',
    description: 'Autonomous health reminders, WhatsApp vitals check-ins, scheduled chair yoga sessions, and high volunteer engagement.',
    recommendedRole: 'RA',
    startingRoute: '/',
    talkingPoints: [
      'Scale: 1,000 enrolled seniors across 3 regions and 9 community chapters.',
      'High adherence: >85% WhatsApp interactive response rate for daily morning check-ins.',
      'Zero active critical emergencies; all queues within SLA budgets.',
    ],
    steps: [
      {
        title: 'Launchpad Executive Overview',
        description: 'Observe regional KPI tiles, adherence trends, and personal My work queue.',
        targetRole: 'RA',
        targetRoute: '/',
        actionLabel: 'View Launchpad',
      },
      {
        title: 'Community Session Roster',
        description: 'Review morning Chair Yoga Circle attendance rosters locked with zero discrepancies.',
        targetRole: 'VF',
        targetRoute: '/attendance',
        actionLabel: 'Inspect Rosters',
      },
      {
        title: 'Care Telemetry Stream',
        description: 'Examine live vital readings logged by seniors via WhatsApp chat parser.',
        targetRole: 'CT',
        targetRoute: '/health/queue?tab=logs',
        actionLabel: 'View Care Logs',
      },
    ],
  },
  {
    id: 'S2',
    name: 'Monsoon Heatwave Advisory',
    tagline: 'Mass broadcast with DPDP consent filter and wellness triage surge',
    description: 'Advisory alert dispatched to 420 elders, triggering secondary health flags, abnormal blood pressure spikes, and targeted volunteer outreach.',
    recommendedRole: 'PM',
    startingRoute: '/communication/announcements',
    talkingPoints: [
      'DPDP consent compliance: Broadcast automatically strips 8 opted-out elders.',
      'Maker-checker signoff: Advisory template audited and approved by National Manager.',
      'Proactive clinical triage: 3 consecutive BP spikes automatically create High-priority outreach tasks.',
    ],
    steps: [
      {
        title: 'Broadcast Announcement Dispatch',
        description: 'Review statutory weather advisory sent to elders with language localization.',
        targetRole: 'PM',
        targetRoute: '/communication/announcements',
        actionLabel: 'View Announcements',
      },
      {
        title: 'Biomarker Anomaly Flags',
        description: 'Inspect hypertensive spikes flagged by NLP parser in Bangalore hub.',
        targetRole: 'CT',
        targetRoute: '/health/queue?tab=flags',
        actionLabel: 'Inspect Flags',
      },
      {
        title: 'Take Next Wellness Call',
        description: 'Conduct phone outreach for Savitri Amma (168/98 mmHg) and log care notes.',
        targetRole: 'CT',
        targetRoute: '/health/queue?tab=calls',
        actionLabel: 'Take Next Call',
      },
    ],
  },
  {
    id: 'S3',
    name: 'Emergency Escalation Cascade',
    tagline: 'Real-time SOS trigger, sub-2s SMS fallback & mandatory 24h review',
    description: 'Elder triggers physical SOS button; Care Triage acknowledges within 3 minutes; SMS fallback ensures zero dropped alerts; Case Manager conducts post-incident review.',
    recommendedRole: 'CT',
    startingRoute: '/sos',
    talkingPoints: [
      'Zero-drop reliability: Telephony fallback dispatches encrypted SMS in 1.2 seconds if WhatsApp fails.',
      'SLA countdown: Flashing audio-visual alert with 3-minute strict acknowledgment SLA.',
      'Institutional accountability: Case cannot be closed without completing 24h post-incident review.',
    ],
    steps: [
      {
        title: 'Emergency SOS Board',
        description: 'Acknowledge active critical incident for Lakshmi Devi at Jayanagar Hub.',
        targetRole: 'CT',
        targetRoute: '/sos',
        actionLabel: 'Acknowledge SOS',
      },
      {
        title: 'Incident Detail & Assistance Dispatch',
        description: 'Review next-of-kin contacts, coordinate field volunteer dispatch, and resolve incident.',
        targetRole: 'CT',
        targetRoute: '/sos/SOS-20261030-001',
        actionLabel: 'Manage Case',
      },
      {
        title: '24-Hour Post-Incident Review',
        description: 'Verify senior stabilization, confirm family notification, and cryptographically seal review.',
        targetRole: 'CM',
        targetRoute: '/sos/SOS-20261030-001',
        actionLabel: 'Complete Review',
      },
    ],
  },
  {
    id: 'S4',
    name: 'Field Registration Blitz',
    tagline: 'Offline terminal assisted registration, double consent & duplicate resolution',
    description: 'Field associate registers walk-in elders in rural Dharwad; WebCrypto offline storage buffers payloads; supervisor sync detects phonetic duplicate enrollment.',
    recommendedRole: 'FA',
    startingRoute: '/field',
    talkingPoints: [
      'Edge resilience: Full offline operation with WebCrypto AES-GCM encryption in localStorage/IndexedDB.',
      'Double consent: Both member thumbprint/signature and staff declaration captured before enrollment.',
      'Phonetic deduplication: Soundex/Metaphone matching catches duplicate registrations with 94% confidence.',
    ],
    steps: [
      {
        title: 'Field Worker Mobile Terminal',
        description: 'Review offline queue and capture assisted member enrollment with coarse geo-stamps.',
        targetRole: 'FA',
        targetRoute: '/field',
        actionLabel: 'Open Field Terminal',
      },
      {
        title: 'Duplicate Resolution Workbench',
        description: 'PM compares phonetic duplicate match for Anasuya Bai and confirms unique identity.',
        targetRole: 'PM',
        targetRoute: '/seniors/duplicates',
        actionLabel: 'Resolve Duplicate',
      },
      {
        title: 'Sync Supervision Queue',
        description: 'Supervisor reviews terminal sync health and releases late-sync warning flags.',
        targetRole: 'CM',
        targetRoute: '/field-network/sync',
        actionLabel: 'Inspect Sync Queue',
      },
    ],
  },
  {
    id: 'S5',
    name: 'Festival Holiday & Quiet Hours',
    tagline: 'Strict 21:00-08:00 quiet hours compliance and session reschedule',
    description: 'Diwali hub shutdown protocol with non-intrusive reminder suppression, excused session attendances, and automated notification deferral.',
    recommendedRole: 'PM',
    startingRoute: '/communication/announcements/new',
    talkingPoints: [
      'Quiet hours guard: Night-time message dispatch is held until 08:00 IST per DPDP regulations.',
      'Attendance governance: Maker-checker corrections allow excusing elders during religious holidays.',
      'Emergency bypass: SOS alert dispatch is completely exempted from quiet-hour restrictions.',
    ],
    steps: [
      {
        title: 'Quiet-Hours Broadcast Builder',
        description: 'Observe active quiet-hours banner and automatic deferral to 08:00 IST morning release.',
        targetRole: 'PM',
        targetRoute: '/communication/announcements/new',
        actionLabel: 'Open Broadcaster',
      },
      {
        title: 'Attendance Correction Review',
        description: 'Centre Manager approves volunteer attendance adjustment for festival walk-ins.',
        targetRole: 'CM',
        targetRoute: '/attendance?tab=corrections',
        actionLabel: 'Review Corrections',
      },
      {
        title: 'Delivery Telemetry & Retry Queue',
        description: 'Verify WhatsApp read-receipt logs and zero quiet-hour violations across gateways.',
        targetRole: 'SA',
        targetRoute: '/communication/delivery',
        actionLabel: 'Inspect Delivery',
      },
    ],
  },
  {
    id: 'S6',
    name: 'CSR Audit & Public Verification',
    tagline: 'k-Anonymity suppression, tamper-evident SHA-256 seal & public verification',
    description: 'Quarterly CSR impact report generation with small-cell privacy suppression, National Manager sign-off, and public unauthenticated verification at /verify.',
    recommendedRole: 'NM',
    startingRoute: '/telemetry/packs',
    talkingPoints: [
      'Differential privacy: All cells with <5 individuals are masked with Asterisks to prevent re-identification.',
      'Cryptographic provenance: Entire dossier hashed with SHA-256 and linked to the genesis audit block.',
      'Zero-login verification: Corporate funders verify authenticity directly at /verify using receipt codes.',
    ],
    steps: [
      {
        title: 'Impact Dossier Builder',
        description: 'Inspect multi-chapter aggregations and verify k>=5 cell suppression rules.',
        targetRole: 'PM',
        targetRoute: '/telemetry/packs',
        actionLabel: 'View Impact Packs',
      },
      {
        title: 'Maker-Checker Release Signoff',
        description: 'National Manager authorizes public release and computes final SHA-256 digest.',
        targetRole: 'NM',
        targetRoute: '/telemetry/packs/PACK-2026-CSR-03',
        actionLabel: 'Authorize Release',
      },
      {
        title: 'Public Verification Gateway',
        description: 'Input verification code into public verify portal to prove untampered provenance.',
        targetRole: 'SC',
        targetRoute: '/verify',
        actionLabel: 'Open Verify Portal',
      },
    ],
  },
];

class ScenarioEngineService {
  private activeScenarioId: DemoScenario['id'] = 'S1';
  private simulationSpeed: 'paused' | '1x' | '5x' | 'realtime' = '1x';

  public getActiveScenario(): DemoScenario {
    return DEMO_SCENARIOS.find((s) => s.id === this.activeScenarioId) || DEMO_SCENARIOS[0];
  }

  public getScenarios(): DemoScenario[] {
    return DEMO_SCENARIOS;
  }

  public getSpeed(): 'paused' | '1x' | '5x' | 'realtime' {
    return this.simulationSpeed;
  }

  public setSpeed(speed: 'paused' | '1x' | '5x' | 'realtime') {
    this.simulationSpeed = speed;
  }

  public applyScenario(scenarioId: DemoScenario['id']) {
    this.activeScenarioId = scenarioId;

    // Reset base seed data
    mockStore.resetToDefault();
    TaskService.resetToSeed();

    // Custom scenario state modifications
    const scenario = DEMO_SCENARIOS.find((s) => s.id === scenarioId);
    if (!scenario) return;

    mockStore.writeAudit(
      'u-demo-director',
      'Demo Director',
      'SA',
      'UPDATE',
      'SETTINGS',
      `SCENARIO-${scenarioId}`,
      `Demo Director applied scenario: ${scenario.name} (${scenario.tagline}).`,
      'Live CSR presentation mode'
    );
    mockStore.persist();
  }
}

export const scenarioEngine = new ScenarioEngineService();

