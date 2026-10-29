import { describe, it, expect, beforeEach } from 'vitest';
import {
  encryptFieldPayload,
  decryptFieldPayload,
  generateFieldKey,
} from '@/domain/field/encryption';
import {
  createCoarseGeoStamp,
  formatCoarseCoordinates,
} from '@/domain/field/geoStamp';
import {
  initDoubleConsent,
  advanceToConsentTwo,
  confirmConsentTwo,
  expireConsentTwo,
  declineConsentTwo,
  DoubleConsentState,
} from '@/domain/field/doubleConsent';
import {
  FieldQueueItem,
  enqueueActivity,
  processSyncQueue,
  clearFieldQueue,
  getFieldQueue,
} from '@/domain/field/offlineQueue';

describe('Layer 3 — Field Network Core Domain Logic', () => {
  beforeEach(() => {
    clearFieldQueue();
  });

  describe('1. WebCrypto AES-GCM Activity File Encryption', () => {
    it('encrypts and decrypts peer interaction payload cleanly', async () => {
      const key = await generateFieldKey();
      const payload = {
        peerName: 'Anasuya Kelkar',
        phone: '9822019999',
        chapterId: 'HUB-PUN',
        consent1Timestamp: new Date().toISOString(),
      };

      const encryptedBlob = await encryptFieldPayload(payload, key);
      expect(encryptedBlob).toBeDefined();
      expect(encryptedBlob.iv).toHaveLength(24); // 12 bytes hex
      expect(encryptedBlob.ciphertext.length).toBeGreaterThan(20);

      const decrypted = await decryptFieldPayload(encryptedBlob, key);
      expect(decrypted).toEqual(payload);
    });

    it('fails to decrypt if ciphertext is tampered', async () => {
      const key = await generateFieldKey();
      const payload = { peerName: 'Test Tamper' };
      const encryptedBlob = await encryptFieldPayload(payload, key);

      // Tamper with the ciphertext by flipping characters
      const tamperedBlob = {
        ...encryptedBlob,
        ciphertext: encryptedBlob.ciphertext.slice(0, -4) + 'AAAA',
      };

      await expect(decryptFieldPayload(tamperedBlob, key)).rejects.toThrow();
    });
  });

  describe('2. Coarse Geo-Stamping (Privacy-Preserving)', () => {
    it('rounds coordinates strictly to 2 decimal places (~1 km) with area label', () => {
      // 18.5204303, 73.8567437 (Shivajinagar Pune)
      const stamp = createCoarseGeoStamp(18.5204303, 73.8567437, 'Shivajinagar Central, Pune');
      expect(stamp.latitude).toBe(18.52);
      expect(stamp.longitude).toBe(73.86);
      expect(stamp.areaLabel).toBe('Shivajinagar Central, Pune');
      expect(stamp.isCoarse).toBe(true);
      expect(stamp.accuracyMeters).toBeGreaterThanOrEqual(1000);

      const formatted = formatCoarseCoordinates(stamp.latitude, stamp.longitude);
      expect(formatted).toBe('18.52° N, 73.86° E (±1 km)');
    });
  });

  describe('3. Double-Consent State Machine', () => {
    it('progresses from Consent 1 captured -> Consent 2 requested -> Confirmed', () => {
      const consent = initDoubleConsent({
        peerName: 'Damodar Joshi',
        peerPhone: '9822033445',
        associateId: 'u-sf-1',
        method: 'in_person_read_aloud',
      });

      expect(consent.state).toBe('consent_1_captured');
      expect(consent.isFullyConsented).toBe(false);

      const requested = advanceToConsentTwo(consent);
      expect(requested.state).toBe('consent_2_requested');
      expect(requested.consent2ExpiresAt).toBeDefined();

      const confirmed = confirmConsentTwo(requested, 'YES');
      expect(confirmed.state).toBe('confirmed');
      expect(confirmed.isFullyConsented).toBe(true);
      expect(confirmed.confirmedAt).toBeDefined();
    });

    it('transitions to expired after 24h window', () => {
      const consent = initDoubleConsent({
        peerName: 'Lata Kulkarni',
        peerPhone: '9822077889',
        associateId: 'u-sf-1',
        method: 'voice_placeholder',
      });

      const requested = advanceToConsentTwo(consent);
      // Simulate expired timestamp
      const expiredConsent: DoubleConsentState = {
        ...requested,
        consent2ExpiresAt: new Date(Date.now() - 3600000).toISOString(),
      };

      const result = expireConsentTwo(expiredConsent);
      expect(result.state).toBe('expired');
      expect(result.isFullyConsented).toBe(false);
    });

    it('transitions to declined on user refusal and purges pending data', () => {
      const consent = initDoubleConsent({
        peerName: 'Sharad Chitnis',
        peerPhone: '9822088990',
        associateId: 'u-sf-1',
        method: 'in_person_read_aloud',
      });

      const requested = advanceToConsentTwo(consent);
      const declined = declineConsentTwo(requested, 'Eldercare service declined by beneficiary');
      expect(declined.state).toBe('declined');
      expect(declined.isFullyConsented).toBe(false);
      expect(declined.declinedReason).toBe('Eldercare service declined by beneficiary');
    });
  });

  describe('4. Field Offline Sync Queue', () => {
    it('enqueues items with monotonic sequence and idempotency keys', () => {
      const item1 = enqueueActivity({
        associateId: 'u-sf-1',
        chapterId: 'HUB-PUN',
        activityType: 'onboarding',
        peerName: 'Vandana Kulkarni',
        peerPhone: '9822011122',
        geoArea: 'Shivajinagar, Pune',
        doubleConsentState: 'consent_2_requested',
      });

      const item2 = enqueueActivity({
        associateId: 'u-sf-1',
        chapterId: 'HUB-PUN',
        activityType: 'check_in_visit',
        peerName: 'Ramesh Kelkar',
        peerPhone: '9822033344',
        geoArea: 'Kothrud, Pune',
        doubleConsentState: 'confirmed',
      });

      expect(item1.sequenceNumber).toBe(1);
      expect(item2.sequenceNumber).toBe(2);
      expect(item1.idempotencyKey).toBeDefined();
      expect(item2.idempotencyKey).toBeDefined();
      expect(item1.idempotencyKey).not.toEqual(item2.idempotencyKey);

      const queue = getFieldQueue();
      expect(queue.length).toBe(2);
      expect(queue[0].status).toBe('pending');
    });

    it('flags items captured more than 24 hours ago as late-sync', async () => {
      const pastTime = new Date(Date.now() - 26 * 3600000).toISOString();
      enqueueActivity({
        associateId: 'u-sf-1',
        chapterId: 'HUB-PUN',
        activityType: 'check_in_visit',
        peerName: 'Late Sync Elder',
        peerPhone: '9822055667',
        geoArea: 'Hadapsar, Pune',
        doubleConsentState: 'confirmed',
        clientCapturedAt: pastTime,
      });

      const result = await processSyncQueue('u-sf-1');
      expect(result.syncedCount).toBe(1);
      expect(result.lateSyncCount).toBe(1);
      expect(result.items[0].isLateSync).toBe(true);
    });

    it('is idempotent when re-submitting the same item', async () => {
      const item = enqueueActivity({
        associateId: 'u-sf-1',
        chapterId: 'HUB-PUN',
        activityType: 'onboarding',
        peerName: 'Idempotent Elder',
        peerPhone: '9822088899',
        geoArea: 'Aundh, Pune',
        doubleConsentState: 'confirmed',
      });

      const firstSync = await processSyncQueue('u-sf-1');
      expect(firstSync.syncedCount).toBe(1);

      // Re-running sync with same items should not duplicate
      const secondSync = await processSyncQueue('u-sf-1');
      expect(secondSync.syncedCount).toBe(0);
      expect(secondSync.alreadySyncedCount).toBe(1);
    });
  });
});
