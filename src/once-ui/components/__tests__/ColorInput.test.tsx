import { render, screen, fireEvent } from "@testing-library/react";
import React, { useState } from "react";
import { describe, expect, it, vi } from "vitest";
import { ColorInput } from "../ColorInput";

describe("ColorInput", () => {
  it("renders label and input", () => {
    render(<ColorInput id="test-color" label="Test Color" value="#ff0000" onChange={() => {}} />);
    expect(screen.getByLabelText("Test Color")).toBeInTheDocument();
  });

  it("triggers color picker on keyboard interaction", () => {
    const handleChange = vi.fn();
    render(<ColorInput id="test-color" label="Color" value="#00ff00" onChange={handleChange} />);

    const colorSwatch = screen.getByRole("button", { name: "Select color" });

    // Check if the original input click is triggered when space/enter is pressed on the custom swatch
    const input = screen.getByLabelText("Color");
    const clickSpy = vi.spyOn(input, 'click');

    fireEvent.keyDown(colorSwatch, { key: "Enter", code: "Enter", charCode: 13 });
    expect(clickSpy).toHaveBeenCalledTimes(1);

    fireEvent.keyDown(colorSwatch, { key: " ", code: "Space", charCode: 32 });
    expect(clickSpy).toHaveBeenCalledTimes(2);
  });
});
