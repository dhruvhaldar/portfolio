import React from 'react';
import { render, cleanup } from '@testing-library/react';
import { describe, it, expect, vi, afterEach } from 'vitest';
import { DropdownWrapper } from '../DropdownWrapper';

describe('DropdownWrapper Event Listeners', () => {
  afterEach(() => {
    cleanup();
    vi.restoreAllMocks();
  });

  it('adds document event listeners ONLY when open', () => {
    const addEventListenerSpy = vi.spyOn(document, 'addEventListener');
    const removeEventListenerSpy = vi.spyOn(document, 'removeEventListener');

    const { rerender, unmount } = render(
      <DropdownWrapper
        isOpen={false}
        trigger={<button>Trigger</button>}
        dropdown={<div>Dropdown Content</div>}
      />
    );

    // Initial render (closed): Should NOT add global mousedown listener
    // Note: We filter for 'mousedown' specifically as React or other libs might add others
    const mousedownCallsClosed = addEventListenerSpy.mock.calls.filter(call => call[0] === 'mousedown');

    // Bolt: This assertion expects the optimization to be IN PLACE.
    // Since we haven't applied it yet, this test will FAIL if the optimization is missing.
    // If we want to reproduce the issue, we should expect > 0.
    // But usually we write the "correct" test and watch it fail.
    expect(mousedownCallsClosed.length).toBe(0);

    // Rerender as open
    rerender(
      <DropdownWrapper
        isOpen={true}
        trigger={<button>Trigger</button>}
        dropdown={<div>Dropdown Content</div>}
      />
    );

    // Should add listeners when open
    const mousedownCallsOpen = addEventListenerSpy.mock.calls.filter(call => call[0] === 'mousedown');
    expect(mousedownCallsOpen.length).toBeGreaterThan(0);

    // Rerender as closed
    rerender(
      <DropdownWrapper
        isOpen={false}
        trigger={<button>Trigger</button>}
        dropdown={<div>Dropdown Content</div>}
      />
    );

    // Should remove listeners
    const removeMousedownCalls = removeEventListenerSpy.mock.calls.filter(call => call[0] === 'mousedown');
    expect(removeMousedownCalls.length).toBeGreaterThan(0);

    unmount();
  });
});
