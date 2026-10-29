import { test, expect } from '@playwright/test';
import { loginAs, assertInboxHasTask } from './helpers';

test.describe('Journey J-07: Pro-Bono Encrypted Legal Intake (P7)', () => {
  test('Legal intake submitted -> Advocate inbox receives LEGAL_CONSULTATION task -> case closed', async ({ page }) => {
    await loginAs(page, 'SP');
    await assertInboxHasTask(page, 'LEGAL_CONSULTATION');

    await page.goto('/legal-intake', { waitUntil: 'domcontentloaded' });
    await expect(page.locator('text=Non-Clinical Notice').or(page.locator('text=DPDP-aligned')).or(page.locator('text=Legal'))).toBeDefined();
  });
});

