import { test, expect } from '@playwright/test';

const baseURL = 'http://localhost:3000';

test.describe('OpenGraph Image Verification', () => {
  const routes = [
    '/',
    '/work',
    '/blog',
    '/work/aesir-rocket-project', // Sample project
    '/blog/foamflask_post_1'      // Sample blog post
  ];

  for (const route of routes) {
    test(`should have valid og:image for ${route}`, async ({ page, request }) => {
      await page.goto(`${baseURL}${route}`);

      // Locate the og:image meta tag
      const ogImageMeta = page.locator('meta[property="og:image"]');
      await expect(ogImageMeta).toHaveCount(1);

      const ogImageUrl = await ogImageMeta.getAttribute('content');
      expect(ogImageUrl).toBeTruthy();

      // Handle absolute vs relative URLs
      const absoluteUrl = new URL(ogImageUrl!, baseURL).toString();

      console.log(`Verifying OG Image for ${route}: ${absoluteUrl}`);

      // Fetch the image to verify it exists
      const response = await request.get(absoluteUrl);
      expect(response.status()).toBe(200);
      expect(response.headers()['content-type']).toMatch(/^image\//);
    });
  }
});
