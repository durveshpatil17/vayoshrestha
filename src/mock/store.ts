import { createDeterministicSeed } from './seed';
import {
  UserAccount,
  EktaHub,
  SeniorCitizen,
  FamilyLink,
  Programme,
  ProgrammeSession,
  AttendanceRecord,
  AttendanceCorrection,
  ServicePartner,
  Referral,
  HealthEscalation,
  OutboundMessage,
  MessageTemplate,
  SystemSettings,
  AuditEvent,
  ComplaintTicket,
  SessionRegistration,
  Announcement,
  ServiceItem,
  FeedbackItem,
  FollowUpTask,
} from '@/api/contracts';
import { RoleCode } from '@/permissions/matrix';

const STORAGE_KEY = 'vayoshrestha_store_v1';

export interface AppStateData {
  centres: EktaHub[];
  users: UserAccount[];
  seniorCitizens: SeniorCitizen[];
  familyLinks: FamilyLink[];
  programmes: Programme[];
  sessions: ProgrammeSession[];
  sessionRegistrations: SessionRegistration[];
  attendanceRecords: AttendanceRecord[];
  attendanceCorrections: AttendanceCorrection[];
  servicePartners: ServicePartner[];
  services: ServiceItem[];
  referrals: Referral[];
  escalations: HealthEscalation[];
  outboundMessages: OutboundMessage[];
  templates: MessageTemplate[];
  announcements: Announcement[];
  feedback: FeedbackItem[];
  followUps: FollowUpTask[];
  settings: SystemSettings;
  auditEvents: AuditEvent[];
  complaints: ComplaintTicket[];
}

class MockDataStore {
  private data: AppStateData;

  constructor() {
    this.data = this.loadOrSeed();
  }

