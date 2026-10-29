/**
 * Digital Voucher Domain Engine
 * Vayoshreshtha Ecosystem Layer 2 (Vouchers & Partner Redemption)
 *
 * Implements:
 * - 10-character Crockford Base-32 with Modulo-37 Check Digit
 * - Single-Use Idempotent Redemption State Machine
 * - Campaign Management & Face Value Allocation
 * - WhatsApp Delivery Simulation Integration
 */

export const CROCKFORD_ALPHABET = '0123456789ABCDEFGHJKMNPQRSTVWXYZ';

/**
 * Calculates Crockford modulo-37 check symbol
 */
export function calculateCrockfordCheckDigit(str: string): string {
  const clean = str.replace(/[^0-9A-Za-z]/g, '').toUpperCase();
  let sum = 0;
  for (let i = 0; i < clean.length; i++) {
    const val = CROCKFORD_ALPHABET.indexOf(clean[i]);
    if (val !== -1) {
      sum = (sum * 32 + val) % 37;
    }
  }
  const checkSymbols = '0123456789ABCDEFGHJKMNPQRSTVWXYZ*~$=U';
  return checkSymbols[sum % checkSymbols.length] || '0';
}

/**
 * Validates a complete Crockford voucher code including check digit
 */
export function validateCrockfordCode(code: string): boolean {
  const clean = code.replace(/[^0-9A-Za-z*~$=]/g, '').toUpperCase();
  if (clean.length < 9) return false;

  const payload = clean.slice(0, -1);
  const checkDigit = clean.slice(-1);
  const expected = calculateCrockfordCheckDigit(payload);
  return checkDigit === expected;
}

/**
 * Generates a formatted 10-char Crockford voucher code: XXXX-XXXX-C
 */
export function generateVoucherCode(): string {
  let payload = '';
  for (let i = 0; i < 8; i++) {
    const idx = Math.floor(Math.random() * CROCKFORD_ALPHABET.length);
    payload += CROCKFORD_ALPHABET[idx];
  }
  const check = calculateCrockfordCheckDigit(payload);
  return `${payload.slice(0, 4)}-${payload.slice(4, 8)}-${check}`;
}

export type VoucherStatus =
  | 'issued'
  | 'sent_via_whatsapp'
  | 'viewed'
  | 'redeemed'
  | 'expired'
  | 'revoked';

export interface VoucherCampaign {
  id: string;
  name: string;
  category: 'diagnostic' | 'grocery' | 'transport' | 'wellness';
  faceValueInr: number;
  totalAllocated: number;
  totalIssued: number;
  totalRedeemed: number;
  validFrom: string;
  validUntil: string;
  partnerIds: string[];
  status: 'draft' | 'active' | 'completed' | 'paused';
  notes: string;
}

export interface DigitalVoucher {
  id: string;
  code: string; // e.g. 7X9K-4MB2-A
  campaignId: string;
  campaignName: string;
  category: 'diagnostic' | 'grocery' | 'transport' | 'wellness';
  faceValueInr: number;
  seniorId: string;
  seniorName: string;
  seniorPhone: string;
  status: VoucherStatus;
  issuedAt: string;
  expiresAt: string;
  sentAt?: string;
  redeemedAt?: string;
  redeemedByPartnerId?: string;
  redeemedByPartnerName?: string;
}

// In-Memory Seed Campaigns
export let VOUCHER_CAMPAIGNS: VoucherCampaign[] = [
  {
    id: 'camp-diag-winter',
    name: 'Winter Preventive Diagnostic Health Screening',
    category: 'diagnostic',
    faceValueInr: 600,
    totalAllocated: 500,
    totalIssued: 340,
    totalRedeemed: 295,
    validFrom: '2026-10-01',
    validUntil: '2026-12-31',
    partnerIds: ['ptn-metropolis', 'ptn-thyrocare'],
    status: 'active',
    notes: 'Subsidised lipid profile, HbA1c, and serum creatinine for enrolled elders.',
  },
  {
    id: 'camp-nutri-fest',
    name: 'Ekta Nutrition & Grocery Support Drive',
    category: 'grocery',
    faceValueInr: 1000,
    totalAllocated: 400,
    totalIssued: 280,
    totalRedeemed: 240,
    validFrom: '2026-10-15',
    validUntil: '2026-11-30',
    partnerIds: ['ptn-kirana-network'],
    status: 'active',
    notes: 'Staple ration voucher valid across partner grocery stores in Pune & Mumbai.',
  },
  {
    id: 'camp-mobility-ride',
    name: 'Hospital Transport & Mobility Assistance',
    category: 'transport',
    faceValueInr: 350,
    totalAllocated: 300,
    totalIssued: 120,
    totalRedeemed: 88,
    validFrom: '2026-09-01',
    validUntil: '2026-12-15',
    partnerIds: ['ptn-city-cabs'],
    status: 'active',
    notes: 'Subsidised auto-rickshaw/cab trips to clinical appointments.',
  },
];

