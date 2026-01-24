import { render, screen } from "@testing-library/react";
import React from "react";
import { describe, expect, it, vi } from "vitest";
import { Chip } from "../Chip";

describe("Chip", () => {
  it("renders as interactive when onClick is provided", () => {
    const handleClick = vi.fn();
    render(<Chip label="Interactive Chip" onClick={handleClick} />);

    // Should have role="button"
    const chip = screen.getByRole("button", { name: "Interactive Chip" });
    expect(chip).toBeInTheDocument();

    // Should have tabIndex="0"
    expect(chip).toHaveAttribute("tabIndex", "0");
  });

  it("renders as non-interactive when onClick is undefined", () => {
    render(<Chip label="Static Chip" />);

    // Should NOT have role="button" (query by text instead)
    // The text is inside a Text component inside Flex.
    // Structure: Flex (Chip) -> Flex (Content) -> Text -> "Static Chip"
    // Wait, Chip.tsx:
    // Flex (Chip)
    //   Icon (prefix)
    //   Flex (padding)
    //     Text (label)
    //   IconButton (remove)

    const textElement = screen.getByText("Static Chip");
    // We need to go up to the Chip container.
    // Text is inside a Flex (padding), which is inside the Chip Flex.

    // Let's rely on class or structure.
    // Or just look for ANY role="button" that contains this text.

    const buttonRole = screen.queryByRole("button", { name: /static chip/i });

    // If it HAS role="button", this will find it.
    // We expect it NOT to find it (eventually), but currently it SHOULD find it.
    // So to confirm failure of CURRENT code, we assert that it DOES NOT exist.
    // Since current code HAS it, this test should fail.

    expect(buttonRole).not.toBeInTheDocument();
  });

  it("renders remove button when onRemove is provided", () => {
    const handleRemove = vi.fn();
    render(<Chip label="Removable Chip" onRemove={handleRemove} />);

    // The chip itself should NOT be a button (if onClick is missing)
    const chipContent = screen.getByText("Removable Chip");
    // We expect the chip container to NOT be a button, but let's just check the remove button

    // The remove button inside
    const removeButton = screen.getByRole("button", { name: /remove/i });
    expect(removeButton).toBeInTheDocument();
  });
});
