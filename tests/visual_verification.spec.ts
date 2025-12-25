import { test, expect } from '@playwright/test';
import path from 'path';

test('Visual verification of changes', async ({ page }) => {
  // 1. Verify Video and Blockquote on Project Page
  await page.goto('/work/aesir-rocket-project');

  // Wait for content to load
  await expect(page.locator('h1')).toBeVisible();

  // Scroll to Video (assuming there's a video)
  // We can locate the video container we created
  const videoContainer = page.locator('.lazyframe');
  if (await videoContainer.count() > 0) {
    await videoContainer.first().scrollIntoViewIfNeeded();
    await page.screenshot({ path: 'verification/video_embed.png' });
  }

  // Scroll to Blockquote
  // The blockquote is a Flex container with specific background class
  const blockquote = page.locator('div.neutral-background-alpha-weak').first();
  if (await blockquote.count() > 0) {
    await blockquote.scrollIntoViewIfNeeded();
    await page.screenshot({ path: 'verification/blockquote.png' });
  }

  // 2. Verify About Page Changes (Spotlight Summary + Schedule Call)
  await page.goto('/about');
  await expect(page.locator('h1').first()).toBeVisible();

  // Summary Spotlight
  // It's likely the first spotlight card or near the top
  // We can look for the summary text or the spotlight component wrapper
  // Let's just screenshot the top section
  await page.screenshot({ path: 'verification/about_page.png' });

  // Schedule Call Button
  // Locate by text "Schedule a call"
  const scheduleButton = page.getByText('Schedule a call');
  if (await scheduleButton.count() > 0) {
      // Get parent link to verify it's clickable (we tested this logic already, here strictly for visual)
      await scheduleButton.scrollIntoViewIfNeeded();
      // Take screenshot of the button area
      await page.locator('a').filter({ has: scheduleButton }).first().screenshot({ path: 'verification/schedule_button.png' });
  }
});
