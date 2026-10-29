/**
 * Impact Packs & Tamper-Evident Document Generator
 * Vayoshreshtha Ecosystem Layer 1 (Telemetry & Policy Evidence)
 *
 * Implements:
 * - 4 Standard Policy/CSR Templates
 * - Maker-Checker Lifecycle: Draft (PM) -> Review -> Released (NM) -> Revoked
 * - WebCrypto SHA-256 Tamper-Evident Hash Generation
 * - Verification Code Generation (VV-XXXX-XXXX)
 * - Synthetic Data Watermark Enforcement
 */

export type PackTemplateId =
  | 'csr_impact_brief'
  | 'govt_health_brief'
  | 'insurance_age_bar_evidence'
  | 'elder_protection_evidence';

export type PackAudience = 'CSR' | 'Government' | 'Insurance' | 'Legal' | 'Public';

export type PackStatus = 'draft' | 'under_review' | 'released' | 'revoked';

export interface ImpactPack {
  id: string;
  code: string; // e.g. VV-7492-8194
  title: string;
  templateId: PackTemplateId;
  audience: PackAudience;
  status: PackStatus;
  summary: string;
  chapterFilter: string; // e.g. 'all' or 'pune'
  dateRange: { start: string; end: string };
  metrics: Record<string, string | number>;
  syntheticWatermark: string;
  sha256Hash?: string;
  createdBy: { id: string; name: string; role: string };
  reviewedBy?: { id: string; name: string; role: string };
  createdAt: string;
  releasedAt?: string;
}

export const WATERMARK_TEXT = 'SYNTHETIC PILOT DATA · FOR EVALUATION ONLY · VAYOH VIKAS';

/**
 * Generate cryptographic SHA-256 hash of an object or string using WebCrypto
 */
export async function calculateSha256Hex(data: string | Uint8Array): Promise<string> {
  const bytes = typeof data === 'string' ? new TextEncoder().encode(data) : data;
  if (typeof crypto !== 'undefined' && crypto.subtle) {
    const hashBuffer = await crypto.subtle.digest('SHA-256', bytes as any);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map((b) => b.toString(16).padStart(2, '0')).join('');
  }
  // Fallback for non-subtle test environments
  let hash = 0;
  for (let i = 0; i < bytes.length; i++) {
    hash = (hash << 5) - hash + bytes[i];
    hash |= 0;
  }
  return Math.abs(hash).toString(16).padStart(64, '0');
}

/**
 * Generates an 8-character verification code: VV-XXXX-XXXX
 */
