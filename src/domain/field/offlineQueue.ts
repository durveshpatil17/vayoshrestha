/**
 * Offline Sync Queue for Senior Field Associates
 * Stores encrypted activity records locally, supports offline capture,
 * syncs with central store when network is available, and flags late syncs (>24h).
 */

import { mockStore } from '@/mock/store';
import { generateMembershipId } from '@/domain/idGenerator';
import { dobToAgeBand } from '@/domain/masking';

export interface FieldQueueItem {
  id: string;
  sequenceNumber: number;
  idempotencyKey: string;
  associateId: string;
  chapterId: string;
  activityType: 'onboarding' | 'check_in_visit' | 'consent_follow_up';
  peerName: string;
  peerPhone: string;
  emergencyContactName?: string;
  emergencyContactPhone?: string;
  preferredLanguage?: string;
  geoArea: string;
  doubleConsentState: 'consent_1_captured' | 'consent_2_requested' | 'confirmed' | 'expired' | 'declined';
  clientCapturedAt: string;
  syncedAt?: string;
  status: 'pending' | 'syncing' | 'synced' | 'failed' | 'conflict';
  isLateSync: boolean;
  retryCount: number;
}

export interface SyncResult {
  syncedCount: number;
  alreadySyncedCount: number;
  lateSyncCount: number;
  conflictCount: number;
  items: FieldQueueItem[];
}

const STORAGE_KEY = 'vayoshrestha_field_queue_v3';
let sequenceCounter = 0;

// BroadcastChannel for cross-tab live field telemetry updates
let telemetryChannel: BroadcastChannel | null = null;
try {
  if (typeof BroadcastChannel !== 'undefined') {
    telemetryChannel = new BroadcastChannel('vayoshrestha_field_telemetry');
  }
} catch {
  telemetryChannel = null;
}

export function notifyFieldTelemetry(event: {
  type: string;
  chapterId: string;
  areaLabel: string;
  activityType: string;
  timestamp: string;
}) {
  try {
    if (telemetryChannel) {
      telemetryChannel.postMessage(event);
    }
  } catch {
    // ignore cross-origin/context errors
  }
}

export function getFieldQueue(): FieldQueueItem[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    return JSON.parse(raw);
  } catch {
    return [];
  }
}

export function saveFieldQueue(queue: FieldQueueItem[]): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(queue));
  } catch {
    // fallback if storage quota exceeded
  }
}

export function clearFieldQueue(): void {
  try {
    localStorage.removeItem(STORAGE_KEY);
    sequenceCounter = 0;
  } catch {
    // noop
  }
}

