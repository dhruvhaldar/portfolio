import { test, expect } from '@playwright/test';

test.describe('Project Flow', () => {
    test('Can navigate to a project detail', async ({ page }) => {
        await page.goto('/work');

        // Find a project link/card. Assuming links are present.
        // We'll look for a link that goes to /work/...
        const projectLink = page.locator('a[href^="/work/"]').first();

        if (await projectLink.count() > 0) {
            const href = await projectLink.getAttribute('href');
            await projectLink.click();

            // Verify URL
            await expect(page).toHaveURL(new RegExp(href!));

            // Verify heading exists on detail page
            await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
        } else {
            // No projects to click
            test.skip('No projects found to test navigation');
        }
    });
});
