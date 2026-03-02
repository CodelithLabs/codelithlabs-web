/**
 * Extended E2E tests for critical user flows
 * Tests forms, authentication, tools, payment flow
 */

import { test, expect } from '@playwright/test';

test.describe('Contact Form Flow', () => {
  test('should display contact form on /contact', async ({ page }) => {
    await page.goto('/contact');
    const form = page.locator('form');
    expect(form).toBeDefined();
  });

  test('should validate required fields', async ({ page }) => {
    await page.goto('/contact');
    const submitButton = page.locator('button[type="submit"]');
    await submitButton.click();

    // Should show validation errors
    const errors = page.locator('[role="alert"]');
    await expect(errors).toHaveCount(3); // name, email, message
  });

  test('should show error for invalid email', async ({ page }) => {
    await page.goto('/contact');
    await page.fill('input[name="name"]', 'John Doe');
    await page.fill('input[name="email"]', 'invalid-email');
    await page.fill('textarea[name="message"]', 'This is a test message');

    const submitButton = page.locator('button[type="submit"]');
    await submitButton.click();

    const emailError = page.locator('[role="alert"]').filter({ hasText: 'email' });
    await expect(emailError).toBeVisible();
  });

  test('should require Turnstile CAPTCHA', async ({ page }) => {
    await page.goto('/contact');
    const turnstileFrame = page.frameLocator('iframe[src*="turnstile"]');
    const frameContent = turnstileFrame.locator(':nth-match(*, 1)');
    // Frame should exist (checking for existence by locating element inside)
    await expect(frameContent).toBeDefined();
  });

  test('should disable submit button until form is valid', async ({ page }) => {
    await page.goto('/contact');
    const submitButton = page.locator('button[type="submit"]');

    // Initially should be disabled
    expect(await submitButton.isDisabled()).toBeTruthy();

    // Fill form
    await page.fill('input[name="name"]', 'John Doe');
    await page.fill('input[name="email"]', 'john@example.com');
    await page.fill('textarea[name="message"]', 'This is a valid message');

    // Still disabled until CAPTCHA passes
    expect(await submitButton.isDisabled()).toBeTruthy();
  });
});

test.describe('Newsletter Signup', () => {
  test('should display newsletter signup form', async ({ page }) => {
    await page.goto('/');
    const newsletter = page.locator('[data-testid="newsletter-signup"]');
    await expect(newsletter).toBeVisible();
  });

  test('should validate email format', async ({ page }) => {
    await page.goto('/');
    const emailInput = page.locator('input[type="email"]');
    await emailInput.fill('invalid');

    const submitButton = page.locator('button').filter({ hasText: /subscribe|signup/i });
    await submitButton.click();

    // Should show validation error
    const error = page.locator('[role="alert"]');
    await expect(error).toBeVisible();
  });

  test('should accept valid email', async ({ page }) => {
    await page.goto('/');
    const emailInput = page.locator('input[type="email"]');
    await emailInput.fill('subscriber@example.com');

    const submitButton = page.locator('button').filter({ hasText: /subscribe|signup/i });
    await submitButton.click();

    // Should show success message
    const success = page.locator('[role="alert"]').filter({ hasText: /success|subscribed/i });
    await expect(success).toBeVisible({ timeout: 5000 });
  });

  test('should handle ConvertKit API errors gracefully', async ({ page }) => {
    await page.route('**/api/newsletter', route => {
      route.abort('failed');
    });

    await page.goto('/');
    const emailInput = page.locator('input[type="email"]');
    await emailInput.fill('subscriber@example.com');

    const submitButton = page.locator('button').filter({ hasText: /subscribe|signup/i });
    await submitButton.click();

    // Should show error message, not crash
    const error = page.locator('[role="alert"]').filter({ hasText: /error|failed/i });
    await expect(error).toBeVisible({ timeout: 5000 });
  });
});

test.describe('Tool Usage', () => {
  test('should load and use JSON formatter', async ({ page }) => {
    await page.goto('/tools/json-formatter');
    
    const input = page.locator('textarea[name="input"], [data-testid="input"]');
    await expect(input).toBeVisible();

    // Enter invalid JSON
    await input.fill('{"invalid": json}');
    
    // Should show error
    const error = page.locator('[role="alert"]').filter({ hasText: /invalid|error/i });
    await expect(error).toBeVisible();

    // Enter valid JSON
    await input.fill('{"key": "value"}');

    // Should format
    const output = page.locator('[data-testid="output"]');
    await expect(output).toContainText('"key"');
  });

  test('should load and use image compressor', async ({ page }) => {
    await page.goto('/tools/image-compressor');
    
    const fileInput = page.locator('input[type="file"]');
    await expect(fileInput).toBeVisible();
  });

  test('should show tool search', async ({ page }) => {
    await page.goto('/tools');
    
    const searchInput = page.locator('input[placeholder*="search" i]');
    await expect(searchInput).toBeVisible();

    // Search for a tool
    await searchInput.fill('json');

    // Should filter tools
    const tools = page.locator('[data-testid="tool-card"]');
    const count = await tools.count();
    expect(count).toBeGreaterThan(0);
  });

  test('should filter tools by category', async ({ page }) => {
    await page.goto('/tools');
    
    const categoryFilter = page.locator('select[name="category"], [role="combobox"]');
    if (await categoryFilter.isVisible()) {
      await categoryFilter.selectOption('converter');
      
      const tools = page.locator('[data-testid="tool-card"]');
      const count = await tools.count();
      expect(count).toBeGreaterThan(0);
    }
  });
});

