
import { render, cleanup } from "@testing-library/react";
import { describe, it, expect, vi, afterEach } from "vitest";
import { Select } from "../Select";

// Mock ResizeObserver
class ResizeObserver {
  observe() {}
  unobserve() {}
  disconnect() {}
}
global.ResizeObserver = ResizeObserver;

describe("Select Performance - Event Listeners", () => {
  afterEach(() => {
    cleanup();
    vi.restoreAllMocks();
  });

  it("should optimize global event listeners", () => {
    const addEventListenerSpy = vi.spyOn(document, "addEventListener");

    const options = [
      { label: "Option 1", value: "opt1" },
    ];

    render(
      <Select
        id="test-select-perf"
        label="Test Select Perf"
        options={options}
      />
    );

    // Filter calls to get only mousedown and focusout attached to document
    const mousedownCalls = addEventListenerSpy.mock.calls.filter(call => call[0] === 'mousedown');
    const focusoutCalls = addEventListenerSpy.mock.calls.filter(call => call[0] === 'focusout');

    console.log(`Global mousedown listeners: ${mousedownCalls.length}`);
    console.log(`Global focusout listeners: ${focusoutCalls.length}`);

    // Expect optimized behavior:
    // mousedown: 0 (should only attach when open)
    // focusout: 0 (should use local onBlur or scoped listener)
    expect(mousedownCalls.length).toBe(0);
    expect(focusoutCalls.length).toBe(0);
  });
});
