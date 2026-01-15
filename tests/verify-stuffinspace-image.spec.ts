import { test, expect } from '@playwright/test';

test.describe('Space Debris Project Image Verification', () => {
  test('stuffinspace2.avif image should load and be visible', async ({ page }) => {
    // Navigate to the specific project page
    await page.goto('/work/space-debris-project');

    // Locate the image. We look for an img tag where the src contains 'stuffinspace2.avif'
    // Note: Next.js image optimization might change the URL, but the original filename usually remains in the query string
    // or if unoptimized, it will be the direct path.
    // If it is completely missing, this locator will fail.
    const imageLocator = page.locator('img[src*="stuffinspace2.avif"]');

    // Wait for the image to be attached to the DOM
    await imageLocator.waitFor({ state: 'attached', timeout: 10000 });

    // Scroll into view to ensure lazy loading triggers if applicable
    await imageLocator.scrollIntoViewIfNeeded();

    // Verify it is visible
    await expect(imageLocator).toBeVisible();

    // Verify the image loaded successfully (naturalWidth > 0)
    const isLoaded = await imageLocator.evaluate((img: HTMLImageElement) => {
      return img.complete && img.naturalWidth > 0;
    });

    expect(isLoaded).toBe(true);

    // Verify the HTTP response for the image
    // This catches 404s
    const src = await imageLocator.getAttribute('src');
    if (src) {
        // If it's a relative URL, Playwright handles it relative to base URL,
        // but verifyResponse is easier.
        // However, since we already loaded the page, the request happened.
        // We can reload and catch the request.

        // Alternatively, just fetching the src directly to check 200
        const response = await page.request.get(src);
        expect(response.status()).toBe(200);
    }
  });
});
