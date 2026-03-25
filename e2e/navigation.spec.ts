import { test, expect } from '@playwright/test';

test.describe('Navigation', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('clicking "Explore" navigates to /explore', async ({ page }) => {
    await page.locator('nav').getByRole('link', { name: 'Explore' }).click();
    await expect(page).toHaveURL(/\/explore/);
  });

  test('clicking logo navigates to /', async ({ page }) => {
    // Navigate away first
    await page.goto('/explore');
    await page.locator('nav a[href="/"]').click();
    await expect(page).toHaveURL('/');
  });

  test('all main nav links are present', async ({ page }) => {
    const nav = page.locator('nav');

    await expect(nav.getByRole('link', { name: 'How It Works' })).toBeVisible();
    await expect(nav.getByRole('link', { name: 'Activities' })).toBeVisible();
    await expect(nav.getByRole('link', { name: 'Regions' })).toBeVisible();
    await expect(nav.getByRole('link', { name: 'Contribute' })).toBeVisible();
    await expect(nav.getByRole('link', { name: 'Upload' })).toBeVisible();
    await expect(nav.getByRole('link', { name: 'Sign Up' })).toBeVisible();
    await expect(nav.getByRole('link', { name: 'Explore' })).toBeVisible();
  });

  test('mobile hamburger menu opens and closes', async ({ page }) => {
    // Set mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('/');

    // Desktop nav links should be hidden on mobile
    const desktopExplore = page.locator('nav .hidden.md\\:flex');
    await expect(desktopExplore).toBeHidden();

    // Hamburger button should be visible
    const hamburger = page.getByLabel('Open menu');
    await expect(hamburger).toBeVisible();

    // Open the menu
    await hamburger.click();

    // Menu links should now be visible
    await expect(page.getByRole('link', { name: 'How It Works' }).first()).toBeVisible();
    await expect(page.getByRole('link', { name: 'Activities' }).first()).toBeVisible();
    await expect(page.getByRole('link', { name: 'Regions' }).first()).toBeVisible();
    await expect(page.getByRole('link', { name: 'Contribute' }).first()).toBeVisible();
    await expect(page.getByRole('link', { name: 'Explore' }).first()).toBeVisible();

    // Close the menu
    const closeButton = page.getByLabel('Close menu');
    await closeButton.click();

    // Hamburger should be back to "Open menu"
    await expect(page.getByLabel('Open menu')).toBeVisible();
  });
});
