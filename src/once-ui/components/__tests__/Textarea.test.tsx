import { fireEvent, render, screen } from "@testing-library/react";
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

  it("displays character count when showCount is true", () => {
    render(
      <Textarea
        id="test-textarea-count"
        label="Label"
        showCount
        maxLength={100}
        defaultValue="Hello"
      />,
    );
    expect(screen.getByText("5 / 100")).toBeInTheDocument();
  });

  it("updates character count on input", () => {
    render(<Textarea id="test-textarea-input" label="Label" showCount maxLength={50} />);
    const textarea = screen.getByLabelText("Label");
    expect(screen.getByText("0 / 50")).toBeInTheDocument();

    fireEvent.change(textarea, { target: { value: "Hello World" } });
    expect(screen.getByText("11 / 50")).toBeInTheDocument();
  });

  it("adds count id to aria-describedby", () => {
    render(<Textarea id="test-textarea-aria" label="Label" showCount maxLength={50} />);
    const textarea = screen.getByLabelText("Label");
    const countElement = screen.getByText("0 / 50");

    expect(textarea).toHaveAttribute("aria-describedby", expect.stringContaining(countElement.id));
  });
});
