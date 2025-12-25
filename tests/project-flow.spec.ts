import { test, expect } from '@playwright/test';

test.describe('Project Flow', () => {
    let projectHref: string | null = null;

    test.beforeAll(async ({ browser }) => {
        const page = await browser.newPage();
        await page.goto('/work');

        const projectLink = page.locator('a[href^="/work/"]').first();
        const count = await projectLink.count();

        if (count > 0) {
            projectHref = await projectLink.getAttribute('href');
        }

        await page.close();
    });

    test('Can navigate to a project detail', async ({ page }) => {
        if (!projectHref) {
            test.skip(true, 'No projects found to test navigation');
        }

        // At this point projectHref is guaranteed to be a string if not skipped,
        // but TypeScript might need check.
        const href = projectHref!;

        await page.goto('/work');
        const projectLink = page.locator(`a[href="${href}"]`).first();
        await projectLink.click();

        // Verify URL
        await expect(page).toHaveURL(new RegExp(href));

        // Verify heading exists on detail page
        await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
    });
});
