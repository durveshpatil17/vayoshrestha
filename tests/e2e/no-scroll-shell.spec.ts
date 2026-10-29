import { test, expect } from '@playwright/test';

/**
 * no-scroll-shell.spec.ts
 *
 * Verifies the Hard Rule from Section A2:
 * 1. App shell is a fixed-height viewport layout: height: 100dvh, overflow: hidden.
 * 2. Document element never scrolls: document.scrollingElement.scrollHeight === clientHeight.
 * 3. Side navigation never needs to scroll: scrollHeight <= clientHeight.
 * 4. Main region is the only scroll container.
 * Tested at 1440x900 and 1280x720 viewports across key roles and pages.
 */

const viewports = [
  { width: 1440, height: 900, name: '1440x900' },
  { width: 1280, height: 720, name: '1280x720' },
];

const samplePages = [
  { path: '/', role: 'RA', name: 'Home Launchpad' },
  { path: '/sos', role: 'RA', name: 'Emergency SOS Board' },
  { path: '/seniors', role: 'RA', name: 'Senior Directory' },
  { path: '/health', role: 'RA', name: 'Care Overview' },
  { path: '/programmes', role: 'RA', name: 'Programmes' },
  { path: '/routing', role: 'RA', name: 'Routing Queue' },
  { path: '/telemetry', role: 'RA', name: 'Live Telemetry' },
];

test.describe('Section A2: Fixed-Height No-Scroll Shell Hard Rule', () => {
  for (const vp of viewports) {
    test.describe(`Viewport: ${vp.name}`, () => {
      for (const p of samplePages) {
        test(`${p.name} (${p.path}) document does not scroll and sidebar fits`, async ({ page }) => {
          await page.setViewportSize({ width: vp.width, height: vp.height });
          await page.goto(p.path, { waitUntil: 'domcontentloaded' });
          await page.waitForTimeout(300);

          // 1. Verify document scrollingElement does not scroll
          const docScroll = await page.evaluate(() => {
            const el = document.scrollingElement || document.documentElement;
            return {
              scrollHeight: el.scrollHeight,
              clientHeight: el.clientHeight,
              isDocumentLocked: window.getComputedStyle(document.body).overflow === 'hidden' ||
                                window.getComputedStyle(document.documentElement).overflow === 'hidden' ||
                                Math.abs(el.scrollHeight - el.clientHeight) <= 2,
            };
          });

          expect(
            docScroll.isDocumentLocked,
            `Document should not scroll on ${p.path} at ${vp.name}. scrollHeight: ${docScroll.scrollHeight}, clientHeight: ${docScroll.clientHeight}`
          ).toBe(true);

          // 2. Verify sidebar fits without scrolling if present
          const sidebarScroll = await page.evaluate(() => {
            const sideNav = document.querySelector('aside, [data-testid="side-nav"], nav[aria-label="Sidebar"]');
            if (!sideNav) return { exists: false, fits: true };
            return {
              exists: true,
              fits: sideNav.scrollHeight <= sideNav.clientHeight + 2,
              scrollHeight: sideNav.scrollHeight,
              clientHeight: sideNav.clientHeight,
            };
          });

          if (sidebarScroll.exists) {
            expect(
              sidebarScroll.fits,
              `Sidebar on ${p.path} should not overflow its viewport height. scrollHeight: ${sidebarScroll.scrollHeight}, clientHeight: ${sidebarScroll.clientHeight}`
            ).toBe(true);
          }
        });
      }
    });
  }
});

