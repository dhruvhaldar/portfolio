import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { SmartImage } from '@/once-ui/components/SmartImage';

// Mock Next.js Image component
vi.mock('next/image', () => ({
    default: (props: any) => <img {...props} />
}));

describe('SmartImage XSS Prevention', () => {
    it('should NOT render an image with a javascript: protocol', () => {
        const maliciousUrl = 'javascript:alert(1)';
        const { container } = render(<SmartImage src={maliciousUrl} alt="test" />);

        const img = container.querySelector('img');
        const iframe = container.querySelector('iframe');
        const video = container.querySelector('video');

        // Should render nothing
        expect(img).toBeNull();
        expect(iframe).toBeNull();
        expect(video).toBeNull();
    });

    it('should render an image with a data: protocol', () => {
        const dataUrl = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNk+A8AAQUBAScY42YAAAAASUVORK5CYII=';
        const { container } = render(<SmartImage src={dataUrl} alt="test" />);

        const img = container.querySelector('img');
        expect(img).not.toBeNull();
        expect(img?.getAttribute('src')).toBe(dataUrl);
    });

    it('should render an image with a blob: protocol', () => {
        const blobUrl = 'blob:http://localhost:3000/12345678-1234-1234-1234-123456789012';
        const { container } = render(<SmartImage src={blobUrl} alt="test" />);

        const img = container.querySelector('img');
        expect(img).not.toBeNull();
        expect(img?.getAttribute('src')).toBe(blobUrl);
    });
});
