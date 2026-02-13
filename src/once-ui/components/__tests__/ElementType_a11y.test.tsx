import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { ElementType } from "../ElementType";

describe("ElementType Accessibility", () => {
  it("should append '(opens in a new tab)' to children via sr-only span for external links", () => {
    render(<ElementType href="https://example.com">External Link</ElementType>);

    const link = screen.getByText("External Link").closest("a");
    expect(link).toBeInTheDocument();
    expect(link?.textContent).toContain("(opens in a new tab)");

    // Check for the sr-only class
    const srOnlySpan = link?.querySelector(".sr-only");
    expect(srOnlySpan).toBeInTheDocument();
    expect(srOnlySpan?.textContent).toContain("(opens in a new tab)");
  });

  it("should append '(opens in a new tab)' to aria-label for external links if aria-label is present", () => {
    render(
      <ElementType href="https://example.com" aria-label="Visit Example">
        External Link
      </ElementType>
    );

    const link = screen.getByRole("link", { name: "Visit Example (opens in a new tab)" });
    expect(link).toBeInTheDocument();
    expect(link).toHaveAttribute("aria-label", "Visit Example (opens in a new tab)");

    // Should NOT have the sr-only span to avoid duplication
    const srOnlySpan = link.querySelector(".sr-only");
    expect(srOnlySpan).not.toBeInTheDocument();
  });

  it("should append '(opens in a new tab)' to children via sr-only span for internal links with target='_blank'", () => {
    render(
      <ElementType href="/internal" target="_blank">
        Internal Link
      </ElementType>
    );

    const link = screen.getByText("Internal Link").closest("a");
    expect(link).toBeInTheDocument();
    expect(link?.textContent).toContain("(opens in a new tab)");

    const srOnlySpan = link?.querySelector(".sr-only");
    expect(srOnlySpan).toBeInTheDocument();
  });

  it("should append '(opens in a new tab)' to aria-label for internal links with target='_blank' if aria-label is present", () => {
    render(
      <ElementType href="/internal" target="_blank" aria-label="Visit Internal">
        Internal Link
      </ElementType>
    );

    const link = screen.getByRole("link", { name: "Visit Internal (opens in a new tab)" });
    expect(link).toBeInTheDocument();
    expect(link).toHaveAttribute("aria-label", "Visit Internal (opens in a new tab)");

    const srOnlySpan = link.querySelector(".sr-only");
    expect(srOnlySpan).not.toBeInTheDocument();
  });
});
