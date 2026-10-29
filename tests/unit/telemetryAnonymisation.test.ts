import { describe, it, expect } from 'vitest';
import {
  applyKAnonymity,
  applyComplementarySuppression,
  evaluateDifferencingAttack,
  aggregateVaccinationStatus,
  AnonymizedCubeCell,
} from '@/domain/telemetry/anonymisation';

describe('Layer 4 — Anonymisation Engine & Privacy Safeguards (DPDP Compliance)', () => {
  const K_THRESHOLD = 5;

  describe('1. k-Anonymity (k >= 5) Suppression', () => {
    it('suppresses counts strictly below k=5 to "<5"', () => {
      expect(applyKAnonymity(0, K_THRESHOLD)).toBe('0');
      expect(applyKAnonymity(1, K_THRESHOLD)).toBe('<5');
      expect(applyKAnonymity(3, K_THRESHOLD)).toBe('<5');
      expect(applyKAnonymity(4, K_THRESHOLD)).toBe('<5');
      expect(applyKAnonymity(5, K_THRESHOLD)).toBe('5');
      expect(applyKAnonymity(42, K_THRESHOLD)).toBe('42');
    });

    it('never allows k threshold to be configured below 5', () => {
      // If someone attempts k=3, engine must enforce minimum 5
      expect(applyKAnonymity(4, 3)).toBe('<5');
    });
  });

  describe('2. Complementary (Secondary) Suppression', () => {
    it('suppresses a second cell in a row if only one cell is below k, preventing subtraction derivation', () => {
      // Row: Male (3) + Female (20) = Total (23)
      // Without complementary suppression: Total (23) - Female (20) = Male (3) -> Privacy Breach!
      const row: AnonymizedCubeCell[] = [
        { label: 'Male', rawCount: 3 },
        { label: 'Female', rawCount: 20 },
      ];

      const result = applyComplementarySuppression(row, 23, K_THRESHOLD);
      // Both cells must be suppressed because deriving 3 from 23-20 is trivial
      expect(result.find((c) => c.label === 'Male')?.displayCount).toBe('<5');
      expect(result.find((c) => c.label === 'Female')?.displayCount).toBe('Suppressed');
    });

    it('does not apply complementary suppression if at least two cells are naturally suppressed', () => {
      // Row: Cat A (2) + Cat B (3) + Cat C (20) = Total (25)
      // Total (25) - Cat C (20) = 5 (sum of A+B). Neither A nor B can be uniquely deduced!
      const row: AnonymizedCubeCell[] = [
        { label: 'Cat A', rawCount: 2 },
        { label: 'Cat B', rawCount: 3 },
        { label: 'Cat C', rawCount: 20 },
      ];

      const result = applyComplementarySuppression(row, 25, K_THRESHOLD);
      expect(result.find((c) => c.label === 'Cat A')?.displayCount).toBe('<5');
      expect(result.find((c) => c.label === 'Cat B')?.displayCount).toBe('<5');
      expect(result.find((c) => c.label === 'Cat C')?.displayCount).toBe('20');
    });
  });

  describe('3. Query Differencing Attack Protection', () => {
    it('detects and blocks differencing query combinations where delta < k', () => {
      // Query 1: Seniors in Pune (Count: 100)
      // Query 2: Seniors in Pune excluding Ramesh (Count: 99)
      // Delta = 1 (< k=5) -> Differencing attack revealing Ramesh!
      const query1Count = 100;
      const query2Count = 99;

      const evalResult = evaluateDifferencingAttack(query1Count, query2Count, K_THRESHOLD);
      expect(evalResult.isBlocked).toBe(true);
      expect(evalResult.reason).toContain('Differencing delta');
    });

    it('allows queries where delta >= k', () => {
      const query1Count = 100;
      const query2Count = 88; // delta = 12 >= 5

      const evalResult = evaluateDifferencingAttack(query1Count, query2Count, K_THRESHOLD);
      expect(evalResult.isBlocked).toBe(false);
    });
  });

  describe('4. Coarse Vaccination Status Aggregation', () => {
    it('aggregates across 5 vaccine categories with consent gating', () => {
      const sampleRecords = [
        { vaccine: 'Influenza', status: 'Yes', consent: true },
        { vaccine: 'Influenza', status: 'Yes', consent: true },
        { vaccine: 'Influenza', status: 'No', consent: true },
        { vaccine: 'Influenza', status: 'Yes', consent: false }, // consent revoked!
        { vaccine: 'COVID-19', status: 'Yes', consent: true },
        { vaccine: 'Pneumococcal', status: 'Unsure', consent: true },
      ];

      const summary = aggregateVaccinationStatus(sampleRecords as any, K_THRESHOLD);
      expect(summary.Influenza.total).toBe(3); // excludes consent=false
      expect(summary.Influenza.yes).toBe(2);
      expect(summary.Influenza.displayTotal).toBe('<5'); // 3 is < 5
    });
  });
});
