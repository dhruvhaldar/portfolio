import { render } from '@testing-library/react';
import { vi, describe, it, expect } from 'vitest';
import LazyframeVideo from '@/components/LazyframeVideo';

// Define the mock using vi.hoisted to ensure it's available before imports
const { mockLazyframe } = vi.hoisted(() => {
  return { mockLazyframe: vi.fn() };
});

vi.mock('lazyframe', () => ({
  default: mockLazyframe
}));

describe('LazyframeVideo Security', () => {
  it('should initialize lazyframe with sandbox configuration', () => {
    const src = 'https://www.youtube.com/watch?v=dQw4w9WgXcQ';
    const title = 'Test Video';

    render(<LazyframeVideo src={src} title={title} />);

    // Check if lazyframe was called
    expect(mockLazyframe).toHaveBeenCalled();

    // Get the second argument (options) passed to lazyframe
    const calls = mockLazyframe.mock.calls;
    // lazyframe(element, options)
    const options = calls[0][1];

    // Assert that options contain onAppend callback
    expect(options).toBeDefined();
    expect(options.onAppend).toBeDefined();
    expect(typeof options.onAppend).toBe('function');

    // Simulate onAppend execution
    const mockIframe = document.createElement('iframe');
    options.onAppend(mockIframe);

    // Assert sandbox attribute
    expect(mockIframe.getAttribute('sandbox')).toBe('allow-scripts allow-same-origin allow-presentation');

    // Assert title attribute
    expect(mockIframe.getAttribute('title')).toBe(title);
  });

  it('should not render for invalid/malicious URLs', () => {
    // Clear mock calls
    mockLazyframe.mockClear();

    const src = 'javascript:alert(1)';
    const title = 'Malicious Video';

    const { container } = render(<LazyframeVideo src={src} title={title} />);

    // Should render nothing
    expect(container.firstChild).toBeNull();
    // Should not initialize lazyframe
    expect(mockLazyframe).not.toHaveBeenCalled();
  });

  it('should re-initialize lazyframe when src changes', () => {
    // Clear mock calls
    mockLazyframe.mockClear();

    const src1 = 'https://www.youtube.com/watch?v=dQw4w9WgXcQ';
    const src2 = 'https://www.youtube.com/watch?v=oHg5SJYRHA0';
    const title = 'Test Video';

    const { rerender } = render(<LazyframeVideo src={src1} title={title} />);

    // Should be called once for first src
    expect(mockLazyframe).toHaveBeenCalledTimes(1);

    // Update prop
    rerender(<LazyframeVideo src={src2} title={title} />);

    // Should be called again for second src
    expect(mockLazyframe).toHaveBeenCalledTimes(2);

    // Verify the second call has the new src in data attribute?
    // mockLazyframe is called with element. We can check the element.
    const secondCallElement = mockLazyframe.mock.calls[1][0];
    const youtubeId2 = 'oHg5SJYRHA0';
    expect(secondCallElement.getAttribute('data-src')).toBe(`https://www.youtube.com/watch?v=${youtubeId2}`);
  });
});
