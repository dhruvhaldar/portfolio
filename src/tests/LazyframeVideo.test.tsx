import { render } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import LazyframeVideo from '@/components/LazyframeVideo';

// Mock lazyframe to avoid DOM issues
vi.mock('lazyframe', () => ({
  default: vi.fn(),
}));

// Mock css import
vi.mock('lazyframe/dist/lazyframe.css', () => ({}));

describe('LazyframeVideo Security', () => {
  it('should render for valid YouTube URLs', () => {
    const { container } = render(<LazyframeVideo src="https://www.youtube.com/watch?v=dQw4w9WgXcQ" />);
    // Should render the wrapper div
    expect(container.firstChild).not.toBeNull();
    const lazyframeDiv = container.querySelector('.lazyframe');
    expect(lazyframeDiv).toBeInTheDocument();
  });

  it('should return null for invalid URLs (XSS protection)', () => {
    // Malicious URL
    const { container } = render(<LazyframeVideo src="javascript:alert(1)" />);
    expect(container.firstChild).toBeNull();
  });

  it('should return null for non-YouTube URLs (Vendor enforcement)', () => {
    const { container } = render(<LazyframeVideo src="https://vimeo.com/123456" />);
    expect(container.firstChild).toBeNull();
  });
});
