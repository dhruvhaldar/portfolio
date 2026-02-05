import { render, screen, waitFor } from "@testing-library/react";
import React from "react";
import { describe, expect, it, vi, beforeEach, afterEach } from "vitest";
import { RouteGuard } from "@/components/RouteGuard";
import { usePathname } from "next/navigation";

// Mock next/navigation
vi.mock("next/navigation", () => ({
  usePathname: vi.fn(),
}));

// Mock resources
vi.mock("@/app/resources", () => ({
  protectedRoutes: {
    "/protected": true,
  },
  routes: {
    "/protected": true,
  },
}));

// Mock components to avoid rendering full tree
vi.mock("@/once-ui/components", () => ({
  // biome-ignore lint/suspicious/noExplicitAny: Mocking components
  Button: ({ onClick, children }: any) => <button onClick={onClick}>{children}</button>,
  // biome-ignore lint/suspicious/noExplicitAny: Mocking components
  Column: ({ children }: any) => <div>{children}</div>,
  // biome-ignore lint/suspicious/noExplicitAny: Mocking components
  Flex: ({ children }: any) => <div>{children}</div>,
  // biome-ignore lint/suspicious/noExplicitAny: Mocking components
  Heading: ({ children }: any) => <h1>{children}</h1>,
  // biome-ignore lint/suspicious/noExplicitAny: Mocking components
  Input: ({ onChange, value }: any) => (
    <input data-testid="password-input" value={value} onChange={onChange} />
  ),
  Spinner: () => <div>Loading...</div>,
}));

describe("RouteGuard Security Bypass", () => {
  beforeEach(() => {
    vi.resetAllMocks();
    (usePathname as any).mockReturnValue("/protected");
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("prevents auth bypass when server returns 200 OK with HTML (SPA fallback)", async () => {
    // 🛡️ Sentinel: Simulate a server returning 200 OK but with HTML content (index.html)
    // instead of the expected JSON. This mimics a misconfigured static server or SPA fallback.
    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      status: 200,
      headers: { get: () => "text/html" },
      // The current implementation calls json(), which should fail for non-JSON content.
      json: async () => { throw new Error("Unexpected end of JSON input"); },
      text: async () => "<!DOCTYPE html><html>...</html>",
    });

    render(
      <RouteGuard>
        <div data-testid="protected-content">Secret Data</div>
      </RouteGuard>
    );

    // Assert that the protected content is NOT rendered
    await waitFor(() => {
      expect(screen.queryByTestId("protected-content")).not.toBeInTheDocument();
    });

    // Assert that the password prompt IS rendered
    expect(screen.getByText("This page is password protected")).toBeInTheDocument();
  });
});
