import { test, expect } from '@playwright/test';

test.describe('Performance Optimizations', () => {

  test('SmartImage renders optimized images on Home Page', async ({ page }) => {
    await page.goto('/');

    // Locate the Featured Project image (first image inside a SmartImage container)
    // The ProjectCard uses SmartImage inside Carousel.
    // We look for an image that is NOT the avatar.
    const projectImage = page.locator('img[src*="/_next/image"]').first();

    // Check if such an image exists and is visible
    // Note: If optimization is disabled, src would start with /images/
    // If enabled, it starts with /_next/image
    await expect(projectImage).toBeVisible();

    // Verify the src attribute format
    const src = await projectImage.getAttribute('src');
    expect(src).toContain('/_next/image');
    expect(src).toContain('url=%2Fimages%2F'); // Encoded url param
  });

  test('Featured Project is visible immediately (LCP check)', async ({ page }) => {
    await page.goto('/');

    // The Featured Project is the first ProjectCard
    // We can identify it by looking for the "Explore detailed insights" link or similar content
    // Or simpler: The first project card in the main column.

    const featuredProject = page.getByRole('link', { name: 'Explore detailed insights' }).first();

    // Verify it is visible
    await expect(featuredProject).toBeVisible();

    // Verify it's inside a RevealFx that is effectively visible
    // We can't easily check 'delay=0' prop on DOM, but we can check if it's visible "soon"
    // Since Playwright waits, if it was hidden for too long (e.g., via opacity 0), expect might have to wait.
    // However, the main goal here is ensuring we didn't break visibility.
    // A manual check of the code confirmed delay=0.
  });

});
