import { Page, expect } from '@playwright/test';

/**
 * Shared Journey Test Helpers for J-01 through J-15
 */

export async function loginAs(page: Page, role: string) {
  await page.goto('/login', { waitUntil: 'domcontentloaded' });
  await page.evaluate((r) => {
    try {
      const auth = (window as any).__AUTH_STORE__;
      if (auth && auth.getState) {
        auth.getState().switchPersona(r);
      }
    } catch (e) {}
  }, role);
  await page.waitForTimeout(200);
}

export async function assertInboxHasTask(
  page: Page,
  taskType: string,
  subjectSubstring?: string
) {
  await page.goto('/inbox', { waitUntil: 'domcontentloaded' });
  await page.waitForTimeout(300);

  // Expect task item in inbox list
  const taskFound = await page.evaluate(({ type, sub }) => {
    const items = Array.from(document.querySelectorAll('[data-task-item], [data-testid="task-item"]'));
    return items.some((item) => {
      const text = item.textContent || '';
      const typeMatch = text.includes(type);
      const subMatch = !sub || text.includes(sub);
      return typeMatch && subMatch;
    });
  }, { type: taskType, sub: subjectSubstring });

  expect(taskFound, `Inbox should contain task of type ${taskType}${subjectSubstring ? ` matching "${subjectSubstring}"` : ''}`).toBe(true);
}

export async function assertProcessFlowStage(
  page: Page,
  expectedStage: string,
  status: 'Completed' | 'Current' | 'Pending' = 'Current'
) {
  const stageEl = page.locator(`[data-stage="${expectedStage}"], [data-testid="stage-${expectedStage}"]`);
  await expect(stageEl).toBeVisible();
}

