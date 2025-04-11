import { test, expect } from '@playwright/test';

test('User can log in and view their answer history', async ({ page }) => {
  await page.goto('/login');

  // Use a known test user (ensure this user exists in the test database)
  const testUser = {
    email: 'testuser@example.com',
    password: 'TestPassword123!'
  };

  await page.fill('input[name="email"]', testUser.email);
  await page.fill('input[name="password"]', testUser.password);
  await page.click('button[type="submit"]');

  // Navigate to the history page
  await page.goto('/history');
  await expect(page).toHaveURL(/\/history/);

  // Assert that either the empty state or at least one history entry is present
  const emptyState = page.getByText("You haven't answered any questions yet.");
  const historyEntries = page.locator('ul.divide-y > li');

  // Pass if either the empty state is visible or at least one entry is present
  if (await emptyState.isVisible()) {
    await expect(emptyState).toBeVisible();
  } else {
    await expect(historyEntries).toHaveCountGreaterThan(0);
    // Optionally, check for question text and selected option
    await expect(historyEntries.first()).toContainText(/selected option id/i);
  }
});