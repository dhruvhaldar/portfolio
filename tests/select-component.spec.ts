import { test, expect } from '@playwright/test';

test.describe('Select Component Verification', () => {
  test('should open options and allow selection', async ({ page }) => {
    // Navigate to the test page
    await page.goto('/test-components/select');

    // Verify the page loaded
    await expect(page.getByText('Select Component Test')).toBeVisible();

    // Locate the select trigger (input)
    const selectTrigger = page.getByLabel('Test Select');
    await expect(selectTrigger).toBeVisible();
    await expect(selectTrigger).toHaveAttribute('aria-expanded', 'false');

    // Click to open the dropdown
    await selectTrigger.click();
    await expect(selectTrigger).toHaveAttribute('aria-expanded', 'true');

    // Verify options are visible
    const option1 = page.getByRole('option', { name: 'Option 1' });
    const option2 = page.getByRole('option', { name: 'Option 2' });

    await expect(option1).toBeVisible();
    await expect(option2).toBeVisible();

    // Select Option 2
    await option2.click();

    // Verify selection is applied (input value changes)
    await expect(selectTrigger).toHaveValue('opt2');

    // Verify dropdown closes
    await expect(selectTrigger).toHaveAttribute('aria-expanded', 'false');
  });

  test('should support keyboard navigation', async ({ page }) => {
    await page.goto('/test-components/select');
    const selectTrigger = page.getByLabel('Test Select');

    // Focus and open with Enter
    await selectTrigger.focus();
    await page.keyboard.press('Enter');
    await expect(selectTrigger).toHaveAttribute('aria-expanded', 'true');

    // Navigate down
    await page.keyboard.press('ArrowDown');
    // We expect focus/highlight to move. Since implementation details vary,
    // we assume the component handles aria-activedescendant or focus management.
    // Based on the code, it uses aria-activedescendant.

    // Select with Enter
    await page.keyboard.press('Enter');

    // Since we just pressed ArrowDown once from top, it usually highlights first or second depending on implementation.
    // The code says: default highlighted is null. ArrowDown -> 0 (Option 1).
    await expect(selectTrigger).toHaveValue('opt1');
    await expect(selectTrigger).toHaveAttribute('aria-expanded', 'false');
  });
});
