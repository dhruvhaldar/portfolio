import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { Accordion } from "../Accordion";

interface AccordionRef {
  open: () => void;
  close: () => void;
}

describe("Accordion", () => {
  it("renders title", () => {
    render(<Accordion title="Test Title">Content</Accordion>);
    // Now the button has the title text, but it's inside a heading
    expect(screen.getByRole("heading", { name: "Test Title" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Test Title" })).toBeInTheDocument();
  });

  it("expands and collapses on click", () => {
    render(<Accordion title="Test Title">Content</Accordion>);

    // Button is the interactive element now
    const button = screen.getByRole("button", { name: "Test Title" });
    expect(button).toBeInTheDocument();

    // Initial state: collapsed
    expect(button).toHaveAttribute("aria-expanded", "false");

    // Expand
    fireEvent.click(button);
    expect(button).toHaveAttribute("aria-expanded", "true");

    // Collapse
    fireEvent.click(button);
    expect(button).toHaveAttribute("aria-expanded", "false");
  });

  it("exposes imperative methods", () => {
    const ref = React.createRef<AccordionRef & HTMLDivElement>();
    render(
      <Accordion ref={ref} title="Title">
        Content
      </Accordion>,
    );

    expect(ref.current).toBeDefined();
    const button = screen.getByRole("button", { name: "Title" });

    React.act(() => {
      ref.current!.open();
    });
    expect(button).toHaveAttribute("aria-expanded", "true");

    React.act(() => {
      ref.current!.close();
    });
    expect(button).toHaveAttribute("aria-expanded", "false");
  });

  it("generates unique IDs for content and links aria-controls", () => {
    render(
      <>
        <Accordion title="Accordion 1">Content 1</Accordion>
        <Accordion title="Accordion 2">Content 2</Accordion>
      </>,
    );

    const button1 = screen.getByRole("button", { name: "Accordion 1" });
    const button2 = screen.getByRole("button", { name: "Accordion 2" });

    const controls1 = button1.getAttribute("aria-controls");
    const controls2 = button2.getAttribute("aria-controls");

    expect(controls1).toBeTruthy();
    expect(controls2).toBeTruthy();
    expect(controls1).not.toBe(controls2);
    expect(controls1).toContain("accordion-content-");

    const content1 = document.getElementById(controls1!);
    const content2 = document.getElementById(controls2!);

    expect(content1).toBeInTheDocument();
    expect(content2).toBeInTheDocument();
    expect(content1).toHaveTextContent("Content 1");
    expect(content2).toHaveTextContent("Content 2");
  });
});
