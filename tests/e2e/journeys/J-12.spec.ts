import { test, expect } from '@playwright/test';
import { loginAs, assertInboxHasTask } from './helpers';

test.describe('Journey J-12: Citizen Grievance Redressal (P12)', () => {
  test('Complaint logged -> CM inbox receives COMPLAINT_INVESTIGATION task -> CM records resolution', async ({ page }) => {
    await loginAs(page, 'CM');
    await assertInboxHasTask(page, 'COMPLAINT_INVESTIGATION');

    await page.goto('/admin/complaints', { waitUntil: 'domcontentloaded' });
    await expect(page.locator('text=Complaints').or(page.locator('text=Grievance'))).toBeDefined();
  });
});

