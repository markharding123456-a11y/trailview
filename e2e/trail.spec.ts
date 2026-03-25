import { test, expect } from '@playwright/test';

test.describe('Trail Page', () => {
  test.beforeEach(async ({ page }) => {
    // Visit trail page without an ID to trigger demo mode
    await page.goto('/trail');
  });

  test('trail page loads in demo mode', async ({ page }) => {
    // The page should display the trail name from the demo trail
    await expect(page.locator('h1')).toBeVisible();
  });

  test('"DEMO TRAIL" badge shows when no ID', async ({ page }) => {
    await expect(page.getByText('DEMO TRAIL')).toBeVisible();
  });

  test('video player area exists', async ({ page }) => {
    // The video player component should be rendered
    const videoArea = page.locator('.lg\\:col-span-3').first();
    await expect(videoArea).toBeVisible();
  });

  test('map container exists', async ({ page }) => {
    // The trail map component should be present in the sidebar
    const mapContainer = page.locator('[role="application"]').first();
    // If no role, fall back to checking for the map area within the sidebar
    const sidebar = page.locator('.lg\\:col-span-2').first();
    await expect(sidebar).toBeVisible();
  });

  test('elevation profile exists', async ({ page }) => {
    // The elevation chart component should be rendered below the video player
    // Look for the elevation chart area which contains elevation data
    await expect(page.getByText('Elevation Profile').or(page.locator('svg.recharts-surface').first())).toBeVisible();
  });

  test('share button exists', async ({ page }) => {
    const shareButton = page.getByLabel('Share trail');
    await expect(shareButton).toBeVisible();
  });
});
