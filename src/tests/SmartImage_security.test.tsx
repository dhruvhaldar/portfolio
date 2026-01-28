import { SmartImage } from "@/once-ui/components/SmartImage";
import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

// Mock Next.js Image component since we are using happy-dom
vi.mock("next/image", () => ({
  // biome-ignore lint/suspicious/noExplicitAny: Mock component
  // biome-ignore lint/a11y/useAltText: Mock component
  default: (props: any) => <img {...props} />,
}));

describe("SmartImage Security", () => {
  it('should not treat a URL containing "youtube.com" as a YouTube video if it is not a valid YouTube URL', () => {
    // A URL that ends in .mp4 but contains youtube.com in the path
    // This triggers the unanchored regex match in the buggy version
    const maliciousUrl = "https://example.com/youtube.com/watch?v=12345678901/video.mp4";

    const { container } = render(<SmartImage src={maliciousUrl} alt="test" />);

    // Check for iframe
    const iframe = container.querySelector("iframe");

    // We expect the component to NOT render an iframe for this URL
    expect(iframe).toBeNull();

    // It should render a video tag instead (since it ends in .mp4)
    const video = container.querySelector("video");
    expect(video).not.toBeNull();
  });

  it("should correctly identify a valid YouTube URL", () => {
    const validUrl = "https://www.youtube.com/watch?v=12345678901";
    const { container } = render(<SmartImage src={validUrl} alt="test" />);

    const iframe = container.querySelector("iframe");
    expect(iframe).not.toBeNull();
    expect(iframe?.getAttribute("src")).toContain("embed/12345678901");
  });

  it("should render iframe with security and accessibility attributes", () => {
    const validUrl = "https://www.youtube.com/watch?v=12345678901";
    const { container } = render(<SmartImage src={validUrl} alt="test" />);

    const iframe = container.querySelector("iframe");
    expect(iframe).not.toBeNull();

    // Security check: sandbox attribute
    expect(iframe?.getAttribute("sandbox")).toBe(
      "allow-scripts allow-same-origin allow-presentation",
    );

    // Accessibility check: title attribute
    expect(iframe?.getAttribute("title")).toBe("YouTube video player");
  });
});
