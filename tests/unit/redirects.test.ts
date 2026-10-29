import { describe, it, expect } from 'vitest';
import fs from 'fs';
import path from 'path';
import { CANONICAL_REDIRECTS } from '@/routes/redirects';

describe('Loop R0.5: Client & Edge Redirect Consistency', () => {
  it('validates vercel.json contains all 21 canonical redirects matching CANONICAL_REDIRECTS', () => {
    const vercelConfig = JSON.parse(fs.readFileSync(path.resolve('./vercel.json'), 'utf8'));
    expect(vercelConfig.redirects).toBeDefined();
    expect(vercelConfig.redirects.length).toBe(21);

    for (const entry of CANONICAL_REDIRECTS) {
      const match = vercelConfig.redirects.find((r: any) => r.source === entry.source);
      expect(match, `vercel.json missing redirect for source: ${entry.source}`).toBeDefined();
      expect(match.destination).toBe(entry.destination);
      expect(match.permanent).toBe(true);
    }
  });

  it('validates docs/IA.md Section 5 matches CANONICAL_REDIRECTS', () => {
    const iaMd = fs.readFileSync(path.resolve('./docs/IA.md'), 'utf8');

    for (const entry of CANONICAL_REDIRECTS) {
      expect(iaMd).toContain(`| \`${entry.source}\` | \`${entry.destination}\``);
    }
  });

  it('verifies all redirect destinations have valid targets', () => {
    for (const entry of CANONICAL_REDIRECTS) {
      expect(entry.destination.startsWith('/')).toBe(true);
      expect(entry.destination).toContain('?tab=');
    }
  });
});
