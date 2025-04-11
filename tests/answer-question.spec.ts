import { test, expect } from '@playwright/test';

// NOTE: Answer submission is not yet implemented in the dashboard UI.
// This test verifies that a question and options are displayed after login.

test('User can log in and see a question with options on the dashboard', async ({ page }) => {
  await page.goto('/login');

  // Use a known test user (ensure this user exists in the test database)
  const testUser = {
    email: 'testuser@example.com',
    password: 'TestPassword123!'
  };

  await page.fill('input[name="email"]', testUser.email);
  await page.fill('input[name="password"]', testUser.password);
  await page.click('button[type="submit"]');

  // Wait for navigation to dashboard
  await page.waitForURL('**/dashboard');
  await expect(page).toHaveURL(/\/dashboard/);

  // Assert that a question is displayed
  await expect(page.locator('main')).toContainText(/next question|question/i);

  // Assert that at least one option is displayed (radio input)
  const options = page.locator('input[type="radio"][name="option"]');
  await expect(options).toHaveCountGreaterThan(0);
});