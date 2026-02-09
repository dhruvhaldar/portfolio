import { act, fireEvent, render, screen } from "@testing-library/react";
import React, { useState } from "react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { Input } from "../Input";

describe("Input Validation", () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("validates input after debounce delay", () => {
    const validate = vi.fn((value) => {
      if (value === "invalid") return "Invalid value";
      return null;
    });

    const TestComponent = () => {
      const [value, setValue] = useState("");
      return (
        <Input
          id="test-input"
          label="Test Label"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          validate={validate}
        />
      );
    };

    render(<TestComponent />);
    const input = screen.getByLabelText("Test Label");

    // Type invalid value
    fireEvent.change(input, { target: { value: "invalid" } });

    // Validation shouldn't run immediately (debounce)
    expect(screen.queryByText("Invalid value")).not.toBeInTheDocument();
    // Validate is not called immediately because debouncedValue hasn't updated yet
    // Note: If useMemo is used, it runs immediately when debouncedValue updates.
    // If useEffect is used, it runs after debouncedValue updates.
    // Both wait for debounce timeout.

    // Advance timer to trigger debounce
    act(() => {
      vi.advanceTimersByTime(1100);
    });

    // Now validation should have run and error should be displayed
    expect(screen.getByText("Invalid value")).toBeInTheDocument();
    expect(validate).toHaveBeenCalledWith("invalid");
  });

  it("clears validation error when input becomes valid", () => {
    const validate = vi.fn((value) => {
      if (value === "invalid") return "Invalid value";
      return null;
    });

    const TestComponent = () => {
      const [value, setValue] = useState("invalid");
      return (
        <Input
          id="test-input"
          label="Test Label"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          validate={validate}
        />
      );
    };

    render(<TestComponent />);

    // Initial render with invalid value
    // Since we start with 'invalid', debouncedValue starts as 'invalid' immediately (useDebounce init)
    // So error should show up immediately?
    // Wait, useDebounce initializes with initial value.
    // So validate runs immediately on mount.

    // However, in current implementation (useEffect), it runs after mount.
    // In optimized implementation (useMemo), it runs during render.

    // Let's check initial state.
    // If useDebounce sets state, it triggers re-render.

    // Act to flush effects
    act(() => {
        vi.runAllTimers();
    });

    expect(screen.getByText("Invalid value")).toBeInTheDocument();

    const input = screen.getByLabelText("Test Label");

    // Change to valid value
    fireEvent.change(input, { target: { value: "valid" } });

    // Error should still be there (debounce)
    expect(screen.getByText("Invalid value")).toBeInTheDocument();

    // Advance timer
    act(() => {
      vi.advanceTimersByTime(1100);
    });

    // Error should be gone
    expect(screen.queryByText("Invalid value")).not.toBeInTheDocument();
  });
});
