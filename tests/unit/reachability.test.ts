import { describe, it, expect } from 'vitest';
import fs from 'fs';
import path from 'path';

describe('Loop R0.5: Route Reachability & Click-Depth Compliance', () => {
  it('verifies every route in route-manifest.json is reachable in <= 3 clicks or documented parent', () => {
    const clickDepthMd = fs.readFileSync(path.resolve('./docs/CLICK_DEPTH.md'), 'utf8');
    const manifest = JSON.parse(fs.readFileSync(path.resolve('./docs/route-manifest.json'), 'utf8'));

    expect(clickDepthMd).toContain('**Max Click Depth**: **3 clicks**');

    for (const r of manifest.routes) {
      expect(clickDepthMd).toContain(`\`${r.path}\``);
    }
  });

  it('validates no route exceeds click-depth 3', () => {
    const lines = fs.readFileSync(path.resolve('./docs/CLICK_DEPTH.md'), 'utf8').split('\n');
    const tableRows = lines.filter(l => l.startsWith('| `') && l.includes('**'));

    for (const row of tableRows) {
      const match = row.match(/\*\*(\d+)\*\*/);
      if (match) {
        const depth = parseInt(match[1], 10);
        expect(depth).toBeLessThanOrEqual(3);
      }
    }
  });
});
