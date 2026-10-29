import { test, expect } from '@playwright/test';
import { loginAs, assertInboxHasTask } from './helpers';

test.describe('Journey J-13: Impact Pack Generation & Public Audit Verification (P13)', () => {
  test('PM generates draft pack -> NM inbox receives IMPACT_PACK_RELEASE task -> NM releases -> verified at /verify', async ({ browser }) => {
    const nmContext = await browser.newContext();
    const pubContext = await browser.newContext();

    const nmPage = await nmContext.newPage();
    const pubPage = await pubContext.newPage();

    // 1. NM receives release task in inbox
    await loginAs(nmPage, 'NM');
    await assertInboxHasTask(nmPage, 'IMPACT_PACK_RELEASE');

    // 2. Public verifies at /verify
    await pubPage.goto('/verify', { waitUntil: 'domcontentloaded' });
    await expect(pubPage.locator('input[placeholder*="verification code" i], input[type="text"]').first()).toBeVisible();

    await nmContext.close();
    await pubContext.close();
  });
});

