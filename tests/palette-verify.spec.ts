import { test, expect } from '@playwright/test';

test('Footer icons have accessible labels', async ({ page }) => {
  await page.goto('/');

  // Find the footer
  const footer = page.locator('footer');
  await expect(footer).toBeVisible();

  // Find the GitHub link (based on href)
  const githubLink = footer.locator('a[href*="github"]');
  await expect(githubLink).toBeVisible();

  // Check if it has aria-label="GitHub"
  // Note: content.tsx defines name: "GitHub" which is passed as tooltip.
  await expect(githubLink).toHaveAttribute('aria-label', 'GitHub');
});
