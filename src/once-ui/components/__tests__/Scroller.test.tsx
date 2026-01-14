import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import React from "react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { Scroller } from "../Scroller";

describe("Scroller", () => {
  it("renders children", () => {
    render(
      <Scroller>
        <div>Item 1</div>
        <div>Item 2</div>
      </Scroller>,
    );
    expect(screen.getByText("Item 1")).toBeInTheDocument();
    expect(screen.getByText("Item 2")).toBeInTheDocument();
  });

  it("handles item clicks", () => {
    const handleItemClick = vi.fn();
    render(
      <Scroller onItemClick={handleItemClick}>
        <button>Item 1</button>
      </Scroller>,
    );

    fireEvent.click(screen.getByText("Item 1"));
    expect(handleItemClick).toHaveBeenCalledWith(0);
  });

  const originalScrollWidth = Object.getOwnPropertyDescriptor(HTMLElement.prototype, "scrollWidth");
  const originalClientWidth = Object.getOwnPropertyDescriptor(HTMLElement.prototype, "clientWidth");

  afterEach(() => {
    if (originalScrollWidth)
      Object.defineProperty(HTMLElement.prototype, "scrollWidth", originalScrollWidth);
    if (originalClientWidth)
      Object.defineProperty(HTMLElement.prototype, "clientWidth", originalClientWidth);
  });

  it("shows next button when overflowing", async () => {
    Object.defineProperty(HTMLElement.prototype, "scrollWidth", {
      configurable: true,
      value: 1000,
    });
    Object.defineProperty(HTMLElement.prototype, "clientWidth", { configurable: true, value: 500 });

    render(
      <Scroller>
        <div style={{ width: 1000 }}>Content</div>
      </Scroller>,
    );

    // Wait for useEffect
    await waitFor(() => {
      const nextButton = screen.getByLabelText("Scroll Next");
      expect(nextButton).toBeInTheDocument();
    });
  });
});
