import { render, screen } from "@testing-library/react";
import React from "react";
import { describe, expect, it, vi } from "vitest";
import { Chip } from "../Chip";

describe("Chip", () => {
  it("renders as a button when onClick is provided", () => {
    const handleClick = vi.fn();
    render(<Chip label="Interactive Chip" onClick={handleClick} data-testid="chip" />);

    const chip = screen.getByTestId("chip");
    expect(chip).toHaveAttribute("role", "button");
    expect(chip).toHaveAttribute("tabIndex", "0");
    expect(chip).toHaveAttribute("aria-pressed", "true");
  });

  it("does NOT render as a button when onClick is missing", () => {
    render(<Chip label="Static Chip" data-testid="chip" />);

    const chip = screen.getByTestId("chip");
    expect(chip).not.toHaveAttribute("role", "button");
    expect(chip).not.toHaveAttribute("tabIndex");
    expect(chip).not.toHaveAttribute("aria-pressed");
  });

  it("allows accessing remove button even if chip is static", () => {
    const handleRemove = vi.fn();
    render(<Chip label="Removable Chip" onRemove={handleRemove} data-testid="chip" />);

    // Chip itself should not be a button
    const chip = screen.getByTestId("chip");
    expect(chip).not.toHaveAttribute("role", "button");

    // Remove button inside should be accessible
    const removeButton = screen.getByRole("button", { name: /Remove/i });
    expect(removeButton).toBeInTheDocument();
  });
});
