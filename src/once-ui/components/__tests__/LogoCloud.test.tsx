
import React from 'react';
import { render, screen, act } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { LogoCloud } from '../LogoCloud';

describe('LogoCloud', () => {
  const mockLogos = [
    { href: '/1', alt: 'Logo 1' },
    { href: '/2', alt: 'Logo 2' },
    { href: '/3', alt: 'Logo 3' },
    { href: '/4', alt: 'Logo 4' },
    { href: '/5', alt: 'Logo 5' },
    { href: '/6', alt: 'Logo 6' },
    { href: '/7', alt: 'Logo 7' },
    { href: '/8', alt: 'Logo 8' },
  ];

  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('renders initial logos correctly', () => {
    render(<LogoCloud logos={mockLogos} limit={4} />);
    const logos = screen.getAllByRole('link'); // Logo renders a link if href is present
    expect(logos).toHaveLength(4);
    expect(logos[0]).toHaveAttribute('href', '/1');
    expect(logos[3]).toHaveAttribute('href', '/4');
  });

  it('rotates logos after interval', () => {
    render(<LogoCloud logos={mockLogos} limit={4} rotationInterval={1000} />);

    // Initial state: 1, 2, 3, 4
    let logos = screen.getAllByRole('link');
    expect(logos[0]).toHaveAttribute('href', '/1');

    // Advance time
    act(() => {
      vi.advanceTimersByTime(1000 + 25 * 4 + 100); // interval + stagger * limit + buffer
    });

    // Expected state after rotation: 2, 3, 4, 5
    // The component logic shifts by 1
    logos = screen.getAllByRole('link');
    expect(logos[0]).toHaveAttribute('href', '/2');
    expect(logos[3]).toHaveAttribute('href', '/5');
  });

  it('wraps around correctly', () => {
    const fewLogos = [
        { href: '/1', alt: 'Logo 1' },
        { href: '/2', alt: 'Logo 2' },
        { href: '/3', alt: 'Logo 3' },
    ];
    // limit 2
    render(<LogoCloud logos={fewLogos} limit={2} rotationInterval={1000} />);

    // Initial: 1, 2
    let logos = screen.getAllByRole('link');
    expect(logos[0]).toHaveAttribute('href', '/1');
    expect(logos[1]).toHaveAttribute('href', '/2');

    // Rotate 1: 2, 3
    act(() => {
      vi.advanceTimersByTime(1000 + 25 * 2 + 100);
    });
    logos = screen.getAllByRole('link');
    expect(logos[0]).toHaveAttribute('href', '/2');
    expect(logos[1]).toHaveAttribute('href', '/3');

    // Rotate 2: 3, 1
    act(() => {
        vi.advanceTimersByTime(1000 + 25 * 2 + 100);
    });
    logos = screen.getAllByRole('link');
    expect(logos[0]).toHaveAttribute('href', '/3');
    expect(logos[1]).toHaveAttribute('href', '/1');
  });
});
