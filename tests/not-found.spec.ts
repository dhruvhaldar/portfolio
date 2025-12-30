import { test, expect } from '@playwright/test';

test.describe('404 Page', () => {
    test('should display 404 page with Go Home button', async ({ page }) => {
        // Navigate to a non-existent page
        await page.goto('/non-existent-page-12345', { waitUntil: 'networkidle', timeout: 60000 });

        // Verify 404 text
        await expect(page.getByText('404')).toBeVisible({ timeout: 60000 });
        await expect(page.getByText('Page Not Found')).toBeVisible();

        // Verify Go Home button
        const goHomeButton = page.getByRole('link', { name: 'Go Home' });
        await expect(goHomeButton).toBeVisible();
        await expect(goHomeButton).toHaveAttribute('href', '/');

        // Verify navigation
        await goHomeButton.click();
        await expect(page).toHaveURL('/');
    });
});
