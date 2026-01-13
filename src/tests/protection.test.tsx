import { render, screen } from "@testing-library/react";
import React from "react";
import { describe, expect, it, vi } from "vitest";
import Project from "../app/work/[slug]/page";

// Mock resources
vi.mock("@/app/resources", () => ({
  protectedRoutes: {
    "/work/secret-project": true,
    "/work/public-project": false,
  },
  baseURL: "localhost",
  person: { name: "Test User", avatar: "/avatar.jpg" },
  blog: { path: "/blog" },
}));

// Mock utils
vi.mock("@/app/utils/utils", () => ({
  getPostBySlug: vi.fn((slug) => ({
    metadata: {
      title: "Secret Project",
      publishedAt: "2023-01-01",
      summary: "Secret Summary",
      images: [],
      team: [],
    },
    slug: slug,
    content: "Secret Content",
  })),
  getPosts: vi.fn(() => []),
  getPostSlugs: vi.fn(() => []),
}));

// Mock formatDate
vi.mock("@/app/utils/formatDate", () => ({
  formatDate: (date: string) => date,
}));

// Mock components
vi.mock("@/once-ui/components", () => ({
  AvatarGroup: () => <div data-testid="avatar-group">AvatarGroup</div>,
  // biome-ignore lint/suspicious/noExplicitAny: Mocking components
  Column: ({ children }: any) => <div data-testid="column">{children}</div>,
  // biome-ignore lint/suspicious/noExplicitAny: Mocking components
  Flex: ({ children }: any) => <div data-testid="flex">{children}</div>,
  // biome-ignore lint/suspicious/noExplicitAny: Mocking components
  Heading: ({ children }: any) => <h1 data-testid="heading">{children}</h1>,
  SmartImage: () => <img data-testid="smart-image" alt="smart-image" />,
  // biome-ignore lint/suspicious/noExplicitAny: Mocking components
  Text: ({ children }: any) => <span data-testid="text">{children}</span>,
  // biome-ignore lint/suspicious/noExplicitAny: Mocking components
  SmartLink: ({ children }: any) => (
    <a href="/" data-testid="smart-link">
      {children}
    </a>
  ),
  // biome-ignore lint/suspicious/noExplicitAny: Mocking components
  Row: ({ children }: any) => <div data-testid="row">{children}</div>,
  // biome-ignore lint/suspicious/noExplicitAny: Mocking components
  Button: ({ children }: any) => <button type="button">{children}</button>,
  // biome-ignore lint/suspicious/noExplicitAny: Mocking components
  InlineCode: ({ children }: any) => <code>{children}</code>,
  // biome-ignore lint/suspicious/noExplicitAny: Mocking components
  RevealFx: ({ children }: any) => <div>{children}</div>,
  Line: () => <hr />,
  Icon: () => <span />,
  Avatar: () => <img alt="avatar" />,
}));

vi.mock("@/components/ShareButton", () => ({
  ShareButton: () => <div>ShareButton</div>,
}));

vi.mock("@/components/ScrollToHash", () => ({
  default: () => <div>ScrollToHash</div>,
}));

vi.mock("@/components/blog/TableOfContents", () => ({
  default: () => <div>TableOfContents</div>,
}));

vi.mock("@/components/mdx", () => ({
  CustomMDX: ({ source }: { source: string }) => <div data-testid="mdx-content">{source}</div>,
}));

describe("Project Page Security", () => {
  it("does not render sensitive content for protected route (Fix Verification)", async () => {
    const params = Promise.resolve({ slug: "secret-project" });
    const jsx = await Project({ params });

    render(jsx);

    // After fix: The sensitive content IS NOT rendered
    expect(screen.queryByTestId("mdx-content")).toBeNull();
    // And the protected message is shown
    expect(screen.getByText("Protected Content")).toBeDefined();
  });

  it("renders content for public route", async () => {
    const params = Promise.resolve({ slug: "public-project" });
    const jsx = await Project({ params });

    render(jsx);

    expect(screen.getByTestId("mdx-content")).toHaveTextContent("Secret Content");
  });
});
