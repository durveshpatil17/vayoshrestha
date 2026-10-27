import { describe, it, expect } from 'vitest';
import { checkDuplicateMember, normalizePhoneNumber } from '@/domain/duplicateCheck';

describe('Duplicate Member Detection (FR-05, FR-08)', () => {
  const existingMembers = [
    {
      id: 'm-1',
      fullName: 'Ramesh Sharma',
      dateOfBirth: '1955-08-15',
      phone: '9822011223',
      centreId: 'HUB-PUN',
    },
    {
      id: 'm-2',
      fullName: 'Shanta Devi Patel',
      dateOfBirth: '1960-03-22',
      phone: '9822099887',
      centreId: 'HUB-NSK',
    },
  ];

  it('should detect exact duplicate on name + DOB + phone', () => {
    const candidate = {
      fullName: 'Ramesh Sharma',
      dateOfBirth: '1955-08-15',
      phone: '+91 98220 11223',
    };
    const result = checkDuplicateMember(candidate, existingMembers);
    expect(result.isDuplicate).toBe(true);
    expect(result.confidence).toBe('high');
    expect(result.matchedMemberId).toBe('m-1');
  });

  it('should detect potential duplicate on matching phone and normalized name', () => {
    const candidate = {
      fullName: 'Ramesh   Sharma',
      dateOfBirth: '1956-01-01', // different DOB
      phone: '9822011223',
    };
    const result = checkDuplicateMember(candidate, existingMembers);
    expect(result.isPotentialDuplicate).toBe(true);
    expect(result.confidence).toBe('medium');
    expect(result.matchedMemberId).toBe('m-1');
  });

  it('should allow completely distinct new members', () => {
    const candidate = {
      fullName: 'Anand Kumar Joshi',
      dateOfBirth: '1962-12-10',
      phone: '9844055667',
    };
    const result = checkDuplicateMember(candidate, existingMembers);
    expect(result.isDuplicate).toBe(false);
    expect(result.isPotentialDuplicate).toBe(false);
    expect(result.matchedMemberId).toBeNull();
  });

  it('should normalize Indian phone numbers with various prefixes', () => {
    expect(normalizePhoneNumber('+91 98220 11223')).toBe('9822011223');
    expect(normalizePhoneNumber('09822011223')).toBe('9822011223');
    expect(normalizePhoneNumber('98220-11223')).toBe('9822011223');
  });
});
