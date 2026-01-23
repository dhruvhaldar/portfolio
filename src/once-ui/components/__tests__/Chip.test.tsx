import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import React from "react";
import { describe, expect, it, vi } from "vitest";
import { Chip } from "../Chip";
import { TagInput } from "../TagInput";

describe("Chip", () => {
  it("renders as non-interactive when onClick is missing", () => {
    render(<Chip label="Test Chip" />);
    // Should NOT be a button
    const chip = screen.queryByRole("button", { name: /test chip/i });
    expect(chip).not.toBeInTheDocument();

    // Should be text
    expect(screen.getByText("Test Chip")).toBeInTheDocument();
  });

  it("calls onClick when clicked", async () => {
    const user = userEvent.setup();
    const handleClick = vi.fn();
    render(<Chip label="Clickable Chip" onClick={handleClick} />);
    const chip = screen.getByRole("button", { name: /clickable chip/i });
    await user.click(chip);
    expect(handleClick).toHaveBeenCalledTimes(1);
    expect(chip).toHaveAttribute("tabindex", "0");
    expect(chip).toHaveClass("cursor-interactive");
  });

  it("renders remove button when onRemove is provided", async () => {
    const user = userEvent.setup();
    const handleRemove = vi.fn();
    render(<Chip label="Removable Chip" onRemove={handleRemove} />);

    // The chip itself is NOT a button anymore (fixing nested interactive controls)
    const chip = screen.queryByRole("button", { name: /removable chip/i });
    expect(chip).not.toBeInTheDocument();

    // The remove button is inside
    // Default tooltip is "Remove"
    const removeBtn = screen.getByRole("button", { name: /remove/i });
    expect(removeBtn).toBeInTheDocument();

    if (removeBtn) {
      await user.click(removeBtn);
      expect(handleRemove).toHaveBeenCalledTimes(1);
    }
  });
});

describe("TagInput", () => {
  it("renders chips with accessible remove buttons", async () => {
    const handleChange = vi.fn();
    render(<TagInput id="tags" label="Tags" value={["react", "nextjs"]} onChange={handleChange} />);

    // Chip container should NOT be a button
    // It used to be named "Remove tag react" via aria-label on the container.
    expect(screen.queryByLabelText(/remove tag react/i)).not.toBeInTheDocument();

    // Remove button should be accessible via tooltip/label
    // Tooltip is "Remove react"
    const removeBtn = screen.getByRole("button", { name: "Remove react" });
    expect(removeBtn).toBeInTheDocument();

    const removeBtn2 = screen.getByRole("button", { name: "Remove nextjs" });
    expect(removeBtn2).toBeInTheDocument();
  });
});
