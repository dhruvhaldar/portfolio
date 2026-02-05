import React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { HoloFx } from '../HoloFx';

describe('HoloFx', () => {
  beforeEach(() => {
    // Mock IntersectionObserver
    window.IntersectionObserver = class {
      observe = vi.fn();
      unobserve = vi.fn();
      disconnect = vi.fn();
    } as any;
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('renders children correctly', () => {
    render(
      <HoloFx>
        <div>Test Content</div>
      </HoloFx>
    );
    // HoloFx renders children multiple times for the effect layers
    const elements = screen.getAllByText('Test Content');
    expect(elements.length).toBeGreaterThan(0);
  });

  it('forwards ref correctly', () => {
    const ref = React.createRef<HTMLDivElement>();
    render(
      <HoloFx ref={ref}>
        <div>Content</div>
      </HoloFx>
    );
    expect(ref.current).toBeInstanceOf(HTMLDivElement);
  });
});
