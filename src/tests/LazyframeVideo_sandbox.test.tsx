import { render, waitFor } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import LazyframeVideo from '@/components/LazyframeVideo';

// Mock lazyframe
vi.mock('lazyframe', () => ({
  default: vi.fn(),
}));

// Mock css
vi.mock('lazyframe/dist/lazyframe.css', () => ({}));

describe('LazyframeVideo Sandbox', () => {
  it('should add sandbox attribute to injected iframe', async () => {
    const { container } = render(<LazyframeVideo src="https://www.youtube.com/watch?v=dQw4w9WgXcQ" />);

    const lazyframeDiv = container.querySelector('.lazyframe');
    expect(lazyframeDiv).toBeInTheDocument();

    if (!lazyframeDiv) return;

    // Simulate lazyframe injecting an iframe
    const iframe = document.createElement('iframe');
    iframe.src = "https://www.youtube.com/embed/dQw4w9WgXcQ";
    // Initially no sandbox

    // Manually append to simulate library behavior
    lazyframeDiv.appendChild(iframe);

    // We expect the component to detect this and add sandbox
    // For now, we expect this to FAIL or pass if we check for absence

    // Wait for the observer to fire and apply attributes
    await waitFor(() => {
      expect(iframe).toHaveAttribute('sandbox', 'allow-scripts allow-same-origin allow-presentation');
      expect(iframe).toHaveAttribute('title', 'Video player');
    });
  });
});
