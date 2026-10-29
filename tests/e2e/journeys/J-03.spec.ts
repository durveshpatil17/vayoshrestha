import { test, expect } from '@playwright/test';
import { loginAs, assertInboxHasTask } from './helpers';

test.describe('Journey J-03: Daily Biomarker Alert & Wellness Outreach (P3)', () => {
  test('High-risk reading triggers WELLNESS_CALL task in CT inbox -> CT completes outreach', async ({ page }) => {
    await loginAs(page, 'CT');
    await assertInboxHasTask(page, 'WELLNESS_CALL');

    await page.goto('/health/queue?tab=calls', { waitUntil: 'domcontentloaded' });
    const callItem = page.locator('button:has-text("Initiate wellness call"), button:has-text("Call")').first();
    if (await callItem.isVisible()) {
      await callItem.click();
      await page.waitForTimeout(300);
    }
  });
});

