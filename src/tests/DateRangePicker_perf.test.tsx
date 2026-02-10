import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { DateRangePicker } from "../once-ui/components/DateRangePicker";
import React from "react";

// Mock DatePicker to avoid full rendering and simplify interaction
vi.mock("../once-ui/components/DatePicker", () => ({
  DatePicker: ({ onChange, value, testIdSuffix = "" }: any) => (
    <div data-testid={`datepicker-mock${testIdSuffix}`}>
      <button
        data-testid="select-date-btn"
        onClick={() => onChange(new Date(2023, 0, 15))}
      >
        Select Jan 15
      </button>
       <button
        data-testid="select-date-btn-2"
        onClick={() => onChange(new Date(2023, 0, 20))}
      >
        Select Jan 20
      </button>
    </div>
  ),
}));

describe("DateRangePicker Logic", () => {
  it("calls onChange with correct range when controlled", () => {
    const handleChange = vi.fn();
    const value = { startDate: undefined, endDate: undefined };

    render(<DateRangePicker value={value} onChange={handleChange} />);

    const buttons = screen.getAllByTestId("select-date-btn");
    // Click first date (start date)
    fireEvent.click(buttons[0]);

    // Expect onChange to be called with start date
    expect(handleChange).toHaveBeenCalledWith({
      startDate: new Date(2023, 0, 15),
      endDate: undefined,
    });
  });

  it("completes range selection on second click", () => {
    const handleChange = vi.fn();
    // Simulate controlled state where start date is already selected
    const value = { startDate: new Date(2023, 0, 15), endDate: undefined };

    render(<DateRangePicker value={value} onChange={handleChange} />);

    const buttons = screen.getAllByTestId("select-date-btn-2");
    // Click second date (end date)
    fireEvent.click(buttons[0]);

    // Expect onChange to be called with full range
    expect(handleChange).toHaveBeenCalledWith({
      startDate: new Date(2023, 0, 15),
      endDate: new Date(2023, 0, 20),
    });
  });

   it("resets range if uncontrolled and new start date is picked", () => {
    const handleChange = vi.fn();
    // Uncontrolled
    render(<DateRangePicker onChange={handleChange} />);

    const buttons1 = screen.getAllByTestId("select-date-btn");
    const buttons2 = screen.getAllByTestId("select-date-btn-2");

    // 1. Pick Start
    fireEvent.click(buttons1[0]);
    expect(handleChange).toHaveBeenLastCalledWith({
        startDate: new Date(2023, 0, 15),
        endDate: undefined
    });

    // 2. Pick End
    fireEvent.click(buttons2[0]);
    expect(handleChange).toHaveBeenLastCalledWith({
        startDate: new Date(2023, 0, 15),
        endDate: new Date(2023, 0, 20)
    });

    // 3. Pick New Start (should reset end)
    fireEvent.click(buttons1[0]);
    expect(handleChange).toHaveBeenLastCalledWith({
        startDate: new Date(2023, 0, 15),
        endDate: undefined
    });
  });
});
