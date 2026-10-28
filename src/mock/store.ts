import { createDeterministicSeed } from './seed';
import {
  Region,
  Chapter,
  UserAccount,
  SeniorCitizen,
  EmergencyContact,
  SosEvent,
  SmsFallbackRecord,
  MedicationSchedule,
  VitalLog,
  HealthFlag,
  WellnessCallTask,
  ThresholdConfig,
  SosSettings,
  ReminderTemplate,
  OnboardingScript,
  OnboardingSession,
  SystemSettings,
  AuditEvent,
  OutboundMessage,
} from '@/api/contracts';
import { RoleCode } from '@/permissions/matrix';
import { eventQueue } from './eventQueue';

const STORAGE_KEY = 'vayoshrestha_store_v2';

export interface AppStateData {
  regions: Region[];
  chapters: Chapter[];
  centres: Chapter[]; // Backwards-compatible alias for chapters
  users: UserAccount[];
  seniorCitizens: SeniorCitizen[];
  stalledSessions: OnboardingSession[];
  emergencyContacts: EmergencyContact[];
  medicationSchedules: MedicationSchedule[];
  vitalLogs: VitalLog[];
  healthFlags: HealthFlag[];
  wellnessCalls: WellnessCallTask[];
  wellnessCallTasks: WellnessCallTask[]; // alias
  sosEvents: SosEvent[];
  smsFallbackRecords: SmsFallbackRecord[];
  templates: ReminderTemplate[];
  onboardingScript: OnboardingScript;
  thresholdConfig: ThresholdConfig;
  sosSettings: SosSettings;
  systemSettings: SystemSettings;
  settings: SystemSettings; // Backwards-compatible alias for systemSettings
  auditEvents: AuditEvent[];
  outboundMessages: OutboundMessage[];
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
        const parsed = JSON.parse(stored);
        if (parsed.chapters && parsed.seniorCitizens && parsed.sosEvents) {
          parsed.centres = parsed.chapters; // ensure alias
          parsed.wellnessCallTasks = parsed.wellnessCalls || parsed.wellnessCallTasks || [];
          parsed.settings = parsed.systemSettings || parsed.settings;
          return parsed;
        }
      }
    } catch {
      console.warn('LocalStorage unavailable or quota reached, using in-memory mock store');
    }

    const seed = createDeterministicSeed();
    const state: AppStateData = {
      ...seed,
      centres: seed.chapters,
      wellnessCallTasks: seed.wellnessCalls,
      settings: seed.systemSettings,
    };

    this.persist(state);
    return state;
  }

  public persist(data?: AppStateData) {
    const toSave = data || this.data;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(toSave));
    } catch (e) {
      console.warn('Failed to persist store to localStorage (likely quota exceeded or private mode)', e);
    }
  }

  public getData(): AppStateData {
    if (!this.data.wellnessCallTasks) {
      this.data.wellnessCallTasks = this.data.wellnessCalls;
    }
    return this.data;
  }

  public updateData(mutator: (draft: AppStateData) => void): AppStateData {
    mutator(this.data);
    this.data.centres = this.data.chapters; // maintain alias
    this.data.wellnessCallTasks = this.data.wellnessCalls;
    this.persist(this.data);
    return this.data;
  }

  public resetToDefault(): AppStateData {
    return this.resetToDefaults();
  }

  public resetToDefaults(): AppStateData {
    try {
      localStorage.removeItem(STORAGE_KEY);
      localStorage.removeItem('vayoshrestha_store_v1');
    } catch {
      // ignore
    }
    const seed = createDeterministicSeed();
    this.data = {
      ...seed,
      centres: seed.chapters,
      wellnessCallTasks: seed.wellnessCalls,
      settings: seed.systemSettings,
    };
    this.persist(this.data);

    // Broadcast reset event across tabs
    eventQueue.enqueue('BROADCAST_SYNC', { action: 'RESET_STORE' });
    return this.data;
  }

  /**
   * Appends an immutable audit event with previous hash chaining.
   */
  public writeAudit(
    actorId: string,
    actorName: string,
    actorRole: RoleCode,
    action: AuditEvent['action'],
    entityType: AuditEvent['entityType'],
    entityId: string,
    details: string,
    reason?: string | null,
    diff?: AuditEvent['diff'],
    chapterId?: string,
    regionId?: string
  ): AuditEvent {
    const lastEvent = this.data.auditEvents[this.data.auditEvents.length - 1];
    const prevHash = lastEvent ? lastEvent.hash : 'GENESIS_VAYOSHRESTHA';
    const timestamp = new Date().toISOString();
    const rawString = `${prevHash}|${timestamp}|${actorId}|${action}|${entityType}|${entityId}`;
    
    // Simple deterministic hash representation
    let hashNum = 0;
    for (let i = 0; i < rawString.length; i++) {
      hashNum = (hashNum << 5) - hashNum + rawString.charCodeAt(i);
      hashNum |= 0;
    }
    const hash = `h-${Math.abs(hashNum).toString(16)}`;

    const event: AuditEvent = {
      id: `aud-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
      timestamp,
      actorId,
      actorName,
      actorRole,
      chapterId,
      regionId,
      action,
      entityType,
      entityId,
      details,
      reason,
      diff,
      previousHash: prevHash,
      hash,
    };

    this.data.auditEvents.unshift(event);
    if (this.data.auditEvents.length > 500) {
      this.data.auditEvents.pop();
    }
    this.persist(this.data);
    return event;
  }
}

export const mockStore = new MockDataStore();
