// ═══════════════════════════════════════════════════════════════════════════
// FILE: src/__tests__/e2e/navigation.spec.ts
// E2E tests for basic site navigation and key pages
// ═══════════════════════════════════════════════════════════════════════════

import { test, expect } from '@playwright/test';

test.describe('Site Navigation', () => {
  test('homepage loads with correct title', async ({ page }) => {
    await page.goto('/');
    await expect(page).toHaveTitle(/CodelithLabs/i);
  });

  test('homepage has skip-to-content link', async ({ page }) => {
    await page.goto('/');
    const skipLink = page.locator('a[href="#main-content"]');
    await expect(skipLink).toBeAttached();
  });

  test('tools page loads', async ({ page }) => {
    await page.goto('/tools/');
    await expect(page.locator('main')).toBeVisible();
  });

  test('blog page loads', async ({ page }) => {
    await page.goto('/blog/');
    await expect(page.locator('main')).toBeVisible();
  });

  test('contact page loads', async ({ page }) => {
    await page.goto('/contact/');
    await expect(page.locator('main')).toBeVisible();
    await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
  });

  test('dashboard page loads', async ({ page }) => {
    await page.goto('/dashboard/');
    await expect(page.locator('main')).toBeVisible();
  });

  test('offline page loads', async ({ page }) => {
    await page.goto('/offline/');
    await expect(page.getByText(/offline/i)).toBeVisible();
  });

  test('RSS feed returns valid XML', async ({ request }) => {
    const response = await request.get('/feed.xml/');
    expect(response.status()).toBe(200);
    const contentType = response.headers()['content-type'];
    expect(contentType).toContain('xml');
  });

  test('footer contains newsletter signup', async ({ page }) => {
    await page.goto('/');
    const footer = page.locator('footer');
    await expect(footer).toBeVisible();
    await expect(footer.getByPlaceholder(/email/i)).toBeVisible();
  });
});
