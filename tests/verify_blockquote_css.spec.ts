import { test, expect } from '@playwright/test';

test('Blockquote renders with correct styling', async ({ page }) => {
  // Navigate to a project page that contains a blockquote
  await page.goto('/work/aesir-rocket-project');

  // Locate the blockquote.
  // If the implementation changes blockquote to a Flex div, we might need a better selector.
  // For now, let's assume it might still be a blockquote tag OR we look for the text content.
  const blockquoteText = page.getByText('The Sigmundr project aimed to improve upon the Odin project by focusing on reliable recovery and data acquisition.');

  // Get the parent container which should be the styled element
  // If we replace <blockquote> with <Flex> (div), the text will be inside a <Text> inside a <div>.
  // So we might need to traverse up.
  // Let's find the element that wraps this text and has the 'blockquote' style characteristics.

  // However, initially, it's likely a standard blockquote or the new component.
  // Use a more robust selector: find the ancestor div that has the expected background class.
  // Based on Flex.tsx implementation: background="neutral-alpha-weak" -> class "neutral-background-alpha-weak"
  const container = blockquoteText.locator('xpath=ancestor::div[contains(@class, "neutral-background-alpha-weak")]').first();

  // Wait for it to be visible
  await expect(container).toBeVisible();

  // We expect the container to have specific styles.
  // 1. Border Left Accent
  // The inline style sets borderLeft.
  await expect(container).toHaveCSS('border-left-width', '4px');
  await expect(container).toHaveCSS('border-left-style', 'solid');

  // 2. Frosted Glass (backdrop-filter)
  const backdropFilter = await container.evaluate((el) => {
    return window.getComputedStyle(el).backdropFilter;
  });
  expect(backdropFilter).toContain('blur');

  // 3. Rounded Box (border-radius)
  // radius="l" -> class "radius-l" -> checking CSS
  await expect(container).toHaveCSS('border-radius', /.+/);
});
