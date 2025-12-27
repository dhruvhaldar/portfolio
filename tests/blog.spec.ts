import { test, expect } from '@playwright/test';

test.describe('Blog Page Navigation and Content', () => {
    
  test('Blog page loads and lists posts', async ({ page }) => {
    await page.goto('/blog');

    // Verify Blog title
    await expect(page.getByRole('heading', { name: 'Blog', exact: true })).toBeVisible();

    // Verify at least one post is visible
    const posts = page.locator('a[href^="/blog/"]');
    await expect(posts.first()).toBeVisible();
    
    // Using the sample post we added "Styling your portfolio"
    // The slug is likely 'styling-your-portfolio' or 'styling' depending on filename/fontmatter.
    // Filename 'styling.mdx' -> slug 'styling'.
    // Title "Styling your portfolio".
    
    // Check for specific post title
    await expect(page.getByText('Styling your portfolio')).toBeVisible();
  });

  test('Blog post page loads correctly', async ({ page }) => {
    await page.goto('/blog/styling');

    // Verify Post Title
    await expect(page.getByRole('heading', { name: 'Styling your portfolio', exact: true })).toBeVisible();

    // Verify metadata/content
    await expect(page.getByText('Magic Portfolio')).toBeVisible(); // tag
    await expect(page.getByText('Global style')).toBeVisible(); // h2
  });

  test('Gallery link is hidden in navigation', async ({ page }) => {
    await page.goto('/');
    
    // "Gallery" should NOT be in the navigation bar
    // Assuming navigation links are in a header or nav element
    const galleryLink = page.getByRole('link', { name: 'Gallery' });
    await expect(galleryLink).not.toBeVisible();
  });

  test('Blog link is visible in navigation', async ({ page }) => {
     await page.goto('/');

     const blogLink = page.getByRole('link', { name: 'Blog' });
     await expect(blogLink).toBeVisible();
  });

});
