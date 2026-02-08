import { render } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import LazyframeVideo from '@/components/LazyframeVideo';

// Mock lazyframe to avoid DOM issues
vi.mock('lazyframe', () => ({
  default: vi.fn(),
}));

// Mock css import
vi.mock('lazyframe/dist/lazyframe.css', () => ({}));

describe('LazyframeVideo Thumbnail Security', () => {
  it('should not render unsafe thumbnail URLs', () => {
    const src = 'https://www.youtube.com/watch?v=dQw4w9WgXcQ';
    const unsafeThumbnail = 'javascript:alert(1)';

    const { container } = render(<LazyframeVideo src={src} thumbnail={unsafeThumbnail} />);

    const lazyframeDiv = container.querySelector('.lazyframe');
    expect(lazyframeDiv).toBeInTheDocument();

    // Check that unsafe thumbnail is NOT used in data-thumbnail
    expect(lazyframeDiv).not.toHaveAttribute('data-thumbnail', unsafeThumbnail);

    // Check that unsafe thumbnail is NOT used in background-image style
    const style = lazyframeDiv?.getAttribute('style') || '';
    expect(style).not.toContain(unsafeThumbnail);

    // It should fall back to default thumbnail (from YouTube ID)
    expect(lazyframeDiv?.getAttribute('data-thumbnail')).toContain('https://i.ytimg.com/vi/dQw4w9WgXcQ/hqdefault.jpg');
  });

  it('should render safe thumbnail URLs', () => {
    const src = 'https://www.youtube.com/watch?v=dQw4w9WgXcQ';
    const safeThumbnail = 'https://example.com/thumb.jpg';

    const { container } = render(<LazyframeVideo src={src} thumbnail={safeThumbnail} />);

    const lazyframeDiv = container.querySelector('.lazyframe');
    expect(lazyframeDiv).toBeInTheDocument();

    expect(lazyframeDiv).toHaveAttribute('data-thumbnail', safeThumbnail);
    const style = lazyframeDiv?.getAttribute('style') || '';
    expect(style).toContain(safeThumbnail);
  });
});
