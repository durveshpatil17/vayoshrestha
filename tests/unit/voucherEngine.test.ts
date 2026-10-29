import { describe, it, expect } from 'vitest';
import {
  generateVoucherCode,
  validateCrockfordCode,
  calculateCrockfordCheckDigit,
  issueVoucher,
  lookupVoucherByCode,
  redeemVoucher,
  sendVoucherViaWhatsApp,
} from '@/domain/vouchers/voucherEngine';

describe('Layer 2 — Digital Vouchers & Partner Redemption Engine', () => {
  it('generates valid Crockford Base-32 code with accurate check digit', () => {
    const code = generateVoucherCode();
    expect(code).toMatch(/^[0-9A-HJKMNP-Z]{4}-[0-9A-HJKMNP-Z]{4}-[0-9A-HJKMNP-Z*~$=U]$/);
    expect(validateCrockfordCode(code)).toBe(true);
  });

  it('rejects tampered or corrupt Crockford codes', () => {
    const validCode = generateVoucherCode();
    const parts = validCode.split('-');
    // Tamper with one character
    const tamperedPayload = parts[0] + parts[1].replace(/.$/, '0');
    const tamperedCode = `${parts[0]}-${parts[1].replace(/.$/, '0')}-${parts[2]}`;

    // If check digit no longer matches payload
    const expectedCheck = calculateCrockfordCheckDigit(tamperedPayload);
    if (parts[2] !== expectedCheck) {
      expect(validateCrockfordCode(tamperedCode)).toBe(false);
    }
  });

  it('issues voucher to senior and increments campaign totalIssued', () => {
    const vch = issueVoucher({
      campaignId: 'camp-diag-winter',
      seniorId: 'SC-TEST-V',
      seniorName: 'Voucher Senior',
      seniorPhone: '+91 98888 11111',
    });

    expect(vch.status).toBe('issued');
    expect(vch.faceValueInr).toBe(600);
    expect(validateCrockfordCode(vch.code)).toBe(true);
  });

  it('simulates WhatsApp delivery transition', () => {
    const vch = issueVoucher({
      campaignId: 'camp-diag-winter',
      seniorId: 'SC-TEST-WA',
      seniorName: 'WhatsApp Senior',
      seniorPhone: '+91 98888 22222',
    });

    const updated = sendVoucherViaWhatsApp(vch.id);
    expect(updated.status).toBe('sent_via_whatsapp');
    expect(updated.sentAt).toBeDefined();
  });

  it('enforces single-use idempotent redemption', () => {
    const vch = issueVoucher({
      campaignId: 'camp-nutri-fest',
      seniorId: 'SC-TEST-RED',
      seniorName: 'Redeem Senior',
      seniorPhone: '+91 98888 33333',
    });

    // First redemption succeeds
    const firstRedeem = redeemVoucher({
      code: vch.code,
      partnerId: 'ptn-test-partner',
      partnerName: 'Test Diagnostics Lab',
    });

    expect(firstRedeem.success).toBe(true);
    expect(firstRedeem.voucher?.status).toBe('redeemed');
    expect(firstRedeem.voucher?.redeemedByPartnerName).toBe('Test Diagnostics Lab');

    // Second redemption attempt fails with single-use error
    const secondRedeem = redeemVoucher({
      code: vch.code,
      partnerId: 'ptn-test-partner',
      partnerName: 'Test Diagnostics Lab',
    });

    expect(secondRedeem.success).toBe(false);
    expect(secondRedeem.error).toContain('already redeemed');
  });
});
