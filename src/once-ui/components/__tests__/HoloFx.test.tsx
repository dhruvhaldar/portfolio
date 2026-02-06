import { render, fireEvent, screen } from '@testing-library/react';
import { describe, it, expect, vi, afterEach } from 'vitest';
import { HoloFx } from '../HoloFx';

describe('HoloFx Performance Optimization', () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('does not attach a global mousemove listener', () => {
    const addEventListenerSpy = vi.spyOn(document, 'addEventListener');

    render(<HoloFx>Test Content</HoloFx>);

    // Expect mousemove NOT to be attached to document
    expect(addEventListenerSpy).not.toHaveBeenCalledWith('mousemove', expect.any(Function));
  });

  it('updates styles on mouse move over the element', () => {
    render(<HoloFx data-testid="holo-fx">Test Content</HoloFx>);

    const element = screen.getByTestId('holo-fx');

    // Mock getBoundingClientRect
    vi.spyOn(element, 'getBoundingClientRect').mockReturnValue({
      width: 200,
      height: 200,
      top: 0,
      left: 0,
      bottom: 200,
      right: 200,
      x: 0,
      y: 0,
      toJSON: () => {}
    });

    // Move mouse to bottom right (200, 200) relative to viewport.
    // Rect is at (0,0) with size 200x200.
    // Center is (100, 100).
    // OffsetX = 200.
    // Delta = ((200 - 100) / 100) * 100 = 100%.

    fireEvent.mouseMove(element, { clientX: 200, clientY: 200 });

    // Check if style updated.
    expect(element.style.getPropertyValue('--gradient-pos-x')).toBe('100%');
    expect(element.style.getPropertyValue('--gradient-pos-y')).toBe('100%');
  });
});
