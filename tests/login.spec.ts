import { test, expect } from '@playwright/test';

test('User can log in with valid credentials and is redirected to dashboard', async ({ page }) => {
  await page.goto('/login');

  // Use a known test user (ensure this user exists in the test database)
  const testUser = {
    email: 'testuser@example.com',
    password: 'TestPassword123!'
  };

  await page.fill('input[name="email"]', testUser.email);
  await page.fill('input[name="password"]', testUser.password);

  await page.click('button[type="submit"]');

  // Wait for navigation to dashboard or dashboard-specific content
  await page.waitForURL('**/dashboard');
  await expect(page).toHaveURL(/\/dashboard/);

  // Optionally, check for dashboard content
  await expect(page.locator('main')).toContainText(/dashboard|question|points|streak/i);
});