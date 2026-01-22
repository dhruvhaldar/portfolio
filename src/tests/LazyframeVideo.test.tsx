import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import LazyframeVideo from '@/components/LazyframeVideo';

// Mock lazyframe to avoid DOM issues
vi.mock('lazyframe', () => ({
  default: vi.fn(),
}));

// Mock css import
vi.mock('lazyframe/dist/lazyframe.css', () => ({}));

describe('LazyframeVideo', () => {
  it('should render for valid YouTube URLs', () => {
    const { container } = render(<LazyframeVideo src="https://www.youtube.com/watch?v=dQw4w9WgXcQ" />);
    // Should render the wrapper div
    expect(container.firstChild).not.toBeNull();
    const lazyframeDiv = container.querySelector('.lazyframe');
    expect(lazyframeDiv).toBeInTheDocument();
  });

  it('renders with custom thumbnail', () => {
    const customThumbnail = "https://example.com/thumb.jpg";
    render(
      <LazyframeVideo
        src="https://www.youtube.com/watch?v=dQw4w9WgXcQ"
        thumbnail={customThumbnail}
      />
    );
    const element = document.querySelector('.lazyframe') as HTMLElement;
    expect(element).toHaveAttribute('data-thumbnail', customThumbnail);
    expect(element).toHaveStyle(`background-image: url("${customThumbnail}")`);
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

  it('should return null for URLs containing youtube pattern but hosted elsewhere', () => {
    // This attempts to trick the regex by including youtube.com in the query string
    const { container } = render(<LazyframeVideo src="https://evil.com/fake?u=youtube.com/watch?v=dQw4w9WgXcQ" />);
    expect(container.firstChild).toBeNull();
  });

  it('should sanitize query parameters by reconstructing the URL', () => {
      // 🛡️ Sentinel: Verify that extra parameters (potential injection) are stripped
      const dirtyUrl = "https://www.youtube.com/watch?v=dQw4w9WgXcQ&onload=alert(1)";
      const { container } = render(<LazyframeVideo src={dirtyUrl} />);

      const lazyframeDiv = container.querySelector('.lazyframe');
      const dataSrc = lazyframeDiv?.getAttribute('data-src');

      // Expect the clean URL, not the dirty one
      expect(dataSrc).toBe("https://www.youtube.com/watch?v=dQw4w9WgXcQ");
      expect(dataSrc).not.toContain("onload=alert(1)");
  });
});
