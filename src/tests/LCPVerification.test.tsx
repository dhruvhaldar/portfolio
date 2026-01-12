import { describe, it, expect, vi } from 'vitest';
import { render, screen, cleanup } from '@testing-library/react';
import { SmartImage } from '../once-ui/components/SmartImage';
import { Carousel } from '../once-ui/components/Carousel';
import { RevealFx } from '../once-ui/components/RevealFx';
import styles from '../once-ui/components/RevealFx.module.scss';
import React from 'react';

// Mock Next.js Image
vi.mock('next/image', () => ({
  default: (props: any) => {
    // We simulate the style behavior here to verify opacity
    const { style, onLoad } = props;
    return <img {...props} data-testid="next-image" style={style} />;
  },
}));

// Mock RevealFx for Carousel test to verify prop passing
// We need to allow SmartImage to work, so we shouldn't mock RevealFx globally if it breaks other things,
// but for checking prop passing, mocking is cleaner.
// However, SmartImage test relies on real RevealFx? No, SmartImage does not use RevealFx.
// Carousel uses RevealFx.
// So we can mock RevealFx to spy on props.

vi.mock('../once-ui/components/RevealFx', () => {
  return {
    RevealFx: (props: any) => {
      return (
        <div
          data-testid="reveal-fx"
          data-revealed-by-default={props.revealedByDefault}
          data-trigger={props.trigger}
        >
          {props.children}
        </div>
      );
    }
  };
});

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

  describe('Carousel & RevealFx Integration', () => {
    it('should pass revealedByDefault=true to RevealFx when Carousel is initialized with it', () => {
      const images = [{ src: '/img1.jpg', alt: 'img1' }];

      render(
        <Carousel
          images={images}
          revealedByDefault={true}
          preload={true}
        />
      );

      const revealFx = screen.getByTestId('reveal-fx');
      expect(revealFx.getAttribute('data-revealed-by-default')).toBe('true');
    });

    it('should pass revealedByDefault=false to RevealFx when Carousel defaults', () => {
      const images = [{ src: '/img1.jpg', alt: 'img1' }];

      render(
        <Carousel
          images={images}
          revealedByDefault={false}
        />
      );

      const revealFx = screen.getByTestId('reveal-fx');
      // "false" string or null/undefined if not passed?
      // Since we pass it explicitly in Carousel code: `revealedByDefault={revealedByDefault}`
      // It should be 'false' string in the mock data attribute.
      expect(revealFx.getAttribute('data-revealed-by-default')).toBe('false');
    });
  });
});
