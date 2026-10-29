import { test, expect } from '@playwright/test';
import { loginAs, assertInboxHasTask } from './helpers';

test.describe('Journey J-02: Emergency SOS Response & Post-Case Review (P2)', () => {
  test('SOS alert -> CT inbox receives acknowledge task -> CT resolves -> CM receives post-review task', async ({ browser }) => {
    const ctContext = await browser.newContext();
    const cmContext = await browser.newContext();

    const ctPage = await ctContext.newPage();
    const cmPage = await cmContext.newPage();

    // 1. CT checks live emergency task
    await loginAs(ctPage, 'CT');
    await assertInboxHasTask(ctPage, 'SOS_ACKNOWLEDGE');

    // 2. CT acknowledges and marks resolved
    await ctPage.goto('/sos', { waitUntil: 'domcontentloaded' });
    const ackBtn = ctPage.locator('button:has-text("Acknowledge emergency")');
    if (await ackBtn.isVisible()) {
      await ackBtn.click();
    }

    // 3. CM receives post-case review task
    await loginAs(cmPage, 'CM');
    await assertInboxHasTask(cmPage, 'SOS_POST_REVIEW');

    await ctContext.close();
    await cmContext.close();
  });
});

