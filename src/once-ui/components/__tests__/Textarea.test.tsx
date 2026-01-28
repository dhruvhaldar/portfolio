import { render, screen } from "@testing-library/react";
import React from "react";
import { describe, expect, it, vi } from "vitest";
import { Textarea } from "../Textarea";

describe("Textarea", () => {
  it("renders label and textarea", () => {
    render(<Textarea id="test-textarea" label="Test Label" />);
    expect(screen.getByLabelText("Test Label")).toBeInTheDocument();
  });

  it("displays error message", () => {
    const handleChange = vi.fn();
    render(
      <Textarea
        id="test-textarea"
        label="Label"
        error
        errorMessage="Error occurred"
        value="some value"
        onChange={handleChange}
      />,
    );
    expect(screen.getByText("Error occurred")).toBeInTheDocument();
  });

  it("passes other props to textarea element", () => {
    render(<Textarea id="test-textarea" label="Test Label" lines={5} placeholder="Type here" />);
    const textarea = screen.getByLabelText("Test Label");
    expect(textarea).toHaveAttribute("rows", "5");
    expect(textarea).toHaveAttribute("placeholder", "Type here");
  });
});
