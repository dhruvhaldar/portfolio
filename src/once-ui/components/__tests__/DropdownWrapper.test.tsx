import React from 'react';
import { render, cleanup, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi, afterEach } from 'vitest';
import { DropdownWrapper } from '../DropdownWrapper';

describe('DropdownWrapper Performance', () => {
  afterEach(() => {
    cleanup();
    vi.restoreAllMocks();
  });

  it('should not attach global mousedown listener when closed', () => {
    const addEventListenerSpy = vi.spyOn(document, 'addEventListener');

    render(
      <DropdownWrapper
        trigger={<button>Trigger</button>}
        dropdown={<div>Dropdown</div>}
        isOpen={false}
      />
    );

    // Filter calls for 'mousedown'
    const mousedownCalls = addEventListenerSpy.mock.calls.filter(call => call[0] === 'mousedown');

    // It should not add any mousedown listener when closed
    expect(mousedownCalls.length).toBe(0);
  });

  it('should attach global mousedown listener when open', () => {
    const addEventListenerSpy = vi.spyOn(document, 'addEventListener');

    render(
      <DropdownWrapper
        trigger={<button>Trigger</button>}
        dropdown={<div>Dropdown</div>}
        isOpen={true}
      />
    );

    const mousedownCalls = addEventListenerSpy.mock.calls.filter(call => call[0] === 'mousedown');
    expect(mousedownCalls.length).toBeGreaterThan(0);
  });

  it('should close when clicking outside (regression check)', () => {
     const onOpenChange = vi.fn();

     render(
       <DropdownWrapper
         trigger={<button>Trigger</button>}
         dropdown={<div>Dropdown</div>}
         isOpen={true}
         onOpenChange={onOpenChange}
       />
     );

     // Simulate click outside
     fireEvent.mouseDown(document.body);

     expect(onOpenChange).toHaveBeenCalledWith(false);
  });
});
