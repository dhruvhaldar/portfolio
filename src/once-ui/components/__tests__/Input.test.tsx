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

  it("displays character count when showCount is true", () => {
    render(<Input id="test-input" label="Test Label" showCount maxLength={100} />);
    expect(
      screen.getByText(/0 characters entered out of 100 maximum/i),
    ).toBeInTheDocument();

    const input = screen.getByLabelText("Test Label");
    fireEvent.change(input, { target: { value: "Hello" } });

    expect(
      screen.getByText(/5 characters entered out of 100 maximum/i),
    ).toBeInTheDocument();
  });

  it("associates character count with input via aria-describedby", () => {
    render(<Input id="test-input" label="Test Label" showCount maxLength={100} />);
    const input = screen.getByLabelText("Test Label");
    const count = screen.getByText(/0 characters entered out of 100 maximum/i);

    // The text node is inside the container with the ID
    expect(count.closest("[id='test-input-count']")).toBeInTheDocument();
    expect(input).toHaveAttribute(
      "aria-describedby",
      expect.stringContaining("test-input-count"),
    );
  });
});
