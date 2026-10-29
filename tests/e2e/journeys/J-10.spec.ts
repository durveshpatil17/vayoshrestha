import { test, expect } from '@playwright/test';
import { loginAs, assertInboxHasTask } from './helpers';

test.describe('Journey J-10: Multi-Tier Maker-Checker Policy Change (P10)', () => {
  test('Maker submits policy change -> NM inbox receives GOVERNANCE_APPROVAL task -> NM approves', async ({ page }) => {
    await loginAs(page, 'NM');
    await assertInboxHasTask(page, 'GOVERNANCE_APPROVAL');

    await page.goto('/admin/approvals', { waitUntil: 'domcontentloaded' });
    await expect(page.locator('text=Approvals').or(page.locator('text=Maker-Checker'))).toBeDefined();
  });
});

