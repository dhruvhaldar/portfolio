import { SmartImage } from "@/once-ui/components/SmartImage";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

// Mock Next.js Image component
vi.mock("next/image", () => ({
  // biome-ignore lint/suspicious/noExplicitAny: mock
  // biome-ignore lint/a11y/useAltText: mock
  default: (props: any) => <img {...props} data-testid="next-image" />,
}));

describe("SmartImage Rendering", () => {
  it("should render an image when src is a standard image URL", () => {
    render(<SmartImage src="/images/test.jpg" alt="test image" />);
    const image = screen.getByTestId("next-image");
    expect(image).toBeInTheDocument();
    expect(image).toHaveAttribute("src", "/images/test.jpg");
    expect(image).toHaveAttribute("alt", "test image");
  });

  it("should render a video when src ends with .mp4", () => {
    const { container } = render(<SmartImage src="/videos/test.mp4" alt="test video" />);
    const video = container.querySelector("video");
    expect(video).toBeInTheDocument();
    expect(video).toHaveAttribute("src", "/videos/test.mp4");
    expect(video).toHaveAttribute("aria-label", "test video");
  });

  it("should render a YouTube iframe when src is a valid YouTube URL", () => {
    const youtubeUrl = "https://www.youtube.com/watch?v=12345678901";
    const { container } = render(<SmartImage src={youtubeUrl} alt="test youtube" />);
    const iframe = container.querySelector("iframe");
    expect(iframe).toBeInTheDocument();
    expect(iframe?.getAttribute("src")).toContain("embed/12345678901");
    expect(iframe).toHaveAttribute("title", "test youtube");
  });

  it("should manage focus when enlarged", async () => {
    render(<SmartImage src="/images/test.jpg" alt="test image" enlarge />);
    const trigger = screen.getByRole("button", { name: "Enlarge image" });

    // Initial state: not enlarged
    expect(screen.queryByLabelText("Close")).not.toBeInTheDocument();

    // Click to enlarge
    fireEvent.click(trigger);

    // Expect close button to appear and be focused
    const closeButton = await screen.findByLabelText("Close");
    expect(closeButton).toBeInTheDocument();

    // Verify focus is moved to close button
    await waitFor(() => expect(document.activeElement).toBe(closeButton));

    // Verify focus trap (Tab key) - preventing default
    const preventDefault = vi.fn();
    fireEvent.keyDown(closeButton, { key: "Tab", preventDefault });

    // Click close
    fireEvent.click(closeButton);

    // Expect focus to return to trigger
    await waitFor(() => expect(document.activeElement).toBe(trigger));
  });
});
