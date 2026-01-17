import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { Toast } from "../Toast";

// Mock dependencies
vi.mock("../Icon", () => ({
  Icon: ({ name }: { name: string }) => <div data-testid={`icon-${name}`} />,
}));

vi.mock("../IconButton", () => ({
  IconButton: () => <button>Close</button>,
}));

vi.mock("classnames", () => ({
  default: (...args: any[]) => args.join(" "),
}));

describe("Toast Accessibility", () => {
  it("renders success variant with role='status' and aria-live='polite'", () => {
    render(
      <Toast variant="success">
        Success message
      </Toast>
    );

    // Toast renders a Flex div with the role
    const toast = screen.getByText("Success message").closest("[role]");
    expect(toast).toHaveAttribute("role", "status");
    expect(toast).toHaveAttribute("aria-live", "polite");
  });

  it("renders danger variant with role='alert' and aria-live='assertive'", () => {
    render(
      <Toast variant="danger">
        Error message
      </Toast>
    );

    const toast = screen.getByText("Error message").closest("[role]");
    expect(toast).toHaveAttribute("role", "alert");
    expect(toast).toHaveAttribute("aria-live", "assertive");
  });
});
