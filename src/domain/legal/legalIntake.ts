/**
 * Pro-Bono Legal Intake Domain Logic
 * Vayoshreshtha Ecosystem Layer 2 (Legal Aid & Rights Protection)
 *
 * Implements:
 * - Permanent Non-Legal Advice Statutory Notice
 * - Privacy Isolation: Staff see metadata only; Verified Advocates see case content
 * - Standard Policy Evidence Closure Codes (e.g. Age-bar exclusion, Maintenance Act)
 */

export type LegalCaseCategory =
  | 'property_inheritance'
  | 'maintenance_act'
  | 'pension_epfo'
  | 'insurance_exclusion'
  | 'elder_abuse_protection';

export type LegalClosureCode =
  | 'declined_age_bar'
  | 'declined_no_cover'
  | 'settled_maintenance_act'
  | 'mediated_community_settlement'
  | 'pension_claim_sanctioned'
  | 'ongoing_advocacy';

export interface LegalIntakeRecord {
  id: string; // e.g. LEG-2026-081
  seniorId: string;
  seniorName: string;
  category: LegalCaseCategory;
  region: string;
  assignedAdvocateId: string;
  assignedAdvocateName: string;
  partnerFirm: string;
  status: 'pending_intake' | 'advocate_review' | 'mediation_active' | 'closed';
  closureCode?: LegalClosureCode;
  submittedAt: string;
  closedAt?: string;
  // Confidential Content (Partner Only)
  confidentialNarrative: string;
  contestedParties: string;
  policyExclusionDetails?: string;
  isClientDecrypted?: boolean;
}

export const LEGAL_DISCLAIMER_NOTICE =
  'LEGAL NOTICE: Vayoh Vikas is an NGO support ecosystem and is not a law firm. It does not provide legal representation or counsel. All legal intakes are mediated pro-bono by independent verified advocates enrolled with the Bar Council of India under the Senior Citizens Act 2007.';

export const CLOSURE_CODE_LABELS: Record<LegalClosureCode, string> = {
  declined_age_bar: 'Declined: Age-bar exclusion (Insurer refused coverage due to age)',
  declined_no_cover: 'Declined: No statutory or commercial coverage available',
  settled_maintenance_act: 'Resolved via Senior Citizens Act 2007 (Sub-Divisional Magistrate)',
  mediated_community_settlement: 'Settled via Ekta Hub community elder mediation',
  pension_claim_sanctioned: 'EPFO / Central Pension grievance sanctioned',
  ongoing_advocacy: 'Active ongoing legal advocacy / In-court representation',
};

// Seed Cases
export let LEGAL_INTAKE_REGISTRY: LegalIntakeRecord[] = [
  {
    id: 'LEG-2026-081',
    seniorId: 'SC-PUN-001',
    seniorName: 'Anusuya Deshpande',
    category: 'property_inheritance',
    region: 'pune',
    assignedAdvocateId: 'adv-vidhi-1',
    assignedAdvocateName: 'Adv. Sudhir Kulkarni',
    partnerFirm: 'Vidhi Centre for Senior Legal Aid',
    status: 'mediation_active',
    submittedAt: '2026-10-18T10:30:00Z',
    confidentialNarrative:
      'Co-owned family residential flat in Kothrud; younger son seeking eviction without providing alternative accommodation.',
    contestedParties: 'Younger son (Rajesh Deshpande)',
  },
  {
    id: 'LEG-2026-082',
    seniorId: 'SC-PUN-004',
    seniorName: 'Dattatray Joshi',
    category: 'maintenance_act',
    region: 'pune',
    assignedAdvocateId: 'adv-nyaya-2',
    assignedAdvocateName: 'Adv. Meenakshi Rao',
    partnerFirm: 'Nyaya Bandhu Pro-Bono Advocates',
    status: 'closed',
    closureCode: 'settled_maintenance_act',
    submittedAt: '2026-09-12T14:00:00Z',
    closedAt: '2026-10-10T16:00:00Z',
    confidentialNarrative:
      'Application under Section 5 of Maintenance & Welfare of Parents and Senior Citizens Act 2007 for monthly medical allowance.',
    contestedParties: 'Eldest daughter-in-law & son',
  },
  {
    id: 'LEG-2026-083',
    seniorId: 'SC-PUN-006',
    seniorName: 'Malati Kulkarni',
    category: 'insurance_exclusion',
    region: 'pune',
    assignedAdvocateId: 'adv-vidhi-1',
    assignedAdvocateName: 'Adv. Sudhir Kulkarni',
    partnerFirm: 'Vidhi Centre for Senior Legal Aid',
    status: 'closed',
    closureCode: 'declined_age_bar',
    submittedAt: '2026-08-05T09:00:00Z',
    closedAt: '2026-09-01T11:00:00Z',
    confidentialNarrative:
      'Senior age 74 excluded from retail critical illness policy renewal without medical rationale.',
    contestedParties: 'Private General Insurance Co.',
    policyExclusionDetails: 'Underwriting age threshold fixed at 65; renewal declined with zero claims history.',
  },
];

export function getLegalIntakeCases(): LegalIntakeRecord[] {
  return [...LEGAL_INTAKE_REGISTRY];
}

export function getLegalCaseById(id: string): LegalIntakeRecord | undefined {
  return LEGAL_INTAKE_REGISTRY.find((c) => c.id === id);
}

export function closeLegalCase(id: string, closureCode: LegalClosureCode): LegalIntakeRecord {
  const c = LEGAL_INTAKE_REGISTRY.find((x) => x.id === id);
  if (!c) throw new Error(`Case ${id} not found`);
  c.status = 'closed';
  c.closureCode = closureCode;
  c.closedAt = new Date().toISOString();
  return c;
}