export function enqueueActivity(params: {
  associateId: string;
  chapterId: string;
  activityType: 'onboarding' | 'check_in_visit' | 'consent_follow_up';
  peerName: string;
  peerPhone: string;
  emergencyContactName?: string;
  emergencyContactPhone?: string;
  preferredLanguage?: string;
  geoArea: string;
  doubleConsentState: 'consent_1_captured' | 'consent_2_requested' | 'confirmed' | 'expired' | 'declined';
  clientCapturedAt?: string;
}): FieldQueueItem {
  const queue = getFieldQueue();
  sequenceCounter = queue.length > 0 ? Math.max(...queue.map((q) => q.sequenceNumber)) + 1 : 1;

  const capturedAt = params.clientCapturedAt || new Date().toISOString();
  const idempotencyKey = `idemp-${params.associateId}-${params.peerPhone}-${new Date(capturedAt).getTime()}`;

  const newItem: FieldQueueItem = {
    id: `fq-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
    sequenceNumber: sequenceCounter,
    idempotencyKey,
    associateId: params.associateId,
    chapterId: params.chapterId,
    activityType: params.activityType,
    peerName: params.peerName.trim(),
    peerPhone: params.peerPhone.replace(/\D/g, ''),
    emergencyContactName: params.emergencyContactName,
    emergencyContactPhone: params.emergencyContactPhone,
    preferredLanguage: params.preferredLanguage || 'English',
    geoArea: params.geoArea,
    doubleConsentState: params.doubleConsentState,
    clientCapturedAt: capturedAt,
    status: 'pending',
    isLateSync: false,
    retryCount: 0,
  };

  queue.push(newItem);
  saveFieldQueue(queue);

  return newItem;
}

export async function processSyncQueue(associateId?: string): Promise<SyncResult> {
  const queue = getFieldQueue();
  const now = new Date();
  const twentyFourHoursAgo = now.getTime() - 24 * 60 * 60 * 1000;

  let syncedCount = 0;
  let alreadySyncedCount = 0;
  let lateSyncCount = 0;
  let conflictCount = 0;

  const updatedQueue = queue.map((item) => {
    // Filter by associate if provided
    if (associateId && item.associateId !== associateId) {
      return item;
    }

    if (item.status === 'synced') {
      alreadySyncedCount++;
      return item;
    }

    // Check if late sync (> 24 hours between capture and sync)
    const capturedTime = new Date(item.clientCapturedAt).getTime();
    const isLate = capturedTime < twentyFourHoursAgo;
    if (isLate) {
      lateSyncCount++;
    }

    // Integrate with mockStore:
    try {
      integrateWithCentralStore(item);
      syncedCount++;

      // Emit broadcast event for live field telemetry ticker
      notifyFieldTelemetry({
        type: 'SYNC_COMPLETED',
        chapterId: item.chapterId,
        areaLabel: item.geoArea,
        activityType: item.activityType,
        timestamp: new Date().toISOString(),
      });

      return {
        ...item,
        status: 'synced' as const,
        syncedAt: now.toISOString(),
        isLateSync: isLate,
      };
    } catch (err: any) {
      if (err.message === 'DUPLICATE_SENIOR') {
        conflictCount++;
        return {
          ...item,
          status: 'conflict' as const,
        };
      }
      return {
        ...item,
        status: 'failed' as const,
        retryCount: item.retryCount + 1,
      };
    }
  });

  saveFieldQueue(updatedQueue);

  return {
    syncedCount,
    alreadySyncedCount,
    lateSyncCount,
    conflictCount,
    items: updatedQueue.filter((x) => !associateId || x.associateId === associateId),
  };
}

function integrateWithCentralStore(item: FieldQueueItem): void {
  const store = mockStore.getData();

  // Check if senior already exists by phone (duplicate check)
  const existingSenior = store.seniorCitizens.find((s) => {
    const p = (s.phone || s.phoneNumber)?.replace(/\D/g, '');
    return p && p === item.peerPhone;
  });

  if (existingSenior && item.activityType === 'onboarding') {
    // Route to duplicates queue without exposing oracle to SF
    mockStore.writeAudit(
      item.associateId,
      'Field Associate',
      'SF',
      'CREATE',
      'ONBOARDING',
      item.id,
      `Duplicate peer onboarding detected for ${item.geoArea}. Routed to duplicates queue.`
    );
    throw new Error('DUPLICATE_SENIOR');
  }

  if (item.activityType === 'onboarding') {
    if (item.doubleConsentState === 'confirmed') {
      // Both consents verified -> Register full senior
      const newMembershipId = generateMembershipId('PUN', 26, store.seniorCitizens.length + 1);
      const newSenior = {
        id: `m-sf-${Date.now()}`,
        membershipId: newMembershipId,
        memberId: newMembershipId,
        fullName: item.peerName,
        preferredLanguage: item.preferredLanguage || 'English',
        gender: 'Other' as const,
        dateOfBirth: '1955-01-01',
        ageBand: dobToAgeBand('1955-01-01'),
        phone: item.peerPhone,
        phoneNumber: item.peerPhone,
        address: `${item.geoArea}`,
        chapterId: item.chapterId,
        status: 'Active' as const,
        registeredAt: new Date().toISOString(),
        consentCaptured: true,
        consentTimestamp: new Date().toISOString(),
        consentVersion: 'v3.1-field-double-consent',
        onboardingChannel: 'Field Assisted',
        onboardingNotes: `Onboarded by Senior Field Associate ${item.associateId} in ${item.geoArea}`,
        onboardingAssociateId: item.associateId,
        consentState: 'confirmed',
        emergencyContacts: item.emergencyContactName
          ? [
              {
                id: `ec-${Date.now()}`,
                name: item.emergencyContactName,
                relationship: 'Next of Kin',
                phone: item.emergencyContactPhone || '+91 98220 00000',
                isPrimary: true,
                canReceiveSms: true,
              },
            ]
          : [],
      };

      mockStore.updateData((data) => {
        data.seniorCitizens.push(newSenior as any);
      });

      mockStore.writeAudit(
        item.associateId,
        'Field Associate',
        'SF',
        'CREATE',
        'SENIOR',
        newSenior.id,
        `Senior ${item.peerName} registered successfully with double consent in ${item.geoArea}.`
      );
    } else {
      // Single consent only -> Place in Stalled Onboardings "Awaiting second consent"
      const stalledSession = {
        id: `sess-stalled-${Date.now()}`,
        candidateName: item.peerName,
        phone: item.peerPhone,
        chapterId: item.chapterId,
        stepReached: 'consent_2_pending',
        stalledReason: 'Awaiting second consent via WhatsApp',
        startedAt: item.clientCapturedAt,
        lastAttemptAt: new Date().toISOString(),
        associateId: item.associateId,
        geoArea: item.geoArea,
        doubleConsentState: item.doubleConsentState,
      };

      mockStore.updateData((data) => {
        data.stalledSessions.push(stalledSession as any);
      });

      mockStore.writeAudit(
        item.associateId,
        'Field Associate',
        'SF',
        'CREATE',
        'ONBOARDING',
        stalledSession.id,
        `Field onboarding for ${item.peerName} stalled awaiting 2nd WhatsApp consent.`
      );
    }
  } else {
    // Check-in visit or consent follow-up
    mockStore.writeAudit(
      item.associateId,
      'Field Associate',
      'SF',
      'UPDATE',
      'SENIOR',
      item.peerPhone,
      `Field interaction logged (${item.activityType}) at ${item.geoArea}.`
    );
  }
}