// In-Memory Seed Vouchers
export let REGISTERED_VOUCHERS: DigitalVoucher[] = [
  {
    id: 'vch-101',
    code: '7X9K-4MB2-K',
    campaignId: 'camp-diag-winter',
    campaignName: 'Winter Preventive Diagnostic Health Screening',
    category: 'diagnostic',
    faceValueInr: 600,
    seniorId: 'SC-PUN-001',
    seniorName: 'Anusuya Deshpande',
    seniorPhone: '+91 98220 11001',
    status: 'issued',
    issuedAt: '2026-10-20T10:00:00Z',
    expiresAt: '2026-12-31T23:59:59Z',
  },
  {
    id: 'vch-102',
    code: '3N8W-9PL5-Y',
    campaignId: 'camp-nutri-fest',
    campaignName: 'Ekta Nutrition & Grocery Support Drive',
    category: 'grocery',
    faceValueInr: 1000,
    seniorId: 'SC-PUN-001',
    seniorName: 'Anusuya Deshpande',
    seniorPhone: '+91 98220 11001',
    status: 'redeemed',
    issuedAt: '2026-10-16T11:00:00Z',
    expiresAt: '2026-11-30T23:59:59Z',
    redeemedAt: '2026-10-22T16:45:00Z',
    redeemedByPartnerId: 'ptn-kirana-network',
    redeemedByPartnerName: 'Sahakari Bhandar Kirana (Kothrud)',
  },
  {
    id: 'vch-103',
    code: '5B2Q-8RT7-G',
    campaignId: 'camp-diag-winter',
    campaignName: 'Winter Preventive Diagnostic Health Screening',
    category: 'diagnostic',
    faceValueInr: 600,
    seniorId: 'SC-PUN-004',
    seniorName: 'Dattatray Joshi',
    seniorPhone: '+91 98220 44004',
    status: 'sent_via_whatsapp',
    issuedAt: '2026-10-24T14:00:00Z',
    expiresAt: '2026-12-31T23:59:59Z',
    sentAt: '2026-10-24T14:05:00Z',
  },
];

/**
 * Issues a new voucher to an enrolled senior citizen
 */
export function issueVoucher(params: {
  campaignId: string;
  seniorId: string;
  seniorName: string;
  seniorPhone: string;
}): DigitalVoucher {
  const campaign = VOUCHER_CAMPAIGNS.find((c) => c.id === params.campaignId);
  if (!campaign) throw new Error(`Campaign ${params.campaignId} not found`);
  if (campaign.totalIssued >= campaign.totalAllocated) {
    throw new Error(`Campaign allocation exhausted (${campaign.totalIssued}/${campaign.totalAllocated})`);
  }

  const code = generateVoucherCode();
  const now = new Date().toISOString();

  const voucher: DigitalVoucher = {
    id: `vch-${Date.now()}`,
    code,
    campaignId: campaign.id,
    campaignName: campaign.name,
    category: campaign.category,
    faceValueInr: campaign.faceValueInr,
    seniorId: params.seniorId,
    seniorName: params.seniorName,
    seniorPhone: params.seniorPhone,
    status: 'issued',
    issuedAt: now,
    expiresAt: campaign.validUntil + 'T23:59:59Z',
  };

  campaign.totalIssued += 1;
  REGISTERED_VOUCHERS.unshift(voucher);
  return voucher;
}

/**
 * Simulates sending voucher to Senior's WhatsApp
 */
export function sendVoucherViaWhatsApp(voucherId: string): DigitalVoucher {
  const vch = REGISTERED_VOUCHERS.find((v) => v.id === voucherId);
  if (!vch) throw new Error(`Voucher ${voucherId} not found`);

  vch.status = 'sent_via_whatsapp';
  vch.sentAt = new Date().toISOString();
  return vch;
}

/**
 * Partner verification & single-use redemption terminal logic
 */
export function lookupVoucherByCode(code: string): {
  validFormat: boolean;
  voucher?: DigitalVoucher;
  error?: string;
} {
  const clean = code.trim().toUpperCase();
  const isValidCheck = validateCrockfordCode(clean);
  if (!isValidCheck) {
    return { validFormat: false, error: 'Invalid check digit or illegal Crockford character.' };
  }

  const vch = REGISTERED_VOUCHERS.find((v) => v.code.toUpperCase() === clean);
  if (!vch) {
    return { validFormat: true, error: 'Voucher code not found in active issuer records.' };
  }

  return { validFormat: true, voucher: vch };
}

/**
 * Redeems a voucher idempotently
 */
export function redeemVoucher(params: {
  code: string;
  partnerId: string;
  partnerName: string;
}): {
  success: boolean;
  voucher?: DigitalVoucher;
  error?: string;
} {
  const lookup = lookupVoucherByCode(params.code);
  if (!lookup.validFormat || !lookup.voucher) {
    return { success: false, error: lookup.error || 'Invalid voucher code.' };
  }

  const vch = lookup.voucher;

  // Single-use check
  if (vch.status === 'redeemed') {
    return {
      success: false,
      voucher: vch,
      error: `Voucher was already redeemed on ${new Date(vch.redeemedAt!).toLocaleString()} by ${vch.redeemedByPartnerName}. Single-use strictly enforced.`,
    };
  }

  if (vch.status === 'expired' || new Date(vch.expiresAt) < new Date()) {
    return {
      success: false,
      voucher: vch,
      error: `Voucher expired on ${new Date(vch.expiresAt).toLocaleDateString()}. Cannot be redeemed.`,
    };
  }

  if (vch.status === 'revoked') {
    return {
      success: false,
      voucher: vch,
      error: 'Voucher was revoked by issuing administrator.',
    };
  }

  // Execute redemption
  vch.status = 'redeemed';
  vch.redeemedAt = new Date().toISOString();
  vch.redeemedByPartnerId = params.partnerId;
  vch.redeemedByPartnerName = params.partnerName;

  const campaign = VOUCHER_CAMPAIGNS.find((c) => c.id === vch.campaignId);
  if (campaign) {
    campaign.totalRedeemed += 1;
  }

  return { success: true, voucher: vch };
}
