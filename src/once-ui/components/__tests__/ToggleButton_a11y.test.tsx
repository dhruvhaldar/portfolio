import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { ToggleButton } from "../ToggleButton";

// Mock Icon to avoid complex rendering
vi.mock("../Icon", () => ({
  Icon: ({ name }: { name: string }) => <div data-testid={`icon-${name}`} />,
}));

// Mock SCSS module
vi.mock("../ToggleButton.module.scss", () => ({
  default: {
    button: "button",
    selected: "selected",
    ghost: "ghost",
    m: "m",
  },
}));

describe("ToggleButton Accessibility", () => {
  it("uses tooltip as aria-label when no label/children provided", () => {
    render(
      <ToggleButton
        selected={false}
        prefixIcon="home"
        tooltip="Go Home"
      />
    );
    // Should find button by aria-label "Go Home"
    expect(screen.getByLabelText("Go Home")).toBeDefined();
  });

  it("uses prefixIcon as fallback aria-label when no tooltip/label/children provided", () => {
    render(
      <ToggleButton
        selected={false}
        prefixIcon="settings"
      />
    );
    // Should find button by aria-label "settings"
    expect(screen.getByLabelText("settings")).toBeDefined();
  });

  it("prioritizes explicit aria-label over tooltip", () => {
    render(
      <ToggleButton
        selected={false}
        prefixIcon="home"
        tooltip="Go Home"
        aria-label="Main Page"
      />
    );
    expect(screen.getByLabelText("Main Page")).toBeDefined();
    // Verify it does NOT have "Go Home" as label (it might still have it as tooltip text, but accessible name is Main Page)
    expect(screen.queryByLabelText("Go Home")).toBeNull();
  });

  it("does not override aria-label when label/children are present", () => {
    render(
      <ToggleButton
        selected={false}
        prefixIcon="home"
        label="Home Text"
        tooltip="Go Home Tooltip"
      />
    );
    // The button has visible text "Home Text", so it should be accessible by that text.
    // However, if we don't set aria-label, screen reader uses text content.
    // We want to ensure we don't accidentally set aria-label="Go Home Tooltip" which would override text content.

    // If aria-label is set, it overrides text content.
    // If we set aria-label to tooltip, it would be "Go Home Tooltip".
    // We want to verify that we DO NOT set aria-label in this case, so the accessible name remains "Home Text".

    const button = screen.getByRole("button", { name: "Home Text" });
    expect(button).toBeDefined();
    expect(button.getAttribute("aria-label")).toBeNull();
  });

  it("applies aria-pressed when acting as a toggle button", () => {
    render(<ToggleButton selected={true} label="Pressed Button" />);
    const button = screen.getByRole("button", { name: "Pressed Button" });
    expect(button.getAttribute("aria-pressed")).toBe("true");

    render(<ToggleButton selected={false} label="Unpressed Button" />);
    const unpressedButton = screen.getByRole("button", { name: "Unpressed Button" });
    expect(unpressedButton.getAttribute("aria-pressed")).toBe("false");
  });

  it("does not apply aria-pressed when acting as a tab", () => {
    render(<ToggleButton selected={true} label="Tab Button" role="tab" />);
    const tab = screen.getByRole("tab", { name: "Tab Button" });
    expect(tab.getAttribute("aria-pressed")).toBeNull();
  });

  it("does not apply aria-pressed when acting as a link", () => {
    render(<ToggleButton selected={true} label="Link Button" href="#" />);
    const link = screen.getByRole("link", { name: "Link Button" });
    expect(link.getAttribute("aria-pressed")).toBeNull();
  });
});
