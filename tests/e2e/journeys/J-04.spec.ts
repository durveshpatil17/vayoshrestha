import { test, expect } from '@playwright/test';
import { loginAs, assertInboxHasTask } from './helpers';

test.describe('Journey J-04: Community Programme Session & Attendance Corrections (P4)', () => {
  test('VF locks attendance -> requests correction -> CM inbox receives correction task -> CM approves', async ({ browser }) => {
    const vfContext = await browser.newContext();
    const cmContext = await browser.newContext();

    const vfPage = await vfContext.newPage();
    const cmPage = await cmContext.newPage();

    // 1. VF opens attendance
    await loginAs(vfPage, 'VF');
    await vfPage.goto('/attendance', { waitUntil: 'domcontentloaded' });

    // 2. CM inbox receives attendance correction approval task
    await loginAs(cmPage, 'CM');
    await assertInboxHasTask(cmPage, 'ATTENDANCE_CORRECTION_APPROVAL');

    await vfContext.close();
    await cmContext.close();
  });
});

