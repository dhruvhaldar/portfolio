import { render, fireEvent, screen } from '@testing-library/react';
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
  it('should initialize lazyframe with sandbox and allow configuration', () => {
    const src = 'https://www.youtube.com/watch?v=dQw4w9WgXcQ';
    const title = 'Test Video';

    // Verify component rendering
    const { container } = render(<LazyframeVideo src={src} title={title} />);

    // Check data-src uses youtube-nocookie and autoplay
    const lazyframeDiv = container.querySelector('.lazyframe');
    expect(lazyframeDiv).toHaveAttribute('data-src', expect.stringContaining('youtube-nocookie.com'));
    expect(lazyframeDiv).toHaveAttribute('data-src', expect.stringContaining('autoplay=1'));
    // Check data-vendor is absent to allow generic iframe loading
    expect(lazyframeDiv).not.toHaveAttribute('data-vendor');

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

    // Assert allow attribute
    expect(mockIframe.getAttribute('allow')).toBe('accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture');

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
});

describe('LazyframeVideo Accessibility', () => {
  it('triggers click on video element when Enter is pressed', () => {
    const src = 'https://www.youtube.com/watch?v=dQw4w9WgXcQ';
    // Clear mock calls from previous tests
    mockLazyframe.mockClear();

    const { container } = render(<LazyframeVideo src={src} title="Test Video" />);

    const videoWrapper = screen.getByRole('button', { name: /Play video: Test Video/i });

    // Spy on the click event on the actual target element (the div inside)
    const lazyframeDiv = container.querySelector('.lazyframe');
    if (!lazyframeDiv) throw new Error('Lazyframe div not found');

    const clickSpy = vi.spyOn(lazyframeDiv as HTMLElement, 'click');

    fireEvent.keyDown(videoWrapper, { key: 'Enter' });

    expect(clickSpy).toHaveBeenCalled();
  });

  it('triggers click on video element when Space is pressed', () => {
    const src = 'https://www.youtube.com/watch?v=dQw4w9WgXcQ';
    mockLazyframe.mockClear();

    const { container } = render(<LazyframeVideo src={src} title="Test Video" />);

    const videoWrapper = screen.getByRole('button', { name: /Play video: Test Video/i });
    const lazyframeDiv = container.querySelector('.lazyframe');
    if (!lazyframeDiv) throw new Error('Lazyframe div not found');

    const clickSpy = vi.spyOn(lazyframeDiv as HTMLElement, 'click');

    fireEvent.keyDown(videoWrapper, { key: ' ' });

    expect(clickSpy).toHaveBeenCalled();
  });
});
