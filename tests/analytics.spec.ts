import { test, expect } from '@playwright/test';

test('Google Analytics should be loaded', async ({ page }) => {
  await page.goto('/');

  // Check if the script with the GA ID is present
  const gaScript = page.locator('script[src*="googletagmanager.com/gtag/js?id=G-D5DG6N0RGV"]');
  await expect(gaScript).toHaveCount(1);

  // Check if dataLayer is defined on the window object
  const dataLayerDefined = await page.evaluate(() => {
    return typeof (window as any).dataLayer !== 'undefined';
  });
  expect(dataLayerDefined).toBeTruthy();

  // Check if gtag function is defined
  const gtagDefined = await page.evaluate(() => {
    return typeof (window as any).gtag === 'function';
  });
  expect(gtagDefined).toBeTruthy();
});
