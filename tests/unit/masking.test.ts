import { describe, it, expect } from 'vitest';
import {
  maskPhoneNumber,
  dobToAgeBand,
  suppressSmallNumber,
  escapeCsvFormula,
  isMaskedPhone,
} from '@/domain/masking';

describe('Masking & Privacy Protection (DPDP Act, Concept Note)', () => {
  describe('maskPhoneNumber', () => {
    it('should mask Indian 10-digit phone number showing only last 4 digits', () => {
      expect(maskPhoneNumber('9876543421')).toBe('••••••3421');
      expect(maskPhoneNumber('+919876543421')).toBe('••••••3421');
      expect(maskPhoneNumber('+91 98765 43421')).toBe('••••••3421');
    });

    it('should handle already masked values or empty inputs safely', () => {
      expect(maskPhoneNumber('••••••3421')).toBe('••••••3421');
      expect(maskPhoneNumber('')).toBe('');
      expect(maskPhoneNumber(null as unknown as string)).toBe('');
    });

    it('should verify if a phone number is masked', () => {
      expect(isMaskedPhone('••••••3421')).toBe(true);
      expect(isMaskedPhone('9876543421')).toBe(false);
    });
  });

  describe('dobToAgeBand', () => {
    it('should convert date of birth to 5-year age band for external partners', () => {
      // Assuming reference year 2026
      expect(dobToAgeBand('1964-05-15', 2026)).toBe('60–64');
      expect(dobToAgeBand('1958-11-20', 2026)).toBe('65–69');
      expect(dobToAgeBand('1952-03-01', 2026)).toBe('70–74');
      expect(dobToAgeBand('1946-08-10', 2026)).toBe('75–79');
      expect(dobToAgeBand('1941-01-05', 2026)).toBe('80–84');
      expect(dobToAgeBand('1935-04-12', 2026)).toBe('85+');
    });
  });

  describe('suppressSmallNumber', () => {
    it('should suppress counts less than 5 to "<5" to prevent donor re-identification', () => {
      expect(suppressSmallNumber(0)).toBe('0');
      expect(suppressSmallNumber(1)).toBe('<5');
      expect(suppressSmallNumber(2)).toBe('<5');
      expect(suppressSmallNumber(3)).toBe('<5');
      expect(suppressSmallNumber(4)).toBe('<5');
      expect(suppressSmallNumber(5)).toBe('5');
      expect(suppressSmallNumber(142)).toBe('142');
    });
  });

  describe('escapeCsvFormula', () => {
    it('should escape dangerous formula injection characters in CSV exports', () => {
      expect(escapeCsvFormula('=SUM(A1:A10)')).toBe("'=SUM(A1:A10)");
      expect(escapeCsvFormula('+44123456')).toBe("'+44123456");
      expect(escapeCsvFormula('-100')).toBe("'-100");
      expect(escapeCsvFormula('@echo off')).toBe("'@echo off");
      expect(escapeCsvFormula('Safe Name')).toBe('Safe Name');
    });
  });
});
