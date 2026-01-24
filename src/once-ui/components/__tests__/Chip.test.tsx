
import React from "react";
import { render, screen } from "@testing-library/react";
import { Chip } from "../Chip";
import { describe, it, expect } from "vitest";

describe("Chip", () => {
  it("renders as a non-interactive container when onClick is not provided", () => {
    render(<Chip label="Test Chip" />);

    // Should NOT be a button
    const button = screen.queryByRole("button", { name: "Test Chip" });
    expect(button).not.toBeInTheDocument();

    // Should just display text
    expect(screen.getByText("Test Chip")).toBeInTheDocument();
  });

  it("renders as a button when onClick IS provided", () => {
    render(<Chip label="Interactive Chip" onClick={() => {}} />);

    const chip = screen.getByRole("button", { name: "Interactive Chip" });
    expect(chip).toBeInTheDocument();
    expect(chip).toHaveAttribute("tabIndex", "0");
  });

  it("renders non-interactive container with interactive remove button when onRemove is provided without onClick", () => {
    // Simulating TagInput usage
    render(<Chip label="Test Chip" onRemove={() => {}} iconButtonProps={{ tooltip: "Remove Test Chip" }} />);

    // Outer chip should NOT be a button
    const chipButton = screen.queryByRole("button", { name: "Test Chip" });
    expect(chipButton).not.toBeInTheDocument();

    // Inner remove button SHOULD be present and accessible
    const removeButton = screen.getByRole("button", { name: "Remove Test Chip" });
    expect(removeButton).toBeInTheDocument();
  });
});