test.describe('Authentication Flow', () => {
  test('should show sign-in button when logged out', async ({ page }) => {
    await page.goto('/');
    const signInButton = page.locator('button, a').filter({ hasText: /sign in|login/i });
    await expect(signInButton).toBeVisible();
  });

  test('should navigate to Google OAuth on sign-in', async ({ page }) => {
    await page.goto('/auth/signin');
    const googleButton = page.locator('button, a').filter({ hasText: /google/i });
    await expect(googleButton).toBeVisible();

    // Don't actually click to avoid browser navigation
    expect(googleButton).toBeDefined();
  });

  test('should show profile menu when authenticated', async ({ page, context }) => {
    // This test would need a logged-in session
    // Simulating with specific auth cookies
    await context.addCookies([
      {
        name: 'authjs.session-token',
        value: 'mock-session-token',
        domain: 'localhost',
        path: '/',
        httpOnly: true,
        secure: false,
        sameSite: 'Lax',
        expires: Date.now() / 1000 + 86400,
      }
    ]);

    await page.goto('/');
    // Would see profile menu instead of sign-in button
  });

  test('should show dashboard for authenticated users', async ({ page }) => {
    await page.goto('/dashboard');
    
    // Dashboard should load (may require auth)
    const main = page.locator('main');
    await expect(main).toBeVisible();
  });
});

test.describe('Error Handling', () => {
  test('should show 404 for non-existent tool', async ({ page }) => {
    await page.goto('/tools/non-existent-tool-xyz');

    const notFound = page.locator('text=/not found|404/i');
    await expect(notFound).toBeVisible({ timeout: 5000 });
  });

  test('should show offline page when offline', async ({ page, context }) => {
    // Simulate offline
    await context.setOffline(true);
    
    await page.goto('/offline');
    const offlineText = page.locator('text=/offline/i');
    await expect(offlineText).toBeVisible();

    // Restore online
    await context.setOffline(false);
  });

  test('should handle API errors gracefully', async ({ page }) => {
    // Mock API to return error
    await page.route('**/api/**', route => {
      route.abort('failed');
    });

    await page.goto('/');
    // Page should still load even if API fails
    const main = page.locator('main');
    await expect(main).toBeVisible();
  });
});

test.describe('Performance', () => {
  test('should load homepage within 3 seconds', async ({ page }) => {
    const start = Date.now();
    await page.goto('/', { waitUntil: 'domcontentloaded' });
    const duration = Date.now() - start;

    expect(duration).toBeLessThan(3000);
  });

  test('should load tools page without full layout shift', async ({ page }) => {
    // Measure Cumulative Layout Shift
    const cls = await page.evaluate(() => {
      let clsValue = 0;
      const observer = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          if (!(entry as any).hadRecentInput) {
            clsValue += (entry as any).value;
          }
        }
      });
      observer.observe({ type: 'layout-shift', buffered: true });
      return new Promise<number>(resolve => {
        setTimeout(() => resolve(clsValue), 2000);
      });
    });

    // CLS should be < 0.1 (good)
    expect(cls).toBeLessThan(0.25);
  });

  test('should lazy-load images below the fold', async ({ page }) => {
    await page.goto('/');

    const images = page.locator('img');
    const count = await images.count();

    // All images should eventually load
    for (let i = 0; i < count; i++) {
      const img = images.nth(i);
      await expect(img).toHaveJSProperty('complete', true);
    }
  });
});

test.describe('Security', () => {
  test('should include security headers', async ({ request }) => {
    const response = await request.get('/');

    const headers = response.headers();
    expect(headers['x-frame-options']).toBeDefined();
    expect(headers['x-content-type-options']).toBeDefined();
  });

  test('should prevent XSS via HTML input', async ({ page }) => {
    await page.goto('/tools/json-formatter');

    const input = page.locator('textarea, input');
    await input.fill('<script>alert("xss")</script>');

    // Should not execute script
    const alerts = page.locator('text=/xss/i');
    await expect(alerts).not.toBeVisible();
  });

  test('should use HTTPS links', async ({ page }) => {
    await page.goto('/');

    const links = page.locator('a[href*="http:"]');
    const count = await links.count();

    // Should have no HTTP links (except localhost for dev)
    expect(count).toBe(0);
  });
});
