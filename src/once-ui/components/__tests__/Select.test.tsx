import { render, screen, fireEvent, waitFor, act } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { Select } from "../Select";

// Mock ResizeObserver
class ResizeObserver {
  observe() {}
  unobserve() {}
  disconnect() {}
}
global.ResizeObserver = ResizeObserver;

describe("Select Accessibility", () => {
  const options = [
    { label: "Option 1", value: "opt1" },
    { label: "Option 2", value: "opt2" },
    { label: "Option 3", value: "opt3" },
  ];

  beforeEach(() => {
    // Ensure window has size for Floating UI calculations
    Object.defineProperty(window, 'innerWidth', { writable: true, configurable: true, value: 1024 });
    Object.defineProperty(window, 'innerHeight', { writable: true, configurable: true, value: 768 });
  });

  it("renders with correct initial ARIA attributes", () => {
    render(
      <Select
        id="test-select"
        label="Test Select"
        options={options}
      />
    );

    const input = screen.getByLabelText("Test Select");
    expect(input).toHaveAttribute("role", "combobox");
    expect(input).toHaveAttribute("aria-haspopup", "listbox");
    expect(input).toHaveAttribute("aria-expanded", "false");

    // Check if aria-controls is present
    const ariaControls = input.getAttribute("aria-controls");
    expect(ariaControls).toBeTruthy();
    expect(ariaControls).toMatch(/-listbox$/);
  });

  it("links input to listbox and options when open", async () => {
    render(
      <Select
        id="test-select"
        label="Test Select"
        options={options}
      />
    );

    const input = screen.getByLabelText("Test Select");

    await act(async () => {
      input.focus(); // Ensure it is focused
      fireEvent.click(input);
    });

    expect(input).toHaveAttribute("aria-expanded", "true");

    // Check if listbox exists and is visible
    const listbox = await screen.findByRole("listbox");
    expect(listbox).toBeInTheDocument();

    // Check aria-controls matches listbox ID
    const listboxId = listbox.getAttribute("id");
    expect(listboxId).toBeTruthy();
    expect(input).toHaveAttribute("aria-controls", listboxId);

    // Check options have IDs
    const optionElements = screen.getAllByRole("option");
    expect(optionElements).toHaveLength(3);
    optionElements.forEach((opt, index) => {
      expect(opt).toHaveAttribute("id");
    });

    // Check aria-activedescendant
    await act(async () => {
        fireEvent.keyDown(input, { key: "ArrowDown" });
    });

    // Wait for highlight update
    await waitFor(() => {
      const activeDescendantId = input.getAttribute("aria-activedescendant");
      expect(activeDescendantId).toBeTruthy();
      // ArrowDown from empty state -> selects first option (index 0)
      const highlightedOption = optionElements[0];
      expect(highlightedOption).toHaveAttribute("id", activeDescendantId);
    });
  });
});
