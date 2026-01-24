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
    // Find by class name since data-testid wasn't added in the component code (unless I add it)
    // Actually, I can query by data-thumbnail
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

  it('should use a reconstructed safe URL for data-src', () => {
    // Input has some extra parameters that we want stripped, or just normal input
    const inputSrc = "https://www.youtube.com/watch?v=dQw4w9WgXcQ&feature=share";
    // Expected: strict reconstruction
    const expectedSrc = "https://www.youtube.com/watch?v=dQw4w9WgXcQ";

    const { container } = render(<LazyframeVideo src={inputSrc} />);
    const lazyframeDiv = container.querySelector('.lazyframe');

    expect(lazyframeDiv).toHaveAttribute('data-src', expectedSrc);
  });
});
