import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import LazyframeVideo from '@/components/LazyframeVideo';
import lazyframe from 'lazyframe';

// Mock lazyframe to avoid DOM issues
vi.mock('lazyframe', () => ({
  default: vi.fn(),
}));

// Mock css import
vi.mock('lazyframe/dist/lazyframe.css', () => ({}));

describe('LazyframeVideo', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should render for valid YouTube URLs', () => {
    const { container } = render(<LazyframeVideo src="https://www.youtube.com/watch?v=dQw4w9WgXcQ" />);
    // Should render the wrapper div
    expect(container.firstChild).not.toBeNull();
    const lazyframeDiv = container.querySelector('.lazyframe');
    expect(lazyframeDiv).toBeInTheDocument();
  });

  it('should configure lazyframe with security attributes', () => {
    const title = "Test Video";
    render(<LazyframeVideo src="https://www.youtube.com/watch?v=dQw4w9WgXcQ" title={title} />);

    // Verify lazyframe was called
    expect(lazyframe).toHaveBeenCalled();

    // Get the options passed to lazyframe
    const calls = vi.mocked(lazyframe).mock.calls;
    // Find the call that has arguments
    const call = calls.find(c => c[0]);
    // Or just take the last one since we cleared mocks
    const lastCall = calls[calls.length - 1];

    // Check if lazyframe was called with options
    // lazyframe(element, options)
    const options = lastCall[1] as any;

    expect(options).toBeDefined();
    expect(options.onAppend).toBeDefined();
    expect(typeof options.onAppend).toBe('function');

    // Simulate onAppend callback
    const mockIframe = document.createElement('iframe');
    vi.spyOn(mockIframe, 'setAttribute');

    options.onAppend(mockIframe);

    // Verify security attributes
    expect(mockIframe.setAttribute).toHaveBeenCalledWith(
      'sandbox',
      'allow-scripts allow-same-origin allow-presentation'
    );
    expect(mockIframe.setAttribute).toHaveBeenCalledWith('title', title);
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
});
