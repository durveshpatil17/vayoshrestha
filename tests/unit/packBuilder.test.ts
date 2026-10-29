import { describe, it, expect, beforeEach } from 'vitest';
import {
  calculateSha256Hex,
  generateVerificationCode,
  createImpactPack,
  submitPackForReview,
  releaseImpactPack,
  findPackByCodeOrHash,
  WATERMARK_TEXT,
} from '@/domain/telemetry/packBuilder';

describe('Layer 1 — Impact Packs & Tamper-Evident SHA-256 Verification', () => {
  it('calculates reproducible SHA-256 hex string', async () => {
    const input = 'Vayoshreshtha Ecosystem Telemetry Proof';
    const hash1 = await calculateSha256Hex(input);
    const hash2 = await calculateSha256Hex(input);

    expect(hash1).toBeDefined();
    expect(hash1.length).toBe(64);
    expect(hash1).toBe(hash2);

    const differentHash = await calculateSha256Hex(input + ' Modified');
    expect(differentHash).not.toBe(hash1);
  });

  it('generates verification code matching VV-XXXX-XXXX pattern', () => {
    const code = generateVerificationCode();
    expect(code).toMatch(/^VV-[2-9A-HJ-NP-Z]{4}-[2-9A-HJ-NP-Z]{4}$/);
  });

  it('enforces mandatory synthetic data watermark on every pack', async () => {
    const pack = await createImpactPack({
      title: 'CSR Winter Drive Impact Pack',
      templateId: 'csr_impact_brief',
      audience: 'CSR',
      chapterFilter: 'all',
      summary: 'Evaluation summary',
      dateRange: { start: '2026-10-01', end: '2026-10-30' },
      creator: { id: 'pm-1', name: 'Pooja', role: 'Programme Manager' },
    });

    expect(pack.syntheticWatermark).toBe(WATERMARK_TEXT);
    expect(pack.status).toBe('draft');
    expect(pack.sha256Hash).toBeUndefined();
  });

  it('implements Maker-Checker lifecycle and attaches SHA-256 on release', async () => {
    const pack = await createImpactPack({
      title: 'Govt Health Brief Q3',
      templateId: 'govt_health_brief',
      audience: 'Government',
      chapterFilter: 'pune',
      summary: 'BP & Vaccine stats',
      dateRange: { start: '2026-07-01', end: '2026-09-30' },
      creator: { id: 'pm-1', name: 'Pooja Verma', role: 'PM' },
    });

    await submitPackForReview(pack.id);
    expect(pack.status).toBe('under_review');

    const released = await releaseImpactPack(pack.id, {
      id: 'nm-1',
      name: 'Dr. Anita Joshi',
      role: 'National Manager',
    });

    expect(released.status).toBe('released');
    expect(released.sha256Hash).toBeDefined();
    expect(released.sha256Hash!.length).toBe(64);
    expect(released.reviewedBy?.name).toBe('Dr. Anita Joshi');

    // Finding by code or hash works
    const foundByCode = findPackByCodeOrHash(released.code);
    expect(foundByCode?.id).toBe(pack.id);

    const foundByHash = findPackByCodeOrHash(released.sha256Hash!);
    expect(foundByHash?.id).toBe(pack.id);
  });
});
