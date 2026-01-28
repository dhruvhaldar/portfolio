import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { ElementType } from "../ElementType";

describe("ElementType Security", () => {
  it("should not render javascript: URLs (XSS protection)", () => {
    render(<ElementType href="javascript:alert(1)">Malicious Link</ElementType>);

    const link = screen.getByText("Malicious Link").closest("a");
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

  it('should treat protocol-relative URLs as external and add rel="noopener noreferrer"', () => {
    render(<ElementType href="//example.com">External Link</ElementType>);

    const link = screen.getByText("External Link").closest("a");
    expect(link).toHaveAttribute("href", "//example.com");
    expect(link).toHaveAttribute("target", "_blank");
    expect(link).toHaveAttribute("rel", expect.stringContaining("noopener"));
    expect(link).toHaveAttribute("rel", expect.stringContaining("noreferrer"));
  });
});
