import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { ElementType } from "../ElementType";

describe("ElementType Security - Internal Links with Target Blank", () => {
  it('should add rel="noopener noreferrer" when opening internal links in a new tab', () => {
    render(
      <ElementType href="/internal-doc.pdf" target="_blank">
        Internal PDF
      </ElementType>
    );

    const link = screen.getByText("Internal PDF").closest("a");
    expect(link).toBeInTheDocument();
    expect(link).toHaveAttribute("target", "_blank");
    // This expects the component to automatically add security attributes
    expect(link).toHaveAttribute("rel", expect.stringContaining("noopener"));
    expect(link).toHaveAttribute("rel", expect.stringContaining("noreferrer"));
  });
});
