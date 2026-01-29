import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { NumberInput } from "../NumberInput";

describe("NumberInput", () => {
  it("renders correctly", () => {
    render(<NumberInput id="test-number" label="Number" />);
    expect(screen.getByLabelText("Number")).toBeInTheDocument();
  });

  it("calls onChange when incremented", () => {
    const handleChange = vi.fn();
    render(<NumberInput id="test-number" label="Number" value={0} onChange={handleChange} />);
    const incrementBtn = screen.getByLabelText("Increment value");
    fireEvent.click(incrementBtn);
    expect(handleChange).toHaveBeenCalledWith(1);
  });

  it("disables increment button when max is reached", () => {
    render(<NumberInput id="test-number" label="Number" value={10} max={10} />);
    const incrementBtn = screen.getByLabelText("Increment value");
    expect(incrementBtn).toBeDisabled();
  });

  it("disables decrement button when min is reached", () => {
    render(<NumberInput id="test-number" label="Number" value={0} min={0} />);
    const decrementBtn = screen.getByLabelText("Decrement value");
    expect(decrementBtn).toBeDisabled();
  });
});
