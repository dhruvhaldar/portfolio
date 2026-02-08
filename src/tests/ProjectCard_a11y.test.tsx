import { ProjectCard } from "@/components/ProjectCard";
import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

// Mock next/image
vi.mock("next/image", () => ({
  // biome-ignore lint/suspicious/noExplicitAny: Mocking component props
  // biome-ignore lint/a11y/useAltText: Mock implementation
  default: ({ src, alt, ...props }: any) => <img src={src} alt={alt} {...props} />,
}));

// Mock next/link
vi.mock("next/link", () => ({
  // biome-ignore lint/suspicious/noExplicitAny: Mocking component props
  default: ({ children, ...props }: any) => <a {...props}>{children}</a>,
}));

describe("ProjectCard Accessibility", () => {
  const defaultProps = {
    href: "/work/test-project",
    title: "Test Project",
    content: "Some project content",
    images: ["/image1.jpg"],
    link: "https://example.com",
  };

  it('renders "Explore detailed insights" link with aria-label', () => {
    render(<ProjectCard {...defaultProps} />);

    const exploreLink = screen.getByRole("link", { name: /explore detailed insights/i });
    expect(exploreLink).toBeInTheDocument();

    // This assertion should fail initially as aria-label is missing
    expect(exploreLink).toHaveAttribute(
      "aria-label",
      "Explore detailed insights about Test Project",
    );
  });

  it('renders "View more details" link with aria-label', () => {
    render(<ProjectCard {...defaultProps} />);

    const detailsLink = screen.getByRole("link", { name: /view more details/i });
    expect(detailsLink).toBeInTheDocument();

    // This assertion should fail initially as aria-label is missing
    expect(detailsLink).toHaveAttribute(
      "aria-label",
      "View more details about Test Project (opens in a new tab)",
    );
  });
});
