import { fireEvent, render, screen } from "@testing-library/react";
import React from "react";
import { describe, expect, it, vi } from "vitest";
import { Feedback } from "../Feedback";

describe("Feedback", () => {
  it("renders title and description", () => {
    render(<Feedback title="Alert Title" description="Alert Description" />);
    expect(screen.getByRole("heading", { name: "Alert Title" })).toBeInTheDocument();
    expect(screen.getByText("Alert Description")).toBeInTheDocument();
  });

  it("fires onClose when close button clicked", () => {
    const handleClose = vi.fn();
    render(<Feedback title="Alert" showCloseButton onClose={handleClose} />);
    const closeButton = screen.getByLabelText("Close alert");
    fireEvent.click(closeButton);
    expect(handleClose).toHaveBeenCalled();
  });

  it("renders action button and handles click", () => {
    const handleAction = vi.fn();
    render(
      <Feedback
        actionButtonProps={{
          label: "Retry",
          onClick: handleAction,
        }}
      />,
    );
    const actionButton = screen.getByRole("button", { name: "Retry" });
    fireEvent.click(actionButton);
    expect(handleAction).toHaveBeenCalled();
  });
});
