import { render, waitFor } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import LazyframeVideo from '@/components/LazyframeVideo';

// Mock lazyframe to avoid DOM issues
vi.mock('lazyframe', () => ({
  default: vi.fn(),
}));

// Mock css import
vi.mock('lazyframe/dist/lazyframe.css', () => ({}));

describe('LazyframeVideo Sandbox', () => {
  it('should add sandbox attribute to injected iframe', async () => {
    const { container } = render(<LazyframeVideo src="https://www.youtube.com/watch?v=dQw4w9WgXcQ" />);

    const lazyframeDiv = container.querySelector('.lazyframe');
    expect(lazyframeDiv).toBeInTheDocument();

    // Simulate lazyframe library injecting an iframe
    const iframe = document.createElement('iframe');
    iframe.src = "https://www.youtube.com/embed/dQw4w9WgXcQ";
    lazyframeDiv!.appendChild(iframe);

    // Wait for MutationObserver to react
    await waitFor(() => {
      expect(iframe).toHaveAttribute('sandbox', 'allow-scripts allow-same-origin allow-presentation');
    });
  });
});
