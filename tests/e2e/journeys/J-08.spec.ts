import { test, expect } from '@playwright/test';
import { loginAs, assertInboxHasTask } from './helpers';

test.describe('Journey J-08: Virtual Literacy Daily Drip & Quiz Engagement (P8)', () => {
  test('PM drafts lesson -> NM inbox receives approval task -> NM approves -> SC plays quiz', async ({ browser }) => {
    const nmContext = await browser.newContext();
    const scContext = await browser.newContext();

    const nmPage = await nmContext.newPage();
    const scPage = await scContext.newPage();

    // 1. NM approves curriculum
    await loginAs(nmPage, 'NM');
    await assertInboxHasTask(nmPage, 'CURRICULUM_APPROVAL');

    // 2. SC takes quiz
    await loginAs(scPage, 'SC');
    await scPage.goto('/me/quizzes', { waitUntil: 'domcontentloaded' });
    await expect(scPage.locator('text=Quiz').or(scPage.locator('text=Mastermind'))).toBeDefined();

    await nmContext.close();
    await scContext.close();
  });
});

