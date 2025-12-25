import { test, expect } from '@playwright/test';

test('Video component renders with lazyframe styles and interactive elements', async ({ page }) => {
  // Navigate to a project page that contains a video
  await page.goto('/work/aesir-rocket-project');

  // Locate the lazyframe container
  const videoContainer = page.locator('.lazyframe');
  await expect(videoContainer).toBeVisible();

  // Verify that the container has 'relative' positioning, which is critical for the overlay placement
  // This confirms lazyframe.css is loaded.
  await expect(videoContainer).toHaveCSS('position', 'relative');

  // Verify the 'lazyframe' class is present
  await expect(videoContainer).toHaveClass(/lazyframe/);

  // Verify the data-vendor attribute
  await expect(videoContainer).toHaveAttribute('data-vendor', 'youtube');

  // Check that the play button overlay (::after) effectively makes the element clickable
  // We can simulate hover to check cursor if needed, but clicking is the ultimate test.

  // Click the video to trigger load
  await videoContainer.click();

  // After click, lazyframe should inject an iframe
  const iframe = videoContainer.locator('iframe');
  await expect(iframe).toBeVisible({ timeout: 10000 });

  // Verify iframe source contains youtube
  await expect(iframe).toHaveAttribute('src', /youtube\.com/);
});
