import React from 'react';
import { render, screen } from '@testing-library/react';
import { DropdownWrapper } from '../DropdownWrapper';
import { vi, describe, it, expect, beforeEach, afterEach } from 'vitest';

// Mock ResizeObserver
class ResizeObserver {
  observe() {}
  unobserve() {}
  disconnect() {}
}
global.ResizeObserver = ResizeObserver;

describe('DropdownWrapper Event Listeners', () => {
  let addEventListenerSpy: any;
  let removeEventListenerSpy: any;

  beforeEach(() => {
    addEventListenerSpy = vi.spyOn(document, 'addEventListener');
    removeEventListenerSpy = vi.spyOn(document, 'removeEventListener');
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('does not attach global event listeners when closed', () => {
    render(
      <DropdownWrapper
        trigger={<button>Trigger</button>}
        dropdown={<div>Dropdown Content</div>}
        isOpen={false}
      />
    );

    // Filter for mousedown listeners added to document
    const mousedownCalls = addEventListenerSpy.mock.calls.filter((call: any[]) => call[0] === 'mousedown');

    // CURRENT BEHAVIOR: It ADDS the listener even if closed.
    // So this assertion will FAIL, which confirms the issue.
    // Once fixed, this assertion should PASS.
    expect(mousedownCalls.length).toBe(0);
  });

  it('attaches global event listeners when open', () => {
    render(
      <DropdownWrapper
        trigger={<button>Trigger</button>}
        dropdown={<div>Dropdown Content</div>}
        isOpen={true}
      />
    );

    const mousedownCalls = addEventListenerSpy.mock.calls.filter((call: any[]) => call[0] === 'mousedown');
    expect(mousedownCalls.length).toBeGreaterThan(0);
  });

  it('removes global event listeners when closed after being open', () => {
     const { rerender } = render(
      <DropdownWrapper
        trigger={<button>Trigger</button>}
        dropdown={<div>Dropdown Content</div>}
        isOpen={true}
      />
    );

    // Clear mocks to track removal
    removeEventListenerSpy.mockClear();

    rerender(
       <DropdownWrapper
        trigger={<button>Trigger</button>}
        dropdown={<div>Dropdown Content</div>}
        isOpen={false}
      />
    );

    const mousedownRemoveCalls = removeEventListenerSpy.mock.calls.filter((call: any[]) => call[0] === 'mousedown');
    expect(mousedownRemoveCalls.length).toBeGreaterThan(0);
  });
});
