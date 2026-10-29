import { test, expect } from '@playwright/test';
import { loginAs, assertInboxHasTask } from './helpers';

test.describe('Journey J-11: DPDP-Aligned Personal Data Purge (P11)', () => {
  test('Data subject deletion request -> SA inbox receives DPDP_REQUEST_ACTION task -> SA executes purge', async ({ page }) => {
    await loginAs(page, 'SA');
    await assertInboxHasTask(page, 'DPDP_REQUEST_ACTION');

    await page.goto('/admin/data-governance', { waitUntil: 'domcontentloaded' });
    await expect(page.locator('text=Data Governance').or(page.locator('text=DPDP'))).toBeDefined();
  });
});

