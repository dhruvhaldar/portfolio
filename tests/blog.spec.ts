import { test, expect } from '@playwright/test';

test.describe('Blog Page Navigation and Content', () => {
    
  test('Blog page loads and lists posts', async ({ page }) => {
    await page.goto('/blog');

    // Verify Blog title
    await expect(page.getByRole('heading', { name: 'Blog', exact: true })).toBeVisible();

    // Verify at least one post is visible
    const posts = page.locator('a[href^="/blog/"]');
    await expect(posts.first()).toBeVisible();
    
    await expect(page.getByText('Making OpenFOAM Accessible: Why I Built FOAMTrame')).toBeVisible();
    await expect(page.getByText('July 24, 2026')).toBeVisible();
    await expect(page.getByText('No posts found.')).toHaveCount(0);
    await expect(page.getByText(/Updated \d{4}-\d{2}-\d{2}/)).toBeVisible();
  });

  test('Blog post page loads correctly', async ({ page }) => {
    await page.goto('/blog/foamflask_post_1');

    // Verify Post Title
    await expect(page.getByRole('heading', { name: 'Making OpenFOAM Accessible: Why I Built FOAMTrame', exact: true })).toBeVisible();

    // Verify post content
    await expect(page.getByRole('heading', { name: 'The Vision: "One Click to Physics"' })).toBeVisible();
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
