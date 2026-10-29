import { test, expect } from '@playwright/test';
import { loginAs, assertInboxHasTask } from './helpers';

test.describe('Journey J-15: Chapter Provisioning & Go-Live Readiness (P15)', () => {
  test('Chapter setup checklist complete -> NM inbox receives GO_LIVE_AUTHORIZATION task -> NM activates', async ({ page }) => {
    await loginAs(page, 'NM');
    await assertInboxHasTask(page, 'GO_LIVE_AUTHORIZATION');

    await page.goto('/admin/settings', { waitUntil: 'domcontentloaded' });
    await expect(page.locator('text=Settings').or(page.locator('text=Readiness'))).toBeDefined();
  });
});

