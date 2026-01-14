import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { ElementType } from "../ElementType";

describe("ElementType Security", () => {
  it("should not render javascript: URLs (XSS protection)", () => {
    render(<ElementType href="javascript:alert(1)">Malicious Link</ElementType>);

    // It should either not render the link, or render it with a safe href
    const link = screen.getByText("Malicious Link").closest("a");

    // In the current implementation, it likely renders an anchor with the javascript href.
    // The fix should prevent this.
    // We expect this to FAIL currently if we assert it shouldn't have javascript:
    // But for reproduction, we can just observe what it does.
    // Let's assert that it DOES render it currently (identifying the vuln)
    // or better, assert the desired state and watch it fail.

    if (link) {
      expect(link).not.toHaveAttribute("href", expect.stringContaining("javascript:"));
    }
  });

  it('should add rel="noopener noreferrer" to external links', () => {
    render(<ElementType href="https://example.com">External Link</ElementType>);

    const link = screen.getByText("External Link").closest("a");
    expect(link).toHaveAttribute("target", "_blank");
    expect(link).toHaveAttribute("rel", expect.stringContaining("noopener"));
    expect(link).toHaveAttribute("rel", expect.stringContaining("noreferrer"));
  });
});
