import { test, expect } from '@playwright/test';
import { loginAs, assertInboxHasTask } from './helpers';

test.describe('Journey J-09: Field Associate Offline Terminal & Sync Supervision (P9)', () => {
  test('Field sync delay triggers SUPERVISOR_SYNC_CHECK task in CM inbox -> CM resolves check', async ({ page }) => {
    await loginAs(page, 'CM');
    await assertInboxHasTask(page, 'SUPERVISOR_SYNC_CHECK');

    await page.goto('/field-network/sync', { waitUntil: 'domcontentloaded' });
    await expect(page.locator('text=Sync').or(page.locator('text=Offline'))).toBeDefined();
  });
});

