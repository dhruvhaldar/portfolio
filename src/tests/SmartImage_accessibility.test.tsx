import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { SmartImage } from '@/once-ui/components/SmartImage';

// Mock Next.js Image component
// We pass through props including onLoad
vi.mock('next/image', () => ({
    default: ({ onLoad, alt, ...props }: any) => (
        <img alt={alt} onLoad={onLoad} {...props} />
    )
}));

describe('SmartImage Accessibility', () => {
    it('shows Skeleton with accessibility attributes when isLoading is true', () => {
        render(<SmartImage src="/test.jpg" alt="Test Image" isLoading={true} />);

        // This expects the new label format "Loading: Test Image"
        // Current implementation does not have this, so it will fail or I should adjust expectation to current state if I want to see it fail specifically on attributes
        // But since I'm doing TDD, I write the test for the desired state.
        const skeleton = screen.getByLabelText('Loading: Test Image');
        expect(skeleton).toBeDefined();
        expect(skeleton.getAttribute('aria-busy')).toBe('true');
    });

    it('shows Skeleton when image is loading (isLoading=false but not loaded)', () => {
        render(<SmartImage src="/test.jpg" alt="Test Image" />);

        // Even if isLoading is false, we expect skeleton to be visible initially (before load)
        // This represents the new behavior we want to implement (Visual Polish)
        const skeleton = screen.getByLabelText('Loading: Test Image');
        expect(skeleton).toBeDefined();
    });

    it('hides Skeleton after image loads', async () => {
        render(<SmartImage src="/test.jpg" alt="Test Image" />);

        const skeleton = screen.getByLabelText('Loading: Test Image');
        expect(skeleton).toBeDefined();

        const img = screen.getByAltText('Test Image');
        fireEvent.load(img);

        await waitFor(() => {
            expect(screen.queryByLabelText('Loading: Test Image')).toBeNull();
        });
    });

    it('uses default label if alt is missing', () => {
        render(<SmartImage src="/test.jpg" isLoading={true} />);

        const skeleton = screen.getByLabelText('Loading image');
        expect(skeleton).toBeDefined();
    });
});
