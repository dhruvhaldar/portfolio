import { render, screen } from '@testing-library/react';
import { vi, describe, it, expect } from 'vitest';
import LazyframeVideo from '@/components/LazyframeVideo';

// Define the mock using vi.hoisted to ensure it's available before imports
const { mockLazyframe } = vi.hoisted(() => {
  return { mockLazyframe: vi.fn() };
});

vi.mock('lazyframe', () => ({
  default: mockLazyframe
}));

describe('LazyframeVideo Focus Management', () => {
  it('should focus the iframe when injected', () => {
    const src = 'https://www.youtube.com/watch?v=dQw4w9WgXcQ';
    const title = 'Focus Test Video';

    // Verify component rendering
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

    // Create a mock iframe with a spy on focus
    const mockIframe = document.createElement('iframe');
    const focusSpy = vi.spyOn(mockIframe, 'focus');

    // Simulate onAppend execution
    options.onAppend(mockIframe);

    // Assert that focus() was called
    // This expects the component to call iframe.focus() inside onAppend
    expect(focusSpy).toHaveBeenCalled();
  });
});
