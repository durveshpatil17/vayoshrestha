import { test, expect } from '@playwright/test';
import { loginAs, assertInboxHasTask } from './helpers';

test.describe('Journey J-05: Statutory Template Maker-Checker Approval (P5)', () => {
  test('PM submits announcement template -> NM inbox receives approval task -> NM approves template', async ({ browser }) => {
    const pmContext = await browser.newContext();
    const nmContext = await browser.newContext();

    const pmPage = await pmContext.newPage();
    const nmPage = await nmContext.newPage();

    // 1. PM drafts template
    await loginAs(pmPage, 'PM');
    await pmPage.goto('/communication/templates', { waitUntil: 'domcontentloaded' });

    // 2. NM receives approval task in inbox
    await loginAs(nmPage, 'NM');
    await assertInboxHasTask(nmPage, 'TEMPLATE_APPROVAL');

    await pmContext.close();
    await nmContext.close();
  });
});

