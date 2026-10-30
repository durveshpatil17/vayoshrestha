import {
  SeniorCitizen,
  SosEvent,
  HealthFlag,
  OnboardingSession,
  ReminderTemplate,
} from '@/api/contracts';
import { AppStateData } from './store';

export interface InFlightDemoStory {
  id: string;
  name: string;
  role: string;
  entityId: string;
  description: string;
  targetUrl: string;
}

export const IN_FLIGHT_DEMO_STORIES: InFlightDemoStory[] = [
  {
    id: 'STORY-1',
    name: 'Smt. Lakshmi Devi — Active Emergency SOS',
    role: 'CT',
    entityId: 'SOS-26-00042',
    description: 'Severe dizziness and chest heaviness reported via Senior Portal. 3 minutes unacknowledged.',
    targetUrl: '/sos',
  },
  {
    id: 'STORY-2',
    name: 'Shri Ramesh Kulkarni — Hypertensive Crisis Flag',
    role: 'CT',
    entityId: 'FLAG-26-00189',
    description: 'Morning vitals prompt returned BP 168/102. High-risk flag open, wellness call due.',
    targetUrl: '/health/queue?tab=flags',
  },
  {
    id: 'STORY-3',
    name: 'Shri Abdul Rehman — Second Consent Pending',
    role: 'CM',
    entityId: 'ONB-26-00312',
    description: 'Field Associate capture complete; pending WhatsApp interactive double-consent confirmation.',
    targetUrl: '/onboarding',
  },
  {
    id: 'STORY-4',
    name: 'Smt. Savitri Patil — Diagnostic Voucher Unredeemed',
    role: 'SP',
    entityId: 'VCH-26-8942-D',
    description: 'Geriatric cataract voucher issued 2 days ago; awaiting merchant settlement at Drishti Eye Care.',
    targetUrl: '/partner/vouchers/redeem',
  },
  {
    id: 'STORY-5',
    name: 'Shri Mohan Lal — Pro-Bono Legal Intake',
    role: 'SP',
    entityId: 'LEG-26-00054',
    description: 'Ancestral property eviction dispute. Encrypted narrative under advocate privilege.',
    targetUrl: '/legal-intake',
  },
  {
    id: 'STORY-6',
    name: 'Dharwad Quiz Channel — Weekly Mastermind Active',
    role: 'SC',
    entityId: 'LRN-QZ-26-04',
    description: 'Cyber Safety & UPI Fraud awareness module round active; 84 elder participants today.',
    targetUrl: '/me/quizzes',
  },
  {
    id: 'STORY-7',
    name: 'Governance Maker-Checker — Seasonal Advisory Pending',
    role: 'NM',
    entityId: 'TMP-26-00018',
    description: 'Monsoon boil-water advisory bilingual broadcast template submitted for sign-off.',
    targetUrl: '/communication/templates',
  },
  {
    id: 'STORY-8',
    name: 'Community Programme — Attendance Correction',
    role: 'CM',
    entityId: 'ATT-COR-26-00007',
    description: 'Volunteer requested attendance adjustment for Smt. Pushpa arriving during meditation.',
    targetUrl: '/attendance?tab=corrections',
  },
];

/**
 * Injects the canonical 8 in-flight demo stories into the application state data.
 * Guarantees zero-setup entry for CSR funder presentations.
 */
export function injectInFlightStories(data: AppStateData): void {
  // 1. Story 1: Smt. Lakshmi Devi (SOS-26-00042)
  if (!data.seniorCitizens.some((s) => s.id === 'SC-KA-HBL-042')) {
    const lakshmiDevi: SeniorCitizen = {
      id: 'SC-KA-HBL-042',
      memberId: 'VV-HBL-26-00042',
      membershipId: 'VV-HBL-26-00042',
      fullName: 'Smt. Lakshmi Devi',
      name: 'Lakshmi Devi',
      gender: 'Female',
      age: 74,
      dateOfBirth: '1952-04-12',
      ageBand: '70-79',
      phoneNumber: '+919845012345',
      phone: '+919845012345',
      address: 'Plot 42, Keshwapur Main Road, Hubballi',
      regionId: 'REG-S',
      chapterId: 'HUB-BLR',
      primaryLanguage: 'Kannada',
      preferredLanguage: 'Kannada',
      consentRecorded: true,
      status: 'Registered',
      isActive: true,
      registeredAt: '2026-07-15T09:00:00.000Z',
      abha: {
        number: '14-1234-5678-9012',
        verificationStatus: 'ProvidedUnverified',
        status: 'provided_unverified',
      },
      emergencyContacts: [
        {
          id: 'ec-lakshmi-1',
          name: 'Anuradha Patil',
          relationship: 'Daughter',
          phone: '+919845099887',
          isPrimary: true,
        },
      ],
    };
    data.seniorCitizens.unshift(lakshmiDevi);
  }

  if (!data.sosEvents.some((e) => e.id === 'SOS-26-00042')) {
    const activeSos: SosEvent = {
      id: 'SOS-26-00042',
      seniorId: 'SC-KA-HBL-042',
      seniorName: 'Smt. Lakshmi Devi',
      seniorPhone: '+919845012345',
      chapterId: 'HUB-BLR',
      regionId: 'REG-S',
      status: 'Triggered',
      triggeredAt: new Date(Date.now() - 180000).toISOString(), // 3 mins ago
      latencyMs: 142,
      isDrill: false,
      notes: 'Severe dizziness and chest heaviness reported via Senior Portal.',
    };
    data.sosEvents.unshift(activeSos);
  }

  // 2. Story 2: Shri Ramesh Kulkarni (FLAG-26-00189)
  if (!data.healthFlags.some((f) => f.id === 'FLAG-26-00189')) {
    const rameshFlag: HealthFlag = {
      id: 'FLAG-26-00189',
      seniorId: 'SC-KA-BLR-004',
      seniorName: 'Shri Ramesh Kulkarni',
      chapterId: 'HUB-PUN',
      vitalType: 'BloodPressure',
      readingValue: '168/102 mmHg',
      bandCrossed: 'Red',
      flaggedAt: new Date(Date.now() - 3600000).toISOString(),
      status: 'New',
    };
    data.healthFlags.unshift(rameshFlag);
  }

  // 3. Story 3: Shri Abdul Rehman (ONB-26-00312)
  if (!data.stalledSessions.some((s) => s.id === 'ONB-26-00312')) {
    const abdulStalled: OnboardingSession = {
      id: 'ONB-26-00312',
      seniorId: 'snr-abdul-312',
      seniorName: 'Shri Abdul Rehman',
      seniorPhone: '+919829011234',
      chapterId: 'HUB-PUN',
      currentStep: 2,
      stepName: 'Step2_ConsentDoubleCheck',
      startedAt: new Date(Date.now() - 7200000).toISOString(),
      lastUpdatedAt: new Date(Date.now() - 3600000).toISOString(),
      stalledDays: 2,
      nudgeCount: 1,
    };
    data.stalledSessions.unshift(abdulStalled);
  }

  // 4. Story 7: Governance Advisory Template (TMP-26-00018)
  if (!data.templates.some((t) => t.id === 'TMP-26-00018')) {
    const monsoonTemplate: ReminderTemplate = {
      id: 'TMP-26-00018',
      title: 'Monsoon Water Safety & Boil-Water Advisory',
      languages: ['Kannada', 'English'],
      type: 'General',
      approvalStatus: 'Pending',
      status: 'PendingApproval',
      updatedAt: new Date(Date.now() - 14400000).toISOString(),
    };
    data.templates.unshift(monsoonTemplate);
  }
}
