import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { SmartImage } from '@/once-ui/components/SmartImage';

// Mock Next.js Image component since we are using happy-dom
vi.mock('next/image', () => ({
    default: (props: any) => <img {...props} />
}));

describe('SmartImage Security', () => {
    it('should not treat a URL containing "youtube.com" as a YouTube video if it is not a valid YouTube URL', () => {
        // A URL that ends in .mp4 but contains youtube.com in the path
        // This triggers the unanchored regex match in the buggy version
        const maliciousUrl = 'https://example.com/youtube.com/watch?v=12345678901/video.mp4';

        const { container } = render(<SmartImage src={maliciousUrl} alt="test" />);

        // Check for iframe
        const iframe = container.querySelector('iframe');

        // We expect the component to NOT render an iframe for this URL
        expect(iframe).toBeNull();

        // It should render a video tag instead (since it ends in .mp4)
        const video = container.querySelector('video');
        expect(video).not.toBeNull();
    });

    it('should correctly identify a valid YouTube URL', () => {
        const validUrl = 'https://www.youtube.com/watch?v=12345678901';
        const { container } = render(<SmartImage src={validUrl} alt="test" />);

        const iframe = container.querySelector('iframe');
        expect(iframe).not.toBeNull();
        expect(iframe?.getAttribute('src')).toContain('embed/12345678901');
    });

    it('should have security and accessibility attributes on the YouTube iframe', () => {
        const validUrl = 'https://www.youtube.com/watch?v=12345678901';
        const { container } = render(<SmartImage src={validUrl} alt="Cool Video" />);

        const iframe = container.querySelector('iframe');
        expect(iframe).not.toBeNull();

        // Security: Sandbox attribute
        expect(iframe?.getAttribute('sandbox')).toBe('allow-scripts allow-same-origin allow-presentation');

        // Accessibility: Title attribute
        expect(iframe?.getAttribute('title')).toBe('Cool Video');
    });

    it('should prevent rendering for dangerous javascript src', () => {
        const maliciousUrl = 'javascript:alert(1)';
        const { container } = render(<SmartImage src={maliciousUrl} alt="malicious" />);

        // The component should return null, so container should be empty (or at least contain no image/video/iframe)
        const media = container.querySelector('img, video, iframe');
        expect(media).toBeNull();

        // In React Testing Library, if component returns null, container is empty div or similar.
        // We can check if child nodes are empty or if nothing significant is rendered.
        expect(container.textContent).toBe("");
    });
});
