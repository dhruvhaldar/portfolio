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

describe("Select Search and Navigation", () => {
  const options = [
    { label: "Apple", value: "apple" },
    { label: "Banana", value: "banana" },
    { label: "Cherry", value: "cherry" },
  ];

  beforeEach(() => {
    Object.defineProperty(window, 'innerWidth', { writable: true, configurable: true, value: 1024 });
    Object.defineProperty(window, 'innerHeight', { writable: true, configurable: true, value: 768 });
  });

  it("should filter options and handle navigation correctly", async () => {
    render(
      <Select
        id="test-select"
        label="Test Select"
        options={options}
        searchable={true}
      />
    );

    const input = screen.getByLabelText("Test Select");

    // Open dropdown
    await act(async () => {
      fireEvent.click(input);
    });

    // Find search input (it has label "Search")
    const searchInput = screen.getByLabelText("Search");

    // Type "App"
    await act(async () => {
      fireEvent.change(searchInput, { target: { value: "App" } });
    });

    // Verify only Apple is visible
    expect(screen.queryByText("Apple")).toBeInTheDocument();
    expect(screen.queryByText("Banana")).not.toBeInTheDocument();

    // The current bug: if we press ArrowDown multiple times, we might lose highlight or highlight hidden items.
    // Let's assume highlight starts at null.

    // Press ArrowDown
    await act(async () => {
      input.focus();
    });
    await act(async () => {
      fireEvent.keyDown(input, { key: "ArrowDown" });
    });

    expect(input).toHaveAttribute("aria-expanded", "true");

    // Should highlight "Apple" (index 0 of filtered list)
    await waitFor(() => {
        const activeDescendantId = input.getAttribute("aria-activedescendant");
        expect(activeDescendantId).toBeTruthy();
        const appleOption = screen.getByText("Apple").closest("div[role='option']");
        expect(appleOption).toHaveAttribute("id", activeDescendantId);
    });

    // Press ArrowDown again
    await act(async () => {
        input.focus();
        fireEvent.keyDown(input, { key: "ArrowDown" });
    });

    // Should still highlight "Apple" (wrap around or stay at 0)
    await waitFor(() => {
        const activeDescendantId = input.getAttribute("aria-activedescendant");
        const appleOption = screen.getByText("Apple").closest("div[role='option']");
        expect(appleOption).toHaveAttribute("id", activeDescendantId);
    });
  });
});
