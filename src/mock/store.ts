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
  attendanceRecords: AttendanceRecord[];
  attendanceCorrections: AttendanceCorrection[];
  servicePartners: ServicePartner[];
  referrals: Referral[];
  escalations: HealthEscalation[];
  outboundMessages: OutboundMessage[];
  templates: MessageTemplate[];
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
    const initialData: AppStateData = {
      ...seed,
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
    diffBefore?: Record<string, unknown> | null,
    diffAfter?: Record<string, unknown> | null,
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
