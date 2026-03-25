import { test, expect } from '@playwright/test';

test.describe('Homepage', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('loads with TRAILVIEW branding', async ({ page }) => {
    await expect(page.locator('nav').getByText('TRAILVIEW')).toBeVisible();
  });

  test('hero section has "See Every Trail" heading', async ({ page }) => {
    await expect(page.locator('h1')).toContainText('See Every Trail');
  });

  test('"Explore Trails" CTA button exists and links to /explore', async ({ page }) => {
    const cta = page.locator('a', { hasText: 'Explore Trails' }).first();
    await expect(cta).toBeVisible();
    await expect(cta).toHaveAttribute('href', '/explore');
  });

  test('"How It Works" section is visible', async ({ page }) => {
    const section = page.locator('#how-it-works');
    await expect(section).toBeVisible();
    await expect(section).toContainText('How TrailView Works');
  });

  test('all 13 activity type cards render', async ({ page }) => {
    const activitySection = page.locator('#activities');
    await expect(activitySection).toBeVisible();

    const activityCards = activitySection.locator('a');
    await expect(activityCards).toHaveCount(13);

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
      await expect(activitySection.getByText(activity, { exact: true })).toBeVisible();
    }
  });

  test('footer renders with links', async ({ page }) => {
    const footer = page.locator('footer');
    await expect(footer).toBeVisible();
    await expect(footer.getByText('TRAILVIEW')).toBeVisible();

    // Check key footer links
    await expect(footer.locator('a[href="/explore"]')).toBeVisible();
    await expect(footer.locator('a[href="/activities"]')).toBeVisible();
    await expect(footer.locator('a[href="/regions"]')).toBeVisible();
    await expect(footer.locator('a[href="/contribute"]')).toBeVisible();
    await expect(footer.locator('a[href="/legal"]')).toBeVisible();
    await expect(footer.locator('a[href="/signup"]')).toBeVisible();
    await expect(footer.locator('a[href="/leaderboard"]')).toBeVisible();
  });
});
