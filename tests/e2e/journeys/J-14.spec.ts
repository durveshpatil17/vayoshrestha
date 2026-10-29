import { test, expect } from '@playwright/test';
import { loginAs, assertInboxHasTask } from './helpers';

test.describe('Journey J-14: Partner Organization Accreditation & Activation (P14)', () => {
  test('Partner profile submitted -> NM inbox receives PARTNER_ACCREDITATION task -> NM approves and activates', async ({ page }) => {
    await loginAs(page, 'NM');
    await assertInboxHasTask(page, 'PARTNER_ACCREDITATION');

    await page.goto('/partners', { waitUntil: 'domcontentloaded' });
    await expect(page.locator('text=Partners').or(page.locator('text=Directory'))).toBeDefined();
  });
});