  private loadOrSeed(): AppStateData {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        return JSON.parse(stored);
      }
    } catch {
      console.warn('LocalStorage unavailable, using in-memory store');
    }

    const seed = createDeterministicSeed();

    // Generate initial session registrations from seniors and sessions
    const sessionRegistrations: SessionRegistration[] = [];
    seed.sessions.slice(0, 30).forEach((sess) => {
      const centreSeniors = seed.seniorCitizens.filter((s) => s.centreId === sess.centreId).slice(0, 15);
      centreSeniors.forEach((sen) => {
        sessionRegistrations.push({
          id: `reg-${sess.id}-${sen.id}`,
          sessionId: sess.id,
          memberId: sen.id,
          memberName: sen.fullName,
          status: 'Confirmed',
          isWalkIn: false,
          registeredAt: '2026-10-20T10:00:00Z',
        });
      });
    });

    const announcements: Announcement[] = [
      {
        id: 'ann-1',
        title: 'Diwali Special Wellness Circle & Cultural Gathering',
        content: 'Namaste Elders! Ekta Hub invites you and your family for a festive light-lamp ceremony and devotional music circle on 31st October.',
        category: 'Event',
        targetCentres: ['ALL'],
        targetLanguages: ['English', 'Hindi', 'Marathi'],
        audienceSize: 850,
        excludedNoConsent: 95,
        excludedOptedOut: 55,
        scheduledFor: '2026-10-30T10:00:00Z',
        status: 'Approved',
        submittedBy: 'Programme Manager',
        submittedAt: '2026-10-24T12:00:00Z',
        approvedBy: 'Meera Joshi (NM)',
        approvedAt: '2026-10-25T09:30:00Z',
      },
      {
        id: 'ann-2',
        title: 'Seasonal Joint Care & Warm Water Therapy Camp',
        content: 'Specialized geriatric physiotherapy consultations available this Saturday at Shivajinagar and Gangapur centres.',
        category: 'HealthAlert',
        targetCentres: ['HUB-PUN', 'HUB-NSK'],
        targetLanguages: ['English', 'Marathi'],
        audienceSize: 320,
        excludedNoConsent: 35,
        excludedOptedOut: 18,
        scheduledFor: '2026-11-02T09:00:00Z',
        status: 'Submitted',
        submittedBy: 'Programme Manager',
        submittedAt: '2026-10-26T16:00:00Z',
      },
    ];

    const services: ServiceItem[] = [
      {
        id: 'srv-1',
        partnerId: 'sp-1',
        partnerName: 'Sanctuary Elder Health Clinic',
        title: 'Geriatric Outpatient Medical Assessment',
        category: 'Clinical Assessment',
        description: 'Comprehensive review by geriatric physician including vitals, mobility check, and prescription reconciliation.',
        eligibility: 'All senior citizens aged 60 and above with priority for mobility impaired.',
        availableDays: ['Tuesday', 'Thursday'],
        centresServed: ['HUB-PUN', 'HUB-NSK'],
        status: 'Approved',
      },
      {
        id: 'srv-2',
        partnerId: 'sp-2',
        partnerName: 'Justice For Elders Legal Aid Foundation',
        title: 'Senior Citizen Maintenance & Pension Aid Consultation',
        category: 'Legal Aid',
        description: 'Free legal counseling for senior maintenance tribunal claims, family settlement, and government pension arrears.',
        eligibility: 'Seniors experiencing family disputes or pension delays.',
        availableDays: ['Wednesday', 'Friday'],
        centresServed: ['HUB-PUN'],
        status: 'Approved',
      },
      {
        id: 'srv-3',
        partnerId: 'sp-3',
        partnerName: 'Drushti Netralaya & Charitable Eye Trust',
        title: 'Senior Vision Screening & Cataract Triage',
        category: 'Eye Care',
        description: 'Non-invasive refractive examination, glaucoma risk screening, and subsidized surgery referral.',
        eligibility: 'Senior citizens experiencing deteriorating vision.',
        availableDays: ['Saturday'],
        centresServed: ['HUB-NSK'],
        status: 'Approved',
      },
      {
        id: 'srv-4',
        partnerId: 'sp-4',
        partnerName: 'ActiveAge Physiotherapy Center',
        title: 'Post-Fall Rehabilitation & Balance Training',
        category: 'Physiotherapy',
        description: 'Gait assessment, therapeutic balance exercises, and safe walking technique coaching.',
        eligibility: 'Elders with history of falls or arthritis mobility limitations.',
        availableDays: ['Monday', 'Wednesday', 'Friday'],
        centresServed: ['HUB-PUN', 'HUB-NAG'],
        status: 'Approved',
      },
    ];

    const feedback: FeedbackItem[] = [
      {
        id: 'fb-1',
        memberId: seed.seniorCitizens[0].id,
        memberName: seed.seniorCitizens[0].fullName,
        programmeId: seed.programmes[0].id,
        programmeTitle: seed.programmes[0].title,
        sessionId: seed.sessions[0].id,
        centreId: seed.seniorCitizens[0].centreId,
        rating: 5,
        theme: 'Instructor',
        comment: 'Teacher was very patient and explained joint breathing exercises carefully.',
        isAssistedEntry: false,
        createdAt: '2026-10-22T11:00:00Z',
      },
      {
        id: 'fb-2',
        memberId: seed.seniorCitizens[1].id,
        memberName: seed.seniorCitizens[1].fullName,
        programmeId: seed.programmes[1]?.id || seed.programmes[0].id,
        programmeTitle: seed.programmes[1]?.title || 'Digital Literacy',
        sessionId: seed.sessions[1]?.id || seed.sessions[0].id,
        centreId: seed.seniorCitizens[1].centreId,
        rating: 4,
        theme: 'Content',
        comment: 'Learned how to use UPI safely. Would appreciate more time on OTP scams.',
        isAssistedEntry: true,
        recordedBy: 'Pooja Shinde (VF)',
        createdAt: '2026-10-23T15:30:00Z',
      },
      {
        id: 'fb-3',
        memberId: seed.seniorCitizens[3].id,
        memberName: seed.seniorCitizens[3].fullName,
        programmeId: seed.programmes[0].id,
        programmeTitle: seed.programmes[0].title,
        sessionId: seed.sessions[0].id,
        centreId: seed.seniorCitizens[3].centreId,
        rating: 4,
        theme: 'Venue',
        comment: 'Chairs in second row need extra cushions for elders with back pain.',
        isAssistedEntry: false,
        createdAt: '2026-10-24T10:15:00Z',
      },
    ];

    const followUps: FollowUpTask[] = [
      {
        id: 'fu-1',
        memberId: seed.seniorCitizens[5].id,
        memberName: seed.seniorCitizens[5].fullName,
        centreId: seed.seniorCitizens[5].centreId,
        reason: 'Missed 3 consecutive sessions of Gentle Yoga (Drop-off alert)',
        assigneeId: 'u-cc-pune',
        assigneeName: 'Meera Joshi',
        dueDate: '2026-10-29',
        status: 'Pending',
        createdAt: '2026-10-25T09:00:00Z',
      },
      {
        id: 'fu-2',
        memberId: seed.seniorCitizens[8].id,
        memberName: seed.seniorCitizens[8].fullName,
        centreId: seed.seniorCitizens[8].centreId,
        reason: 'Check if transport assistance is required for next health screening camp',
        assigneeId: 'u-vf-pune',
        assigneeName: 'Pooja Shinde',
        dueDate: '2026-10-31',
        status: 'Pending',
        createdAt: '2026-10-26T14:00:00Z',
      },
      {
        id: 'fu-3',
        memberId: seed.seniorCitizens[12].id,
        memberName: seed.seniorCitizens[12].fullName,
        centreId: seed.seniorCitizens[12].centreId,
        reason: 'Post-referral check: Elder attended eye checkup at Drushti Netralaya',
        assigneeId: 'u-cc-pune',
        assigneeName: 'Meera Joshi',
        dueDate: '2026-10-26',
        status: 'Contacted',
        outcomeNotes: 'Elder received eye drops and scheduled cataract review next month.',
        createdAt: '2026-10-20T10:00:00Z',
      },
    ];

    const initialData: AppStateData = {
      ...seed,
      sessionRegistrations,
      announcements,
      services,
      feedback,
      followUps,
      attendanceCorrections: [],
      complaints: [
        {
          id: 'comp-1',
          category: 'Facility',
          complainantName: 'Bhagwandas Sharma',
          complainantRole: 'SC',
          complainantContact: '9822011223',
          centreId: 'HUB-PUN',
          subject: 'Drinking water dispenser out of order in main hall',
          description: 'The cold water filter was leaking during yesterday morning session.',
          urgency: 'Medium',
          status: 'New',
          createdAt: '2026-10-25T11:00:00Z',
          replies: [],
        },
      ],
    };

    this.persist(initialData);
    return initialData;
  }

  private persist(data: AppStateData): void {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    } catch {
      // quota or private mode
    }
    this.data = data;
  }

  public resetToDefault(): void {
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch {}
    this.data = this.loadOrSeed();
  }

  public resetToDefaults(): void {
    this.resetToDefault();
  }

  public getData(): AppStateData {
    return this.data;
  }

  public writeAudit(
    actorId: string,
    actorName: string,
    actorRole: RoleCode,
    action: AuditEvent['action'],
    entity: string,
    entityId: string,
    reason?: string,
    diffBefore?: any,
    diffAfter?: any,
    centreId?: string
  ): AuditEvent {
    const event: AuditEvent = {
      id: `aud-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      actorId,
      actorName,
      actorRole,
      centreId,
      action,
      entity,
      entityId,
      reason,
      diffBefore,
      diffAfter,
      timestamp: new Date().toISOString(),
      hash: Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15),
    };

    this.data.auditEvents.unshift(event);
    this.persist(this.data);
    return event;
  }

  // Generic Update Helper
  public updateData(mutator: (draft: AppStateData) => void): void {
    mutator(this.data);
    this.persist(this.data);
  }
}

export const mockStore = new MockDataStore();
