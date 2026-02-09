import { render, screen, waitFor, fireEvent } from "@testing-library/react";
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

// Mock components to avoid rendering full tree and allow form submission
vi.mock("@/once-ui/components", () => ({
  // biome-ignore lint/suspicious/noExplicitAny: Mocking components
  Button: ({ onClick, type, children }: any) => <button type={type} onClick={onClick}>{children}</button>,
  // biome-ignore lint/suspicious/noExplicitAny: Mocking components
  Column: ({ children, as: Component = 'div', onSubmit, ...props }: any) => {
    return (
      <Component onSubmit={onSubmit} {...props} data-testid="column-wrapper">
        {children}
      </Component>
    );
  },
  // biome-ignore lint/suspicious/noExplicitAny: Mocking components
  Flex: ({ children }: any) => <div>{children}</div>,
  // biome-ignore lint/suspicious/noExplicitAny: Mocking components
  Heading: ({ children }: any) => <h1>{children}</h1>,
  // biome-ignore lint/suspicious/noExplicitAny: Mocking components
  Input: ({ onChange, value, id, label }: any) => (
    <div data-testid="input-wrapper">
        <label htmlFor={id}>{label}</label>
        <input id={id} data-testid="password-input" value={value} onChange={onChange} />
    </div>
  ),
  Spinner: () => <div>Loading...</div>,
}));

describe("RouteGuard UX", () => {
  beforeEach(() => {
    vi.resetAllMocks();
    (usePathname as any).mockReturnValue("/protected");
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("allows form submission by pressing Enter in the password field", async () => {
    // Mock fetch for auth check (returns not authenticated initially)
    const mockFetch = vi.fn().mockImplementation((url) => {
      if (url === "/api/check-auth") {
        return Promise.resolve({
          ok: true,
          json: () => Promise.resolve({ authenticated: false }),
        });
      }
      if (url === "/api/authenticate") {
        return Promise.resolve({
          ok: true,
          json: () => Promise.resolve({ success: true }),
        });
      }
      return Promise.reject(new Error("Unknown URL"));
    });
    global.fetch = mockFetch;

    render(
      <RouteGuard>
        <div data-testid="protected-content">Secret Data</div>
      </RouteGuard>
    );

    // Wait for loading to finish and password prompt to appear
    await waitFor(() => {
      expect(screen.getByText("This page is password protected")).toBeInTheDocument();
    });

    const passwordInput = screen.getByTestId("password-input");

    // Type password
    fireEvent.change(passwordInput, { target: { value: "secret123" } });

    // Press Enter in the input field
    fireEvent.submit(passwordInput);

    // Wait for authentication attempt
    await waitFor(() => {
      expect(mockFetch).toHaveBeenCalledWith("/api/authenticate", expect.objectContaining({
        method: "POST",
        body: JSON.stringify({ password: "secret123" }),
      }));
    });
  });
});
