import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { Accordion } from "../Accordion";

describe("Accordion Accessibility", () => {
  it("renders a button inside a heading", () => {
    render(
      <Accordion title="Semantic Test">
        <p>Content</p>
      </Accordion>,
    );
    const heading = screen.getByRole("heading", { level: 3 });
    const button = screen.getByRole("button", { name: "Semantic Test" });
    expect(heading).toContainElement(button);
  });

  it("applies inert attribute to content when closed", () => {
    render(
      <Accordion title="A11y Test">
        <button>Focusable Content</button>
      </Accordion>,
    );

    // Find the button even if it is hidden from accessibility tree
    // inert makes it hidden, so getByText might fail if testing-library respects inert
    // But getByText usually works unless aria-hidden="true" makes it invisible to getByRole
    // "Focusable Content" is text.

    // However, if content is inert, it's not focusable.
    // We need to find the content wrapper by ID or just structure.

    const toggleButton = screen.getByRole("button", { name: "A11y Test" });
    const contentId = toggleButton.getAttribute("aria-controls");
    expect(contentId).toBeTruthy();

    // We can query by ID directly
    // Note: testing-library queries operate on the document body by default for screen
    const content = document.getElementById(contentId!);
    expect(content).not.toBeNull();

    // Initially closed
    expect(content).toHaveAttribute("inert");
  });

  it("removes inert attribute from content when open", () => {
    render(
      <Accordion title="A11y Test" open={true}>
        <button>Focusable Content</button>
      </Accordion>,
    );

    const toggleButton = screen.getByRole("button", { name: "A11y Test" });
    const contentId = toggleButton.getAttribute("aria-controls");
    const content = document.getElementById(contentId!);

    expect(content).not.toBeNull();
    expect(content).not.toHaveAttribute("inert");
  });

  it("toggles inert attribute on interaction", () => {
    render(
      <Accordion title="A11y Test">
        <button>Focusable Content</button>
      </Accordion>,
    );

    const toggleButton = screen.getByRole("button", { name: "A11y Test" });
    const contentId = toggleButton.getAttribute("aria-controls");
    const content = document.getElementById(contentId!);

    // Initial state: closed -> inert
    expect(content).toHaveAttribute("inert");

    // Click to open
    fireEvent.click(toggleButton);
    expect(content).not.toHaveAttribute("inert");

    // Click to close
    fireEvent.click(toggleButton);
    expect(content).toHaveAttribute("inert");
  });
});
