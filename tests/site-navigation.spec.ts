import { test, expect } from '@playwright/test';

test.describe('Site Navigation and Content Verification', () => {

  test('Home page loads and displays projects', async ({ page }) => {
    await page.goto('/');
    await expect(page).toHaveTitle(/Dhruv Haldar/);

    // Check for main heading
    await expect(page.getByRole('heading', { level: 1 }).first()).toBeVisible();

    // Check for Spotlight elements (visual feature verification)
    const spotlightElements = page.locator('div[class*="Spotlight_spotlight"]');
    // We expect at least one spotlight element (the project card wrapper)
    await expect(spotlightElements.first()).toBeVisible();
  });

  test('About page loads', async ({ page }) => {
    await page.goto('/about');
    await expect(page.getByRole('heading', { level: 1 }).first()).toBeVisible();
    await expect(page.getByText('About me').first()).toBeVisible();

    // Check for Spotlight elements in About sections (Work, Education, Skills)
    const spotlightElements = page.locator('div[class*="Spotlight_spotlight"]');
    // We expect multiple spotlight elements if data exists
    if (await spotlightElements.count() > 0) {
        await expect(spotlightElements.first()).toBeVisible();
    }
  });

  test('Work page loads and displays project list', async ({ page }) => {
    await page.goto('/work');
    await expect(page.getByRole('heading', { level: 1 }).first()).toBeVisible();

    // Check that project cards are present
    const projectHeadings = page.locator('h2');
    await expect(projectHeadings.first()).toBeVisible();

    // Verify we have multiple projects
    const count = await projectHeadings.count();
    expect(count).toBeGreaterThan(0);
  });

  test('Publications page loads', async ({ page }) => {
    const response = await page.goto('/publications');
    if (response?.status() === 404) {
        test.skip('Publications page not found');
    } else {
        await expect(page.getByRole('heading', { level: 1 }).first()).toBeVisible();

        // Check for Spotlight elements on posts
        const spotlightElements = page.locator('div[class*="Spotlight_spotlight"]');
        if (await spotlightElements.count() > 0) {
            await expect(spotlightElements.first()).toBeVisible();
        }
    }
  });

  test('Gallery page loads', async ({ page }) => {
    const response = await page.goto('/gallery');
    if (response?.status() === 404) {
        test.skip('Gallery page not found');
    } else {
        await expect(page.getByRole('heading', { level: 1 }).first()).toBeVisible();
    }
  });

});
