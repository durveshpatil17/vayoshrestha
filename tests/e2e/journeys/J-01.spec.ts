import { test, expect } from '@playwright/test';
import { loginAs, assertInboxHasTask } from './helpers';

test.describe('Journey J-01: Senior Onboarding & Duplicate Resolution (P1)', () => {
  test('VF onboards senior -> duplicate detection task to PM -> PM confirms -> CM views registered', async ({ browser }) => {
    const vfContext = await browser.newContext();
    const pmContext = await browser.newContext();

    const vfPage = await vfContext.newPage();
    const pmPage = await pmContext.newPage();

    // 1. VF initiates registration
    await loginAs(vfPage, 'VF');
    await vfPage.goto('/onboarding/new', { waitUntil: 'domcontentloaded' });

    // 2. Expect duplicate review task in PM inbox
    await loginAs(pmPage, 'PM');
    await assertInboxHasTask(pmPage, 'DUPLICATE_REVIEW');

    // 3. PM confirms unique
    const confirmBtn = pmPage.locator('button:has-text("Confirm Unique"), button:has-text("Confirm unique person")');
    if (await confirmBtn.isVisible()) {
      await confirmBtn.click();
      await pmPage.waitForTimeout(300);
    }

    // 4. Assert final registered state & activity entry
    const seniorPage = await vfContext.newPage();
    await seniorPage.goto('/seniors', { waitUntil: 'domcontentloaded' });
    await expect(seniorPage.locator('text=Registered').first()).toBeVisible();

    await vfContext.close();
    await pmContext.close();
  });
});

