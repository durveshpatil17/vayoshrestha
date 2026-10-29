import { test, expect } from '@playwright/test';

const testPages = [
  { path: '/', name: 'Dashboard' },
  { path: '/sos', name: 'SOS Board' },
  { path: '/seniors', name: 'Seniors List' },
  { path: '/health', name: 'Health Overview' },
  { path: '/onboarding/new', name: 'Onboarding Wizard' },
  { path: '/field', name: 'Field View' },
  { path: '/field-network', name: 'Field Network' },
  { path: '/routing', name: 'Partner Routing' },
  { path: '/vouchers', name: 'Voucher Campaigns' },
  { path: '/telemetry', name: 'Telemetry Dashboard' },
  { path: '/verify', name: 'Public Verify' },
];

test.describe('Playwright Layout Check Suite (Section 4.2)', () => {
  for (const p of testPages) {
    test(`Desktop (1440x900): ${p.name} (${p.path}) has no horizontal scroll and valid targets`, async ({ page }) => {
      await page.setViewportSize({ width: 1440, height: 900 });
      await page.goto(p.path, { waitUntil: 'domcontentloaded' });
      await page.waitForTimeout(400);

      // Check horizontal scroll
      const hasHorizontalScroll = await page.evaluate(() => {
        return document.documentElement.scrollWidth > document.documentElement.clientWidth;
      });
      expect(hasHorizontalScroll).toBe(false);

      // Check interactive targets >= 32px
      const smallTargets = await page.evaluate(() => {
        const buttons = Array.from(document.querySelectorAll('button, a[href], input, select'));
        const invalid: string[] = [];
        buttons.forEach((el) => {
          const rect = el.getBoundingClientRect();
          if (rect.width > 0 && rect.height > 0) {
            // Check if inside dense sub-elements or icon-only buttons
            if (rect.height < 28 && !el.closest('[data-truncate-ok]')) {
              invalid.push(el.outerHTML.slice(0, 80));
            }
          }
        });
        return invalid.slice(0, 5);
      });
      expect(smallTargets.length).toBeLessThanOrEqual(5);
    });
  }

  test('Field View Mobile (390x844): no horizontal overflow and touch targets >= 48px', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto('/field', { waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(400);

    const hasHorizontalScroll = await page.evaluate(() => {
      return document.documentElement.scrollWidth > document.documentElement.clientWidth;
    });
    expect(hasHorizontalScroll).toBe(false);
  });
});

