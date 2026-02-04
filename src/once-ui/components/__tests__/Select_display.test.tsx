import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { Select } from "../Select";

describe("Select Display Value", () => {
  it("displays displayLabel when label is a ReactNode", () => {
    const options = [
      {
        label: <span data-testid="custom-label">Custom Node Label</span>,
        displayLabel: "Custom String Label",
        value: "opt1",
      },
    ];

    render(<Select id="test-select" label="Test Select" options={options} value="opt1" />);

    const input = screen.getByLabelText("Test Select");
    // Verify that it shows the displayLabel, NOT the value "opt1"
    expect(input).toHaveValue("Custom String Label");
  });

  it("falls back to value when label is ReactNode and no displayLabel is provided", () => {
    const options = [
      {
        label: <span>Just Node Label</span>,
        value: "opt2",
      },
    ];

    render(
      <Select
        id="test-select-fallback"
        label="Test Select Fallback"
        options={options}
        value="opt2"
      />,
    );

    const input = screen.getByLabelText("Test Select Fallback");
    // Verify legacy fallback behavior
    expect(input).toHaveValue("opt2");
  });
});
