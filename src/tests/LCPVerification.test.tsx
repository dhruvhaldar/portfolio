import { describe, it, expect, vi } from 'vitest';
import { render, screen, cleanup } from '@testing-library/react';
import { SmartImage } from '../once-ui/components/SmartImage';
import { Carousel } from '../once-ui/components/Carousel';
import React from 'react';

// Mock Next.js Image
vi.mock('next/image', () => ({
  default: (props: any) => {
    // We simulate the style behavior here to verify opacity
    const { style, onLoad } = props;
    return <img {...props} data-testid="next-image" style={style} />;
  },
}));

describe('LCP Optimization Verification', () => {
  afterEach(() => {
    cleanup();
  });

  describe('SmartImage', () => {
    it('should render with opacity 1 initially when priority is true', () => {
      render(<SmartImage src="/test.jpg" priority={true} />);
      const img = screen.getByTestId('next-image');

      // opacity should be 1
      expect(img.style.opacity).toBe('1');
      expect(img.style.filter).toBe('blur(0)');
    });

    it('should render with opacity 0 initially when priority is false', () => {
      render(<SmartImage src="/test.jpg" priority={false} />);
      const img = screen.getByTestId('next-image');

      // opacity should be 0
      expect(img.style.opacity).toBe('0');
      expect(img.style.filter).toBe('blur(20px)');
    });
  });

});
