import { render, waitFor } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import LazyframeVideo from '@/components/LazyframeVideo';

// Mock lazyframe to avoid DOM issues and ensure we control the iframe injection
vi.mock('lazyframe', () => ({
  default: vi.fn(),
}));

// Mock css import
vi.mock('lazyframe/dist/lazyframe.css', () => ({}));

describe('LazyframeVideo Sandbox Security', () => {
  it('applies sandbox and title attributes to injected iframe', async () => {
    const title = "Secure Video";
    const { container } = render(
      <LazyframeVideo
        src="https://www.youtube.com/watch?v=dQw4w9WgXcQ"
        title={title}
      />
    );

    const wrapper = container.querySelector('.lazyframe');
    expect(wrapper).toBeInTheDocument();

    // Simulate lazyframe library injecting an iframe
    const iframe = document.createElement('iframe');
    // Simulate lazyframe setting src (though not strictly needed for this test)
    iframe.src = "https://www.youtube.com/embed/dQw4w9WgXcQ";

    // Append the iframe to trigger MutationObserver
    wrapper?.appendChild(iframe);

    // Wait for the MutationObserver to react
    await waitFor(() => {
      expect(iframe).toHaveAttribute('sandbox', 'allow-scripts allow-same-origin allow-presentation');
      expect(iframe).toHaveAttribute('title', title);
    });
  });
});
