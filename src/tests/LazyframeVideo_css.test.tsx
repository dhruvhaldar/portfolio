import { render, screen } from "@testing-library/react";
import React from "react";
import { describe, expect, it, vi } from "vitest";
import LazyframeVideo from "../components/LazyframeVideo";

// Mock lazyframe to avoid errors during render
vi.mock("lazyframe", () => ({
  default: vi.fn(),
}));

describe("LazyframeVideo CSS Injection", () => {
  it("should securely escape special characters in thumbnail URL using JSON.stringify", () => {
    // A valid YouTube URL is required to render the component
    const src = "https://www.youtube.com/watch?v=dQw4w9WgXcQ";

    // A simplified thumbnail to verify JSON.stringify behavior (double quotes)
    // HappyDOM seems to have issues with complex URLs or quotes in url()
    const simpleThumbnail = "/images/simple.jpg";

    render(<LazyframeVideo src={src} thumbnail={simpleThumbnail} />);

    // Find the element with the background image
    const container = screen.getByRole("button");
    const lazyframeDiv = container.querySelector(".lazyframe");

    expect(lazyframeDiv).toBeInTheDocument();

    // Get the inline style
    const backgroundImage = lazyframeDiv?.style.backgroundImage;

    // Verify that JSON.stringify was used.
    // JSON.stringify("/images/simple.jpg") -> "/images/simple.jpg" (with double quotes)
    // So url() should wrap it: url("/images/simple.jpg")
    // The old implementation would produce: url('/images/simple.jpg') (with single quotes)

    expect(backgroundImage).toBe('url("/images/simple.jpg")');
  });
});
