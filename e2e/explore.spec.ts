import { test, expect } from '@playwright/test';

test.describe('Explore Page', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/explore');
  });

  test('loads with "Explore Trails" heading', async ({ page }) => {
    await expect(page.getByRole('heading', { name: 'Explore Trails' })).toBeVisible();
  });

  test('search input exists and can be typed into', async ({ page }) => {
    const searchInput = page.getByLabel('Search trails');
    await expect(searchInput).toBeVisible();
    await searchInput.fill('Whistler');
    await expect(searchInput).toHaveValue('Whistler');
  });

  test('activity filter buttons render', async ({ page }) => {
    // "All Activities" button should be present
    await expect(page.getByRole('button', { name: 'All Activities' })).toBeVisible();

    // Check for some specific activity filter buttons
    await expect(page.getByRole('button', { name: 'Mountain Biking' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'Hiking' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'Skiing/Snowboarding' })).toBeVisible();
  });

  test('difficulty filter buttons render', async ({ page }) => {
    await expect(page.getByRole('button', { name: 'Easy' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'Intermediate' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'Advanced' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'Expert' })).toBeVisible();
  });

  test('trail list shows items', async ({ page }) => {
    // The sidebar trail list contains buttons for each trail
    const trailItems = page.locator('.overflow-y-auto button');
    const count = await trailItems.count();
    expect(count).toBeGreaterThan(0);
  });

  test('clicking a trail shows the detail overlay', async ({ page }) => {
    // Click the first trail in the list
    const firstTrail = page.locator('.overflow-y-auto button').first();
    await firstTrail.click();

    // The overlay should appear with a "Watch Trail Video" link
    await expect(page.getByRole('link', { name: 'Watch Trail Video' })).toBeVisible();

    // The overlay should show trail details like Distance and Elevation
    await expect(page.getByText('Distance')).toBeVisible();
    await expect(page.getByText('Elevation')).toBeVisible();
  });
});