export function generateVerificationCode(): string {
  const chars = '23456789ABCDEFGHJKMNPQRSTVWXYZ';
  let p1 = '';
  let p2 = '';
  for (let i = 0; i < 4; i++) {
    p1 += chars.charAt(Math.floor(Math.random() * chars.length));
    p2 += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return `VV-${p1}-${p2}`;
}

export const TEMPLATE_CONFIGS: Record<
  PackTemplateId,
  {
    name: string;
    description: string;
    defaultAudience: PackAudience;
    standardMetrics: Record<string, string | number>;
  }
> = {
  csr_impact_brief: {
    name: 'CSR Impact & Chapter Reach Brief',
    description: 'Senior citizens reached, Ekta Hub sessions conducted, volunteer hours, and grocery voucher redemptions.',
    defaultAudience: 'CSR',
    standardMetrics: {
      activeSeniorsReached: 1240,
      totalHubSessions: 312,
      volunteerHoursLogged: 4850,
      vouchersDistributed: 820,
      voucherRedemptionRate: '94.2%',
      anonymityThresholdSatisfied: 'k ≥ 5 Confirmed',
    },
  },
  govt_health_brief: {
    name: 'Government & ABDM Health Coverage Brief',
    description: 'Anonymised vaccination rates, 90-day blood pressure control cohorts, and preventive screening engagement.',
    defaultAudience: 'Government',
    standardMetrics: {
      screenedCohortSize: 1105,
      completedPrimaryVaccination: '78.4%',
      boosterDoseCoverage: '41.2%',
      systolicControlStabilised: '68.5%',
      uncoveredHighRiskSuppressed: '< 5 (Protected)',
      diagnosticRecordStripped: '100% Non-Clinical Only',
    },
  },
  insurance_age_bar_evidence: {
    name: 'Insurance Age-Bar Exclusion Evidence Dossier',
    description: 'Empirical data on seniors (65–85) excluded by age-bar policies despite high self-care adherence and vital stability.',
    defaultAudience: 'Insurance',
    standardMetrics: {
      excludedApplicantsAnalyzed: 412,
      meanAdherenceIndex: '92.4%',
      uninsuredAgeRange: '68 to 86 years',
      willingnessToCoPay: '84.6%',
      hospitalizationAvoidanceEstimate: '38%',
      advocacySignoffStatus: 'Verified by Medical Advisory',
    },
  },
  elder_protection_evidence: {
    name: 'Elder Protection & Legal Rights Aggregated Dossier',
    description: 'Summary of pro-bono civil inquiries: property dispute mediation, pension access, and maintenance act petitions.',
    defaultAudience: 'Legal',
    standardMetrics: {
      totalIntakesResolved: 184,
      propertyDisputesMediated: 72,
      pensionGrievancesFiled: 64,
      avgResolutionTurnaroundDays: 18,
      confidentialCaseDetailMasking: '100% Client Blinded',
      advocateNetworkPartners: 14,
    },
  },
};

/**
 * In-memory Mock Registry of Impact Packs with Seed Data
 */
let registeredPacks: ImpactPack[] = [
  {
    id: 'pack-001',
    code: 'VV-8392-1049',
    title: 'Q3 2026 Maharashtra CSR Comprehensive Impact Brief',
    templateId: 'csr_impact_brief',
    audience: 'CSR',
    status: 'released',
    summary: 'Quarterly evidence of senior engagement across Pune and Mumbai Ekta Hubs, certifying 4,850 volunteer hours.',
    chapterFilter: 'all',
    dateRange: { start: '2026-07-01', end: '2026-09-30' },
    metrics: TEMPLATE_CONFIGS.csr_impact_brief.standardMetrics,
    syntheticWatermark: WATERMARK_TEXT,
    sha256Hash: 'a718b940e53a2512f458e0a4f5693bf60cb8120d91295e8e3dfbe24cf3bca41e',
    createdBy: { id: 'usr-pm-1', name: 'Pooja Verma', role: 'Programme Manager' },
    reviewedBy: { id: 'usr-nm-1', name: 'Dr. Anita Joshi', role: 'National Manager' },
    createdAt: '2026-10-01T10:00:00Z',
    releasedAt: '2026-10-02T14:30:00Z',
  },
  {
    id: 'pack-002',
    code: 'VV-4198-7721',
    title: 'Senior Health & Vaccination Coverage Brief (Pune Hubs)',
    templateId: 'govt_health_brief',
    audience: 'Government',
    status: 'released',
    summary: 'Public health aggregated report demonstrating 78.4% completed primary vaccination and blood pressure stability.',
    chapterFilter: 'pune',
    dateRange: { start: '2026-08-01', end: '2026-10-15' },
    metrics: TEMPLATE_CONFIGS.govt_health_brief.standardMetrics,
    syntheticWatermark: WATERMARK_TEXT,
    sha256Hash: '3f8e52a945c71b695123d45aa98c117e3f267981b22e1bdfc08f44158485c219',
    createdBy: { id: 'usr-pm-1', name: 'Pooja Verma', role: 'Programme Manager' },
    reviewedBy: { id: 'usr-nm-1', name: 'Dr. Anita Joshi', role: 'National Manager' },
    createdAt: '2026-10-16T09:00:00Z',
    releasedAt: '2026-10-18T11:20:00Z',
  },
  {
    id: 'pack-003',
    code: 'VV-9901-4432',
    title: 'Insurance Exclusion Study: Seniors Age 68-85',
    templateId: 'insurance_age_bar_evidence',
    audience: 'Insurance',
    status: 'draft',
    summary: 'Working draft on 412 rejected health cover applications with demonstrated 92.4% medication adherence.',
    chapterFilter: 'all',
    dateRange: { start: '2026-06-01', end: '2026-10-25' },
    metrics: TEMPLATE_CONFIGS.insurance_age_bar_evidence.standardMetrics,
    syntheticWatermark: WATERMARK_TEXT,
    createdBy: { id: 'usr-pm-1', name: 'Pooja Verma', role: 'Programme Manager' },
    createdAt: '2026-10-25T15:00:00Z',
  },
];

export function getImpactPacks(): ImpactPack[] {
  return [...registeredPacks];
}

export function getImpactPackById(id: string): ImpactPack | undefined {
  return registeredPacks.find((p) => p.id === id || p.code === id);
}

export function findPackByCodeOrHash(query: string): ImpactPack | undefined {
  const clean = query.trim().toUpperCase();
  const cleanHex = query.trim().toLowerCase();
  return registeredPacks.find(
    (p) =>
      p.code.toUpperCase() === clean ||
      (p.sha256Hash && p.sha256Hash.toLowerCase() === cleanHex)
  );
}

export async function createImpactPack(params: {
  title: string;
  templateId: PackTemplateId;
  audience: PackAudience;
  chapterFilter: string;
  summary: string;
  dateRange: { start: string; end: string };
  creator: { id: string; name: string; role: string };
}): Promise<ImpactPack> {
  const template = TEMPLATE_CONFIGS[params.templateId];
  const newPack: ImpactPack = {
    id: `pack-${Date.now()}`,
    code: generateVerificationCode(),
    title: params.title,
    templateId: params.templateId,
    audience: params.audience,
    status: 'draft',
    summary: params.summary,
    chapterFilter: params.chapterFilter,
    dateRange: params.dateRange,
    metrics: { ...template.standardMetrics },
    syntheticWatermark: WATERMARK_TEXT,
    createdBy: params.creator,
    createdAt: new Date().toISOString(),
  };

  registeredPacks.unshift(newPack);
  return newPack;
}

export async function submitPackForReview(id: string): Promise<ImpactPack> {
  const pack = registeredPacks.find((p) => p.id === id);
  if (!pack) throw new Error(`Pack ${id} not found`);
  if (pack.status !== 'draft') throw new Error(`Only draft packs can be submitted`);
  pack.status = 'under_review';
  return pack;
}

export async function releaseImpactPack(
  id: string,
  reviewer: { id: string; name: string; role: string }
): Promise<ImpactPack> {
  const pack = registeredPacks.find((p) => p.id === id);
  if (!pack) throw new Error(`Pack ${id} not found`);
  if (pack.status === 'released') return pack;

  // Compute canonical deterministic hash over payload
  const canonicalPayload = JSON.stringify({
    code: pack.code,
    title: pack.title,
    templateId: pack.templateId,
    audience: pack.audience,
    summary: pack.summary,
    metrics: pack.metrics,
    dateRange: pack.dateRange,
    syntheticWatermark: pack.syntheticWatermark,
    createdBy: pack.createdBy.id,
    reviewedBy: reviewer.id,
  });

  const sha256 = await calculateSha256Hex(canonicalPayload);

  pack.status = 'released';
  pack.sha256Hash = sha256;
  pack.reviewedBy = reviewer;
  pack.releasedAt = new Date().toISOString();

  return pack;
}

export function revokeImpactPack(id: string): ImpactPack {
  const pack = registeredPacks.find((p) => p.id === id);
  if (!pack) throw new Error(`Pack ${id} not found`);
  pack.status = 'revoked';
  return pack;
}
