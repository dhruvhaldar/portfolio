import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { SmartImage } from '@/once-ui/components/SmartImage';

// Mock Next.js Image component
vi.mock('next/image', () => ({
    default: (props: any) => <img {...props} data-testid="next-image" />
}));

describe('SmartImage Rendering', () => {
    it('should render an image when src is a standard image URL', () => {
        render(<SmartImage src="/images/test.jpg" alt="test image" />);
        const image = screen.getByTestId('next-image');
        expect(image).toBeInTheDocument();
        expect(image).toHaveAttribute('src', '/images/test.jpg');
        expect(image).toHaveAttribute('alt', 'test image');
    });

    it('should render a video when src ends with .mp4', () => {
        const { container } = render(<SmartImage src="/videos/test.mp4" alt="test video" />);
        const video = container.querySelector('video');
        expect(video).toBeInTheDocument();
        expect(video).toHaveAttribute('src', '/videos/test.mp4');
    });

    it('should render a YouTube iframe when src is a valid YouTube URL', () => {
        const youtubeUrl = 'https://www.youtube.com/watch?v=12345678901';
        const { container } = render(<SmartImage src={youtubeUrl} alt="test youtube" />);
        const iframe = container.querySelector('iframe');
        expect(iframe).toBeInTheDocument();
        expect(iframe?.getAttribute('src')).toContain('embed/12345678901');
    });
});
