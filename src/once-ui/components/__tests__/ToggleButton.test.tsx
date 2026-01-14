import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { ToggleButton } from "../ToggleButton";

// Mock Icon to avoid complex rendering
vi.mock("../Icon", () => ({
  Icon: ({ name }: { name: string }) => <div data-testid={`icon-${name}`} />,
}));

// Mock SCSS module to verify class application
vi.mock("../ToggleButton.module.scss", () => ({
  default: {
    button: "button",
    selected: "selected",
    ghost: "ghost",
    m: "m",
  },
}));

describe("ToggleButton", () => {
  it("renders with label", () => {
    render(<ToggleButton label="Test Button" selected={false} />);
    expect(screen.getByText("Test Button")).toBeDefined();
  });

  it("renders with icon", () => {
    render(<ToggleButton selected={false} prefixIcon="home" />);
    expect(screen.getByTestId("icon-home")).toBeDefined();
  });

  it("applies selected class", () => {
    render(<ToggleButton label="Selected" selected={true} />);
    // Since we mocked the styles, we expect the class "selected" to be present
    const button = screen.getByRole("button");
    expect(button.className).toContain("selected");
  });

  it("handles click events", () => {
    const handleClick = vi.fn();
    render(<ToggleButton label="Click Me" selected={false} onClick={handleClick} />);
    fireEvent.click(screen.getByRole("button"));
    expect(handleClick).toHaveBeenCalledTimes(1);
  });
});
