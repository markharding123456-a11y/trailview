import { test, expect } from '@playwright/test';

test.describe('Static Pages', () => {
  test('/activities page loads with all activity types', async ({ page }) => {
    await page.goto('/activities');

    const expectedActivities = [
      'Mountain Biking',
      'Motorcycle',
      'ATV/UTV',
      'Skiing/Snowboarding',
      'Snowmobile',
      'Hiking',
      'Hunting',
      'Camping/Overlanding',
      'Horseback Riding',
      'Fishing',
      'Cross-Country Skiing',
      'Snowshoeing',
      'Rock Climbing',
    ];

    for (const activity of expectedActivities) {
      await expect(page.getByText(activity).first()).toBeVisible();
    }
  });

  test('/regions page loads', async ({ page }) => {
    await page.goto('/regions');

    // The page should render and show region-related content
    await expect(page.locator('body')).toBeVisible();
    // Check for some BC region names
    await expect(page.getByText('Whistler').first()).toBeVisible();
  });

  test('/leaderboard page loads', async ({ page }) => {
    await page.goto('/leaderboard');

    await expect(page.locator('body')).toBeVisible();
    // The leaderboard page should have some identifiable content
    await expect(page.getByText('Leaderboard').first().or(page.getByText('Contributors').first())).toBeVisible();
  });

  test('/legal page loads with terms sections', async ({ page }) => {
    await page.goto('/legal');

    await expect(page.getByRole('heading', { name: 'Legal' })).toBeVisible();

    // Check for the key legal sections in the quick nav
    await expect(page.getByText('Terms of Service')).toBeVisible();
    await expect(page.getByText('Privacy Policy')).toBeVisible();
    await expect(page.getByText('EULA')).toBeVisible();
    await expect(page.getByText('Contributor Agreement')).toBeVisible();
    await expect(page.getByText('Liability Waiver')).toBeVisible();
    await expect(page.getByText('Copyright & DMCA')).toBeVisible();
  });

  test('/contribute page loads', async ({ page }) => {
    await page.goto('/contribute');

    await expect(page.getByText('Film Your Trail').first()).toBeVisible();
    await expect(page.getByText('Share It With the World').first()).toBeVisible();
  });

  test('/signup page loads with form', async ({ page }) => {
    await page.goto('/signup');

    // Check form fields are present
    await expect(page.locator('input[type="text"], input[placeholder*="name" i]').first()).toBeVisible();
    await expect(page.locator('input[type="email"], input[placeholder*="email" i]').first()).toBeVisible();
    await expect(page.locator('input[type="password"]').first()).toBeVisible();
  });

  test('404 page shows for /nonexistent-page', async ({ page }) => {
    await page.goto('/nonexistent-page');

    await expect(page.getByText('404')).toBeVisible();
    await expect(page.getByText('Trail Not Found')).toBeVisible();
    await expect(page.getByRole('link', { name: 'Back to Home' })).toBeVisible();
    await expect(page.getByRole('link', { name: 'Explore Trails' })).toBeVisible();
  });
});
