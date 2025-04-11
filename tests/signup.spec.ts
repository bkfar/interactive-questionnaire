import { test, expect } from '@playwright/test';

test('User can sign up with valid credentials and sees success message', async ({ page }) => {
  await page.goto('/register');

  // Generate a unique test email for each run
  const uniqueId = Date.now();
  const testUser = {
    username: `testuser${uniqueId}`,
    email: `testuser${uniqueId}@example.com`,
    password: 'TestPassword123!'
  };

  await page.fill('input[name="username"]', testUser.username);
  await page.fill('input[name="email"]', testUser.email);
  await page.fill('input[name="password"]', testUser.password);

  await page.click('button[type="submit"]');

  // Wait for the success message to appear
  const successLocator = page.getByRole('status');
  await expect(successLocator).toContainText(/check your email|verification|success|account/i);
});