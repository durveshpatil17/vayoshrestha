import { describe, it, expect } from 'vitest';
import { generateMembershipId, parseMembershipId, isValidMembershipId } from '@/domain/idGenerator';

describe('Membership ID Generator (FR-05, FR-08)', () => {
  it('should generate ID matching pattern VV-<centre>-<yy>-<5-digit sequence>', () => {
    const id = generateMembershipId('PUN', 26, 1);
    expect(id).toBe('VV-PUN-26-00001');
    expect(isValidMembershipId(id)).toBe(true);
  });

  it('should pad sequence number to 5 digits correctly', () => {
    expect(generateMembershipId('NSK', 26, 42)).toBe('VV-NSK-26-00042');
    expect(generateMembershipId('NAG', 26, 1000)).toBe('VV-NAG-26-01000');
    expect(generateMembershipId('IND', 26, 99999)).toBe('VV-IND-26-99999');
  });

  it('should parse valid membership IDs into constituent components', () => {
    const parsed = parseMembershipId('VV-JAI-26-00123');
    expect(parsed).toEqual({
      valid: true,
      centreCode: 'JAI',
      year: 26,
      sequence: 123,
    });
  });

  it('should reject malformed membership IDs', () => {
    expect(isValidMembershipId('VV-PUN-0001')).toBe(false);
    expect(isValidMembershipId('PUN-26-00001')).toBe(false);
    expect(isValidMembershipId('VV-PUNE-26-00001')).toBe(false);
    expect(isValidMembershipId('VV-PUN-26-ABCDE')).toBe(false);
  });

  it('should maintain uniqueness across multiple successive generations', () => {
    const ids = new Set<string>();
    for (let i = 1; i <= 500; i++) {
      const id = generateMembershipId('LUK', 26, i);
      expect(ids.has(id)).toBe(false);
      ids.add(id);
    }
    expect(ids.size).toBe(500);
  });
});
