import { fireEvent, render, screen } from "@testing-library/react";
import React, { useState } from "react";
import { describe, expect, it, vi } from "vitest";
import { Input } from "../Input";

// Skipping complex debounce integration test for unit testing simplicity.
// Validation logic relies on useDebounce which is best tested in its own unit test
// or via integration tests. Use simple prop tests here.

describe("Input", () => {
  it("renders label and input", () => {
    render(<Input id="test-input" label="Test Label" />);
    expect(screen.getByLabelText("Test Label")).toBeInTheDocument();
  });

  it("displays error message", () => {
    const handleChange = vi.fn();
    render(
      <Input
        id="test-input"
        label="Label"
        error
        errorMessage="Error occurred"
        value="some value"
        onChange={handleChange}
      />,
    );
    expect(screen.getByText("Error occurred")).toBeInTheDocument();
  });

  it("has default maxLength of 255", () => {
    render(<Input id="test-input" label="Test Label" />);
    const input = screen.getByLabelText("Test Label") as HTMLInputElement;
    expect(input.maxLength).toBe(255);
  });

  it("allows overriding maxLength", () => {
    render(<Input id="test-input" label="Test Label" maxLength={50} />);
    const input = screen.getByLabelText("Test Label") as HTMLInputElement;
    expect(input.maxLength).toBe(50);
  });

  it("displays spinner and sets aria-busy when loading", () => {
    render(<Input id="test-input" label="Test Label" loading />);
    const input = screen.getByLabelText("Test Label");
    expect(input).toHaveAttribute("aria-busy", "true");
    expect(screen.getByRole("status")).toBeInTheDocument();
  });
});
