import { test, expect } from '@playwright/test';

test.describe('Direct SPA Routes on Preview Server', () => {
  test('direct navigation to /sos renders correctly and does not 404', async ({ page }) => {
    const response = await page.goto('/sos', { waitUntil: 'networkidle' });
    
    // Assert HTTP status is 200 (not 404)
    expect(response?.status()).toBe(200);

    // Assert page does not render a 404 Not Found error
    await expect(page.locator('text=Page Not Found')).not.toBeVisible();
    await expect(page.locator('text=404 - Not Found')).not.toBeVisible();

    // Assert SOS page elements render
    // Should display SOS heading or SOS indicator or table
    const sosHeading = page.getByRole('heading', { name: /sos/i }).first();
    await expect(sosHeading).toBeVisible();
  });

  test('direct navigation to /seniors renders correctly and does not 404', async ({ page }) => {
    const response = await page.goto('/seniors', { waitUntil: 'networkidle' });
    
    // Assert HTTP status is 200 (not 404)
    expect(response?.status()).toBe(200);

    // Assert page does not render a 404 Not Found error
    await expect(page.locator('text=Page Not Found')).not.toBeVisible();
    await expect(page.locator('text=404 - Not Found')).not.toBeVisible();

    // Assert Senior Directory elements render
    const seniorsHeading = page.getByRole('heading', { name: /senior/i }).first();
    await expect(seniorsHeading).toBeVisible();
  });

  test('direct navigation to /403 renders correctly and does not 404', async ({ page }) => {
    const response = await page.goto('/403', { waitUntil: 'networkidle' });
    
    // Assert HTTP status is 200 (not 404)
    expect(response?.status()).toBe(200);

    // Assert page does not render a 404 Not Found error
    await expect(page.locator('text=Page Not Found')).not.toBeVisible();
    await expect(page.locator('text=404 - Not Found')).not.toBeVisible();

    // Assert 403 Forbidden content renders
    await expect(page.locator('text=HTTP 403')).toBeVisible();
    await expect(page.getByRole('heading', { name: /you don't have access to this page/i })).toBeVisible();
  });
});

