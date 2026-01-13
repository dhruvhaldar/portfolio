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

      // Allow for cases where custom OG image logic might be missing but fallback should exist
      // We wait for it to be attached
      await expect(ogImageMeta).toHaveCount(1);

      const ogImageUrl = await ogImageMeta.getAttribute('content');
      expect(ogImageUrl).toBeTruthy();

      console.log(`Found OG Image URL for ${route}: ${ogImageUrl}`);

      // Rewrite URL to localhost for verification against local build
      let urlToFetch = ogImageUrl!;
      try {
        const urlObj = new URL(ogImageUrl!);
        // If it points to the production domain, rewrite to localhost
        if (urlObj.hostname !== 'localhost') {
             urlToFetch = `${baseURL}${urlObj.pathname}${urlObj.search}`;
        }
      } catch (e) {
        // Relative URL, resolve against baseURL
        urlToFetch = new URL(ogImageUrl!, baseURL).toString();
      }

      console.log(`Verifying OG Image content at: ${urlToFetch}`);

      // Fetch the image to verify it exists
      const response = await request.get(urlToFetch);

      // Check for 200 OK
      expect(response.status()).toBe(200);

      // Check content type (should be image/png, image/jpeg, etc.)
      const contentType = response.headers()['content-type'];
      expect(contentType).toMatch(/^image\//);
    });
  }
});
