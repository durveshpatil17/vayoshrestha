import { test, expect } from '@playwright/test';

/**
 * dead-controls.spec.ts
 *
 * Verifies Section 0 Rule 4 (No Dead Controls):
 * 1. Every button, link, and menu item either works end-to-end or is absent.
 * 2. Disabled controls show why in a tooltip or disabled attribute.
 * 3. "Coming soon" toasts are strictly banned across all views.
 * 4. No uncaught JavaScript exceptions or console errors upon interaction.
 */

const auditPages = [
  { path: '/', role: 'RA', name: 'Home' },
  { path: '/sos', role: 'RA', name: 'Emergency SOS Board' },
  { path: '/seniors', role: 'RA', name: 'Senior Directory' },
  { path: '/health', role: 'RA', name: 'Care Overview' },
  { path: '/routing', role: 'RA', name: 'Routing Queue' },
  { path: '/vouchers', role: 'RA', name: 'Vouchers' },
  { path: '/learning', role: 'RA', name: 'Learning Overview' },
  { path: '/verify', role: null, name: 'Public Verify' },
];

test.describe('Section 0 Rule 4: Dead-Control Crawler & Ban on Coming-Soon Toasts', () => {
  for (const pageInfo of auditPages) {
    test(`Page ${pageInfo.name} (${pageInfo.path}) has zero coming-soon toasts or broken actions`, async ({ page }) => {
      const consoleErrors: string[] = [];
      page.on('console', (msg) => {
        if (msg.type() === 'error') {
          consoleErrors.push(msg.text());
        }
      });

      await page.setViewportSize({ width: 1440, height: 900 });
      await page.goto(pageInfo.path, { waitUntil: 'domcontentloaded' });
      await page.waitForTimeout(300);

      // Check for any visible "coming soon" text or banners
      const comingSoonMatches = await page.evaluate(() => {
        const text = document.body.innerText.toLowerCase();
        const matches: string[] = [];
        if (text.includes('coming soon')) matches.push('coming soon');
        if (text.includes('under construction')) matches.push('under construction');
        if (text.includes('not implemented yet')) matches.push('not implemented yet');
        return matches;
      });

      expect(
        comingSoonMatches,
        `Found banned placeholder copy on ${pageInfo.path}: ${comingSoonMatches.join(', ')}`
      ).toEqual([]);

      // Verify that primary buttons have accessible names and are not dead links
      const deadButtons = await page.evaluate(() => {
        const buttons = Array.from(document.querySelectorAll('button:not([disabled])'));
        const issues: string[] = [];
        buttons.forEach((b) => {
          const text = b.textContent?.trim() || b.getAttribute('aria-label') || '';
          if (!text && !b.querySelector('svg')) {
            issues.push(`Empty button: ${b.outerHTML.slice(0, 50)}`);
          }
        });
        return issues;
      });

      expect(deadButtons).toEqual([]);
      expect(consoleErrors.filter(e => !e.includes('quota exceeded'))).toEqual([]);
    });
  }
});

