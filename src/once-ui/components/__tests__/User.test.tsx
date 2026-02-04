import { render, screen } from "@testing-library/react";
import React from "react";
import { describe, expect, it } from "vitest";
import { User } from "../User";

describe("User", () => {
  it("renders name and subline", () => {
    render(<User name="John Doe" subline="Software Engineer" />);
    expect(screen.getByText("John Doe")).toBeInTheDocument();
    expect(screen.getByText("Software Engineer")).toBeInTheDocument();
  });

  it("renders avatar with initials", () => {
    render(<User name="John Doe" avatarProps={{ value: "JD" }} />);
    expect(screen.getByText("JD")).toBeInTheDocument();
  });

  it("renders with children", () => {
    render(
      <User name="Jane Doe">
        <span data-testid="child-element">Child</span>
      </User>,
    );
    expect(screen.getByTestId("child-element")).toBeInTheDocument();
  });

  it("renders loading state", () => {
    // name is required to render the text column where skeletons live
    render(<User name="placeholder" loading />);
    expect(screen.getByLabelText("Loading name")).toBeInTheDocument();
    expect(screen.getByLabelText("Loading subline")).toBeInTheDocument();
  });

  it("renders with tag", () => {
    render(<User name="John Doe" tagProps={{ label: "Admin", variant: "brand" }} />);
    expect(screen.getByText("Admin")).toBeInTheDocument();
  });
});
