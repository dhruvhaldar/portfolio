import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { Toast } from "../Toast";

// Mock dependencies
vi.mock("../Icon", () => ({
  Icon: ({ name }: { name: string }) => <div data-testid={`icon-${name}`} />,
}));

vi.mock("../IconButton", () => ({
  IconButton: (props: any) => <button onClick={props.onClick}>Close</button>,
}));

vi.mock("classnames", () => ({
  default: (...args: any[]) => args.join(" "),
}));

describe("Toast Accessibility", () => {
  it("renders success variant with role='status' and aria-live='polite'", () => {
    render(
      <Toast variant="success" onClose={() => { }}>
        Success message
      </Toast>
    );

    const toast = screen.getByText("Success message").closest("[role]");
    expect(toast).toHaveAttribute("role", "status");
    expect(toast).toHaveAttribute("aria-live", "polite");
  });

  it("renders danger variant with role='alert' and aria-live='assertive'", () => {
    render(
      <Toast variant="danger" onClose={() => { }}>
        Error message
      </Toast>
    );

    const toast = screen.getByText("Error message").closest("[role]");
    expect(toast).toHaveAttribute("role", "alert");
    expect(toast).toHaveAttribute("aria-live", "assertive");
  });

  it("calls onClose when Escape key is pressed", async () => {
    const onClose = vi.fn();
    render(
      <Toast variant="success" onClose={onClose}>
        Dismiss me
      </Toast>
    );

    // Find the close button (rendered by our mock IconButton)
    const closeButton = screen.getByText("Close");

    // Simulate focus on the close button (simulating user tabbing into the toast)
    closeButton.focus();

    // Simulate Escape key press. The event should bubble up to the Toast container
    fireEvent.keyDown(closeButton, { key: "Escape", code: "Escape", bubbles: true });

    // Wait for the state update and effect to fire
    await waitFor(() => expect(onClose).toHaveBeenCalled());
  });
});
