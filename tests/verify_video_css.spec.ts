import { test, expect } from '@playwright/test';

test('Video component renders with thumbnail and plays on click', async ({ page }) => {
  // Navigate to a project page that contains a video
  page.on('console', msg => console.log('PAGE LOG:', msg.text()));
  await page.goto('/work/aesir-rocket-project');

  // Locate the lazyframe container
  const videoContainer = page.locator('.lazyframe').first();

  // Scroll into view to trigger lazy loading logic
  await videoContainer.evaluate(el => el.scrollIntoView());

  // Expect the container to be visible
  await expect(videoContainer).toBeVisible();

  // Verify that the wrapper has rounded corners (radius="l" corresponds to a specific var or value, usually overflow hidden on the relative wrapper)
  const wrapper = videoContainer.locator('xpath=..');
  await expect(wrapper).toHaveCSS('overflow', 'hidden');
  await expect(wrapper).toHaveCSS('border-radius', /.+/); // Check for non-empty border-radius

  // Verify the data-vendor attribute
  await expect(videoContainer).toHaveAttribute('data-vendor', 'youtube');

  // Verify that the thumbnail is set (background-image is not none)
  const bgImage = await videoContainer.evaluate(el => window.getComputedStyle(el).backgroundImage);
  expect(bgImage).toContain('url("https://i.ytimg.com/vi/');
  expect(bgImage).toContain('hqdefault.jpg")');

  // Verify Overlays presence (before clicking)
  // Verify Overlays presence (before clicking)
  // Check for the title text
  const titleOverlay = wrapper.locator('text=Sigmundr Rocket Launch').first();
  await expect(titleOverlay).toBeVisible();

  // Verify YouTube Logo is present (checking for image)
  const logoOverlay = wrapper.locator('img[alt="YouTube"]').first();
  await expect(logoOverlay).toBeVisible();

  // Click the wrapper to trigger load (wrapper handles the click capture)
  await wrapper.click();

  // Verify Overlays disappear after click
  await expect(titleOverlay).not.toBeVisible();
  // We can't strictly check iconOverlay not visible because if it's in the DOM but hidden, or removed.
  // The code removes them from DOM: {!isPlaying && ...}
  await expect(titleOverlay).toHaveCount(0);

  // After click, lazyframe should inject an iframe
  const iframe = videoContainer.locator('iframe');
  await expect(iframe).toBeVisible({ timeout: 10000 });

  // Verify iframe source contains youtube and autoplay
  await expect(iframe).toHaveAttribute('src', /youtube\.com\/embed\/.*autoplay=1/);
});
