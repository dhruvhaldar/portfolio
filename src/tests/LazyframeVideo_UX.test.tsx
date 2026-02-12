import { render, screen, fireEvent, act } from '@testing-library/react';
import { vi, describe, it, expect, beforeEach } from 'vitest';
import LazyframeVideo from '@/components/LazyframeVideo';

// Mock lazyframe
const { mockLazyframe } = vi.hoisted(() => {
  return { mockLazyframe: vi.fn() };
});

vi.mock('lazyframe', () => ({
  default: mockLazyframe
}));

describe('LazyframeVideo UX', () => {
    beforeEach(() => {
        mockLazyframe.mockClear();
    });

    it('shows a loading spinner when clicked and hides it after iframe loads', () => {
        const src = 'https://www.youtube.com/watch?v=dQw4w9WgXcQ';
        const title = 'Test Video';
        render(<LazyframeVideo src={src} title={title} />);

        // Initially no spinner
        expect(screen.queryByRole('status', { name: /Loading video/i })).not.toBeInTheDocument();

        // Find play button
        const button = screen.getByRole('button', { name: /Play video/i });
        fireEvent.click(button);

        // Expect spinner to appear
        expect(screen.getByRole('status', { name: /Loading video/i })).toBeInTheDocument();

        // Get lazyframe call to simulate onAppend
        expect(mockLazyframe).toHaveBeenCalled();
        const options = mockLazyframe.mock.calls[0][1];

        expect(options).toBeDefined();
        expect(options.onAppend).toBeDefined();

        const iframe = document.createElement('iframe');

        // Simulate iframe append (options.onAppend)
        act(() => {
            options.onAppend(iframe);
        });

        // Spinner should still be visible because iframe hasn't loaded yet
        expect(screen.getByRole('status', { name: /Loading video/i })).toBeInTheDocument();

        // Simulate iframe load event
        act(() => {
            fireEvent.load(iframe);
        });

        // Expect spinner to disappear
        expect(screen.queryByRole('status', { name: /Loading video/i })).not.toBeInTheDocument();
    });
});
