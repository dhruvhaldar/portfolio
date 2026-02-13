import { fireEvent, render, screen } from "@testing-library/react";
import React from "react";
import { describe, expect, it, vi } from "vitest";
import { Option } from "../once-ui/components/Option";

describe("Option Component Accessibility", () => {
  it("should trigger onClick when pressing Enter on the button (keyboard)", () => {
    const handleClick = vi.fn();
    render(<Option label="Test Option" value="test-value" onClick={handleClick} />);

    const button = screen.getByRole("button");
    button.focus();
    // Simulate Enter key on the button element
    fireEvent.keyDown(button, { key: "Enter", code: "Enter" });
    fireEvent.click(button);

    expect(handleClick).toHaveBeenCalledWith("test-value");
  });
});
