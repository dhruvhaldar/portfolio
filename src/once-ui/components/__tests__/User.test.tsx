import { render, screen } from "@testing-library/react";
import React from "react";
import { describe, expect, it } from "vitest";
import { User } from "../User";

describe("User", () => {
  it("renders correctly with name and subline", () => {
    render(<User name="John Doe" subline="Software Engineer" />);
    expect(screen.getByText("John Doe")).toBeInTheDocument();
    expect(screen.getByText("Software Engineer")).toBeInTheDocument();
  });

  it("renders with avatar props", () => {
    render(
      <User
        name="Jane Doe"
        avatarProps={{ value: "JD", "aria-label": "Avatar for Jane" }}
      />
    );
    expect(screen.getByLabelText("Avatar for Jane")).toBeInTheDocument();
  });

  it("renders loading state", () => {
    render(<User loading name="Loading User" />);
    expect(screen.getByLabelText("Loading name")).toBeInTheDocument();
    expect(screen.getByLabelText("Loading subline")).toBeInTheDocument();
    // Name should NOT be visible when loading
    expect(screen.queryByText("Loading User")).not.toBeInTheDocument();
  });

  it("renders tag when provided", () => {
    render(
      <User
        name="Tagged User"
        tagProps={{ label: "Admin", variant: "brand" }}
      />
    );
    expect(screen.getByText("Admin")).toBeInTheDocument();
  });

  it("renders children content", () => {
    render(
      <User name="Parent User">
        <div data-testid="custom-child">Custom Content</div>
      </User>
    );
    expect(screen.getByTestId("custom-child")).toBeInTheDocument();
  });
});
