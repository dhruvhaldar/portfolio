import { test, expect } from '@playwright/test';

test('Video component renders with thumbnail and plays on click', async ({ page }) => {
  // Navigate to a project page that contains a video
  await page.goto('/work/aesir-rocket-project');

  // Locate the lazyframe container
  const videoContainer = page.locator('.lazyframe').first();

  // Scroll into view to trigger lazy loading logic
  // Using evaluate because scrollIntoViewIfNeeded might be behaving unexpectedly in this context
  await videoContainer.evaluate(el => el.scrollIntoView());

  // Expect the container to be visible
  await expect(videoContainer).toBeVisible();

  // Verify that the container has 'relative' positioning (CSS loaded)
  await expect(videoContainer).toHaveCSS('position', 'relative');

  // Verify the 'lazyframe--loaded' class is added (lazyframe initialized)
  await expect(videoContainer).toHaveClass(/lazyframe--loaded/);

  // Verify the data-vendor attribute
  await expect(videoContainer).toHaveAttribute('data-vendor', 'youtube');

  // Verify that the thumbnail is set (background-image is not none)
  // We use evaluate because toHaveCSS with specific URL can be tricky with quotes
  const bgImage = await videoContainer.evaluate(el => window.getComputedStyle(el).backgroundImage);
  expect(bgImage).toContain('url("https://i.ytimg.com/vi/');
  expect(bgImage).toContain('hqdefault.jpg")');

  // Click the video to trigger load
  await videoContainer.click();

  // After click, lazyframe should inject an iframe
  const iframe = videoContainer.locator('iframe');
  await expect(iframe).toBeVisible({ timeout: 10000 });

  // Verify iframe source contains youtube and autoplay
  await expect(iframe).toHaveAttribute('src', /youtube\.com\/embed\/.*autoplay=1/);
});
