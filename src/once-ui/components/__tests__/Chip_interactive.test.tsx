import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import React from "react";
import { describe, expect, it, vi } from "vitest";
import { Chip } from "../Chip";

describe("Chip Interaction", () => {
  it("renders as a button when onClick is provided", async () => {
    const handleClick = vi.fn();
    render(<Chip label="Interactive Chip" onClick={handleClick} />);

    const chip = screen.getByRole("button", { name: "Interactive Chip" });
    expect(chip).toBeInTheDocument();
    expect(chip).toHaveAttribute("tabindex", "0");

    // Check if it is clickable
    const user = userEvent.setup();
    await user.click(chip);
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it("does NOT render as a button when onClick is NOT provided", () => {
    render(<Chip label="Static Chip" />);

    // Should NOT find a button with this name
    const chipButton = screen.queryByRole("button", { name: "Static Chip" });
    expect(chipButton).not.toBeInTheDocument();

    // Should find the text
    const chipText = screen.getByText("Static Chip");
    expect(chipText).toBeInTheDocument();
  });

  it("renders a remove button when onRemove is provided", async () => {
    const handleRemove = vi.fn();
    render(
      <Chip
        label="Removable Chip"
        onRemove={handleRemove}
        iconButtonProps={{ tooltip: "Remove me" }}
      />,
    );

    // The chip itself should not be a button (if no onClick)
    const chipButton = screen.queryByRole("button", { name: "Removable Chip" });
    expect(chipButton).not.toBeInTheDocument();

    // But there should be a remove button
    const removeButton = screen.getByRole("button", { name: "Remove me" });
    expect(removeButton).toBeInTheDocument();

    // Click remove
    const user = userEvent.setup();
    await user.click(removeButton);
    expect(handleRemove).toHaveBeenCalledTimes(1);
  });
});
