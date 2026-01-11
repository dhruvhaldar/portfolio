import React from 'react';
import { render } from '@testing-library/react';
import { Background } from '../Background';
import { vi, describe, it, expect, beforeEach, afterEach } from 'vitest';

describe('Background', () => {
  let rafCallback: FrameRequestCallback | null = null;
  let rafSpy: any;

  beforeEach(() => {
    vi.useFakeTimers();
    // Mock requestAnimationFrame to manually trigger frames
    rafSpy = vi.spyOn(window, 'requestAnimationFrame').mockImplementation((cb) => {
      rafCallback = cb;
      return 1; // Return a dummy ID
    });
  });

  afterEach(() => {
    vi.useRealTimers();
    vi.restoreAllMocks();
    rafCallback = null;
  });

  it('renders correctly', () => {
    const { container } = render(<Background />);
    expect(container).toBeDefined();
  });

  it('stops animation loop when cursor is disabled', () => {
    render(<Background mask={{ cursor: false }} />);
    expect(rafSpy).not.toHaveBeenCalled();
  });

  it('runs animation loop when cursor is enabled', () => {
    render(<Background mask={{ cursor: true }} />);
    expect(rafSpy).toHaveBeenCalled();
  });

  it('stops animation loop after convergence', () => {
    render(<Background mask={{ cursor: true }} />);

    // Initially called
    expect(rafSpy).toHaveBeenCalled();

    // Clear the spy history
    rafSpy.mockClear();

    // Execute the pending callback (the loop)
    if (rafCallback) {
      rafCallback(performance.now());
    }

    // Since initial state is 0,0 and target is 0,0, it should converge immediately and NOT request another frame.
    expect(rafSpy).not.toHaveBeenCalled();
  });

  it('restarts animation loop on mouse move after stopping', () => {
    const { container } = render(<Background mask={{ cursor: true }} />);

    // 1. Let it converge and stop
    if (rafCallback) rafCallback(performance.now());
    rafSpy.mockClear();

    // 2. Move mouse to trigger restart
    const moveEvent = new MouseEvent('mousemove', { clientX: 100, clientY: 100 });
    document.dispatchEvent(moveEvent);

    // Should have restarted the loop
    expect(rafSpy).toHaveBeenCalled();
    rafSpy.mockClear();

    // 3. Run the loop
    // Now cursor is at 100,100, smooth is at 0,0.
    // Loop should continue (request next frame) because it hasn't converged.
    if (rafCallback) rafCallback(performance.now());

    expect(rafSpy).toHaveBeenCalled();
  });
});
