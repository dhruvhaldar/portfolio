import { render, screen } from "@testing-library/react";
import React from "react";
import { describe, expect, it } from "vitest";
import { Avatar } from "../Avatar";

describe("Avatar", () => {
  it("renders correctly with initials", () => {
    render(<Avatar value="JD" />);
    expect(screen.getByText("JD")).toBeInTheDocument();
    expect(screen.getByLabelText("Avatar with initials JD")).toBeInTheDocument();
  });

  it("renders empty state when no props provided", () => {
    render(<Avatar />);
    expect(screen.getByLabelText("Empty avatar")).toBeInTheDocument();
  });

  it("renders empty state explicitly", () => {
    render(<Avatar empty />);
    expect(screen.getByLabelText("Empty avatar")).toBeInTheDocument();
  });

  it("renders loading state", () => {
    render(<Avatar loading />);
    expect(screen.getByLabelText("Loading avatar")).toBeInTheDocument();
  });

  // Note: Checking Image rendering is harder as SmartImage handles it.
  // But we can check if it renders without crashing.
  it("renders with src", () => {
    const { container } = render(<Avatar src="/avatar.jpg" />);
    // SmartImage renders Next Image, which might be stubbed or just render img
    // We can just check it rendered something
    expect(container.firstChild).toBeInTheDocument();
  });

  it("renders status indicator", () => {
    render(<Avatar value="JD" statusIndicator={{ color: "green" }} />);
    expect(screen.getByLabelText("Status: green")).toBeInTheDocument();
  });

  it("renders with alt text when provided with src", () => {
    render(<Avatar src="/avatar.jpg" alt="John Doe" />);
    expect(screen.getByAltText("John Doe")).toBeInTheDocument();
  });

  it("renders with custom aria-label when provided with value and alt", () => {
    render(<Avatar value="JD" alt="John Doe" />);
    expect(screen.getByText("JD")).toBeInTheDocument();
    expect(screen.getByLabelText("Avatar for John Doe")).toBeInTheDocument();
  });
});
