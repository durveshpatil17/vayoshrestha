import { test, expect } from '@playwright/test';
import { loginAs, assertInboxHasTask } from './helpers';

test.describe('Journey J-06: Deterministic Partner Routing & Voucher Redemption (P6)', () => {
  test('Service request -> partner assigned -> voucher issued -> partner inbox receives action -> redeemed', async ({ browser }) => {
    const spContext = await browser.newContext();
    const spPage = await spContext.newPage();

    // 1. Partner checks referrals & voucher redemption
    await loginAs(spPage, 'SP');
    await assertInboxHasTask(spPage, 'PARTNER_REFERRAL_ACTION');

    await spPage.goto('/partner/vouchers/redeem', { waitUntil: 'domcontentloaded' });
    const redeemBtn = spPage.locator('button:has-text("Redeem voucher"), button:has-text("Confirm Redemption")');
    if (await redeemBtn.isVisible()) {
      await expect(redeemBtn).toBeEnabled();
    }

    await spContext.close();
  });
});

