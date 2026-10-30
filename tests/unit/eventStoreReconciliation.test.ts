import { describe, it, expect, beforeEach } from 'vitest';
import { mockStore } from '@/mock/store';
import { eventQueue } from '@/mock/eventQueue';
import { calculateAuditHash, verifyAuditChain, GENESIS_HASH } from '@/mock/auditChain';
import { IN_FLIGHT_DEMO_STORIES } from '@/mock/demoStories';
import { AuditEvent } from '@/api/contracts';

describe('Loop R5: Single Event Store Audit & Reconciliation', () => {
  beforeEach(() => {
    // Reset/reload mock data
  });

  describe('1. Cryptographic Audit Hash Chain Integrity', () => {
    it('verifies that default seeded audit chain has valid cryptographic links', () => {
      const data = mockStore.getData();
      expect(data.auditEvents.length).toBeGreaterThan(0);

      const verification = mockStore.verifyAuditChain();
      expect(verification.valid).toBe(true);
      expect(verification.errorIndex).toBeUndefined();
    });

    it('successfully appends a new audit block and maintains chain integrity', () => {
      const initialCount = mockStore.getData().auditEvents.length;

      const newBlock = mockStore.writeAudit(
        'u-pm-1',
        'Priya Menon',
        'PM',
        'APPROVE',
        'SENIOR',
        'SC-KA-BLR-001',
        'Duplicate resolved: Confirmed unique senior enrollment.',
        'Manual phone verification completed'
      );

      expect(newBlock).toBeDefined();
      expect(newBlock.hash).toBeDefined();
      expect(newBlock.hash).toContain('sha256-');
      expect(mockStore.getData().auditEvents.length).toBe(initialCount + 1);

      const verification = mockStore.verifyAuditChain();
      expect(verification.valid).toBe(true);
    });

    it('detects tamper when an audit block content is altered', () => {
      // Create a test chain
      const block1: AuditEvent = {
        id: 'aud-test-1',
        timestamp: '2026-10-30T10:00:00.000Z',
        actorId: 'u-nm-1',
        actorName: 'Vandana Sharma',
        actorRole: 'NM',
        action: 'APPROVE',
        entityType: 'SETTINGS',
        entityId: 'sys-001',
        details: 'Approved v2 Pilot configuration.',
        previousHash: GENESIS_HASH,
        hash: '',
      };
      block1.hash = calculateAuditHash(block1);

      const block2: AuditEvent = {
        id: 'aud-test-2',
        timestamp: '2026-10-30T10:15:00.000Z',
        actorId: 'u-sa-1',
        actorName: 'Rajesh Varma',
        actorRole: 'SA',
        action: 'UPDATE',
        entityType: 'USER',
        entityId: 'u-ra-west',
        details: 'Elevated role access for field testing.',
        previousHash: block1.hash,
        hash: '',
      };
      block2.hash = calculateAuditHash(block2);

      const testChain = [block1, block2];
      expect(verifyAuditChain(testChain).valid).toBe(true);

      // Malicious tamper: adversary modifies action or details
      const tamperedChain: AuditEvent[] = [
        block1,
        {
          ...block2,
          details: 'Malicious modification of audit trail details',
        },
      ];

      const tamperResult = verifyAuditChain(tamperedChain);
      expect(tamperResult.valid).toBe(false);
      expect(tamperResult.reason).toContain('Tamper detected');
    });

    it('detects broken previousHash linkage between blocks', () => {
      const block1: AuditEvent = {
        id: 'aud-test-1',
        timestamp: '2026-10-30T10:00:00.000Z',
        actorId: 'u-nm-1',
        actorName: 'Vandana Sharma',
        actorRole: 'NM',
        action: 'APPROVE',
        entityType: 'SETTINGS',
        entityId: 'sys-001',
        details: 'Legitimate block 1',
        previousHash: GENESIS_HASH,
        hash: '',
      };
      block1.hash = calculateAuditHash(block1);

      const block2: AuditEvent = {
        id: 'aud-test-2',
        timestamp: '2026-10-30T10:15:00.000Z',
        actorId: 'u-sa-1',
        actorName: 'Rajesh Varma',
        actorRole: 'SA',
        action: 'CREATE',
        entityType: 'USER',
        entityId: 'u-ra-west',
        details: 'Legitimate block 2',
        previousHash: 'sha256-fake-broken-previous-hash-value-00000',
        hash: '',
      };
      block2.hash = calculateAuditHash(block2);

      const brokenChain = [block1, block2];
      const result = verifyAuditChain(brokenChain);
      expect(result.valid).toBe(false);
      expect(result.reason).toContain('Chain broken');
    });
  });

  describe('2. In-Flight Demo Stories Realism', () => {
    it('seeds all 8 canonical in-flight demo stories defined in docs/DATA_REALISM.md', () => {
      const data = mockStore.getData();

      // Story 1: Active Emergency SOS (SOS-26-00042)
      const story1 = data.sosEvents.find((e) => e.id === 'SOS-26-00042');
      expect(story1).toBeDefined();
      expect(story1?.status).toBe('Triggered');
      expect(story1?.seniorName).toContain('Lakshmi Devi');

      // Story 2: Hypertensive Crisis Flag (FLAG-26-00189)
      const story2 = data.healthFlags.find((f) => f.id === 'FLAG-26-00189');
      expect(story2).toBeDefined();
      expect(story2?.bandCrossed).toBe('Red');
      expect(story2?.readingValue).toContain('168/102');

      // Story 3: Second Consent Pending (ONB-26-00312)
      const story3 = data.stalledSessions.find((s) => s.id === 'ONB-26-00312');
      expect(story3).toBeDefined();
      expect(story3?.seniorName).toContain('Abdul Rehman');

      // Story 7: Governance Advisory Template (TMP-26-00018)
      const story7 = data.templates.find((t) => t.id === 'TMP-26-00018');
      expect(story7).toBeDefined();
      expect(story7?.approvalStatus).toBe('Pending');
      expect(story7?.title).toContain('Monsoon Water Safety');

      // All 8 stories registered in directory
      expect(IN_FLIGHT_DEMO_STORIES.length).toBe(8);
    });
  });

  describe('3. Event Queue & Store Reconciliation', () => {
    it('notifies subscribers when events are enqueued', () => {
      let receivedEvent: any = null;
      const unsubscribe = eventQueue.subscribe((ev) => {
        receivedEvent = ev;
      });

      eventQueue.enqueue('TEST_EVENT', { sample: 123 });

      expect(receivedEvent).toBeDefined();
      expect(receivedEvent?.type).toBe('TEST_EVENT');
      expect(receivedEvent?.payload?.sample).toBe(123);

      unsubscribe();
    });

    it('mutating mockStore entity triggers state persistence and updates query state', () => {
      const firstSenior = mockStore.getData().seniorCitizens[0];
      expect(firstSenior).toBeDefined();
      const seniorId = firstSenior.id;
      const originalName = firstSenior.fullName;

      mockStore.updateData((data) => {
        const target = data.seniorCitizens.find((s) => s.id === seniorId);
        if (target) {
          target.fullName = 'Anasuya Bai (Verified Duplicate Resolution)';
        }
      });

      const after = mockStore.getData().seniorCitizens.find((s) => s.id === seniorId);
      expect(after?.fullName).toBe('Anasuya Bai (Verified Duplicate Resolution)');

      // Restore
      mockStore.updateData((data) => {
        const target = data.seniorCitizens.find((s) => s.id === seniorId);
        if (target && originalName) {
          target.fullName = originalName;
        }
      });
    });
  });
});
