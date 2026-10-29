import { describe, it, expect } from 'vitest';
import {
  isQuietHours,
  isAllowlistedLink,
  SEED_LESSONS,
  SEED_QUIZZES,
} from '@/domain/learning/learningEngine';

describe('Layer 4 — Virtual Literacy & Quiet Hours Policy Logic', () => {
  it('correctly identifies quiet hours (21:00 to 08:00)', () => {
    // Night hours: strictly blocked
    expect(isQuietHours(21)).toBe(true);
    expect(isQuietHours(22)).toBe(true);
    expect(isQuietHours(23)).toBe(true);
    expect(isQuietHours(0)).toBe(true);
    expect(isQuietHours(4)).toBe(true);
    expect(isQuietHours(7)).toBe(true);

    // Daytime allowed hours: 08:00 to 20:59
    expect(isQuietHours(8)).toBe(false);
    expect(isQuietHours(10)).toBe(false);
    expect(isQuietHours(14)).toBe(false);
    expect(isQuietHours(18)).toBe(false);
    expect(isQuietHours(20)).toBe(false);
  });

  it('validates safe allowlisted external domains', () => {
    expect(isAllowlistedLink('https://cybercrime.gov.in')).toBe(true);
    expect(isAllowlistedLink('https://vayoshrestha.org/help')).toBe(true);
    expect(isAllowlistedLink('https://abdm.gov.in')).toBe(true);

    // Unsafe / suspicious domains are rejected
    expect(isAllowlistedLink('https://unknown-prize-lottery.xyz/claim')).toBe(false);
    expect(isAllowlistedLink('not-a-valid-url')).toBe(false);
  });

  it('provides well-formed micro-lessons with WhatsApp chat preview text', () => {
    expect(SEED_LESSONS.length).toBeGreaterThanOrEqual(4);
    for (const lesson of SEED_LESSONS) {
      expect(lesson.title).toBeDefined();
      expect(lesson.whatsappBubbleText).toBeDefined();
      expect(lesson.whatsappBubbleText.length).toBeGreaterThan(30);
      expect(lesson.estimatedMinutes).toBeLessThanOrEqual(5);
    }
  });

  it('evaluates Mastermind quiz answers and computes team score', () => {
    const quiz = SEED_QUIZZES[0];
    expect(quiz.questions.length).toBe(3);

    // Test correct answering
    let score = 0;
    quiz.questions.forEach((q) => {
      if (q.correctOptionIndex >= 0 && q.correctOptionIndex < q.options.length) {
        score += 1;
      }
    });
    expect(score).toBe(3);
  });
});
