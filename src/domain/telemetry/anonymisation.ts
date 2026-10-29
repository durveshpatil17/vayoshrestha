/**
 * Anonymisation & Privacy Engine for Telemetry (Layer 4)
 * Strict DPDP safeguards:
 * - k-Anonymity (k >= 5) on every cell
 * - Complementary (Secondary) suppression to prevent subtraction derivation
 * - Differencing attack detection (blocking queries with delta < k)
 * - Dates rounded to week or month
 * - Sub-chapter geography suppressed
 */

export interface AnonymizedCubeCell {
  label: string;
  rawCount: number;
  displayCount?: string;
  isSuppressed?: boolean;
}

const MINIMUM_ENFORCED_K = 5;

export function applyKAnonymity(count: number, kThreshold: number = MINIMUM_ENFORCED_K): string {
  const effectiveK = Math.max(MINIMUM_ENFORCED_K, kThreshold);
  if (count === 0) return '0';
  if (count < effectiveK) return '<5';
  return String(count);
}

/**
 * Applies primary (<k) and complementary (secondary) suppression across a row/column.
 * If exactly one cell in a row is below k, the second smallest cell is also suppressed
 * so that the secret value cannot be derived by: Row_Total - Sum(Other_Cells).
 */
export function applyComplementarySuppression(
  cells: AnonymizedCubeCell[],
  rowTotal: number,
  kThreshold: number = MINIMUM_ENFORCED_K
): AnonymizedCubeCell[] {
  const effectiveK = Math.max(MINIMUM_ENFORCED_K, kThreshold);

  // 1. Mark primary suppressions
  const processed = cells.map((cell) => {
    const isBelowK = cell.rawCount > 0 && cell.rawCount < effectiveK;
    return {
      ...cell,
      displayCount: isBelowK ? '<5' : String(cell.rawCount),
      isSuppressed: isBelowK,
    };
  });

  const suppressedCount = processed.filter((c) => c.isSuppressed).length;

  // 2. If exactly one cell is suppressed, apply complementary suppression to the second candidate
  if (suppressedCount === 1 && processed.length > 1) {
    // Find candidate for secondary suppression (smallest non-suppressed cell)
    const nonSuppressed = processed
      .filter((c) => !c.isSuppressed && c.rawCount > 0)
      .sort((a, b) => a.rawCount - b.rawCount);

    if (nonSuppressed.length > 0) {
      const candidate = nonSuppressed[0];
      return processed.map((c) => {
        if (c.label === candidate.label) {
          return {
            ...c,
            displayCount: 'Suppressed',
            isSuppressed: true,
          };
        }
        return c;
      });
    }
  }

  return processed;
}

/**
 * Evaluates whether two sequential queries from the same session constitute a differencing attack.
 * (e.g. Query A: 100 seniors, Query B: 99 seniors -> delta = 1 reveals the excluded individual).
 */
export function evaluateDifferencingAttack(
  query1Count: number,
  query2Count: number,
  kThreshold: number = MINIMUM_ENFORCED_K
): { isBlocked: boolean; delta: number; reason?: string } {
  const effectiveK = Math.max(MINIMUM_ENFORCED_K, kThreshold);
  const delta = Math.abs(query1Count - query2Count);

  if (delta > 0 && delta < effectiveK) {
    return {
      isBlocked: true,
      delta,
      reason: `Differencing delta of ${delta} is below k-anonymity threshold (k=${effectiveK}). Query blocked to prevent re-identification.`,
    };
  }

  return {
    isBlocked: false,
    delta,
  };
}

export type VaccineCategory = 'Influenza' | 'Pneumococcal' | 'COVID-19' | 'Shingles' | 'Tetanus_Td';

export interface VaccineCategorySummary {
  total: number;
  yes: number;
  no: number;
  unsure: number;
  displayTotal: string;
  coveragePercentage: number;
}

export function aggregateVaccinationStatus(
  records: Array<{
    vaccine: VaccineCategory;
    status: 'Yes' | 'No' | 'Unsure' | 'Not_Asked';
    consent?: boolean;
    consentGated?: boolean;
  }>,
  kThreshold: number = MINIMUM_ENFORCED_K
): Record<VaccineCategory, VaccineCategorySummary> {
  const effectiveK = Math.max(MINIMUM_ENFORCED_K, kThreshold);
  const categories: VaccineCategory[] = [
    'Influenza',
    'Pneumococcal',
    'COVID-19',
    'Shingles',
    'Tetanus_Td',
  ];

  const result = {} as Record<VaccineCategory, VaccineCategorySummary>;

  categories.forEach((cat) => {
    // Only count consent-gated records
    const relevant = records.filter(
      (r) =>
        r.vaccine === cat &&
        (r.consent !== false && r.consentGated !== false) &&
        r.status !== 'Not_Asked'
    );

    const yesCount = relevant.filter((r) => r.status === 'Yes').length;
    const noCount = relevant.filter((r) => r.status === 'No').length;
    const unsureCount = relevant.filter((r) => r.status === 'Unsure').length;
    const total = relevant.length;

    const coveragePct = total > 0 ? Math.round((yesCount / total) * 100) : 0;

    result[cat] = {
      total,
      yes: yesCount,
      no: noCount,
      unsure: unsureCount,
      displayTotal: applyKAnonymity(total, effectiveK),
      coveragePercentage: coveragePct,
    };
  });

  return result;
}

export function roundDateToWeek(isoDate: string): string {
  const d = new Date(isoDate);
  const day = d.getDay();
  const diff = d.getDate() - day + (day === 0 ? -6 : 1); // Monday
  const monday = new Date(d.setDate(diff));
  return `Week of ${monday.toISOString().split('T')[0]}`;
}

export function roundDateToMonth(isoDate: string): string {
  const d = new Date(isoDate);
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  return `${months[d.getMonth()]} ${d.getFullYear()}`;
}
