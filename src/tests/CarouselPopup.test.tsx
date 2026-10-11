import { describe, it, expect, afterEach, vi } from "vitest";
import { render, screen, fireEvent, cleanup } from "@testing-library/react";
import { Carousel } from "@/once-ui/components/Carousel";
import React from "react";

// Mock next/image to render simple img for testing
vi.mock("next/image", () => ({
  default: ({ src, alt, ...props }: any) => <img src={src} alt={alt} {...props} />,
}));

describe("Carousel Lightbox Popup Functionality", () => {
  afterEach(() => {
    cleanup();
    document.body.innerHTML = "";
    document.body.style.overflow = "";
  });

  const testImages = [
    { src: "/images/car.avif", alt: "Mercedes DrivAer Car" },
    { src: "/images/downsampling.avif", alt: "Volume Downsampling Slide" },
  ];

  it("should open popup with cross button when clicking on a thumbnail", () => {
    render(<Carousel images={testImages} />);

    // Popup should not be visible initially
    expect(screen.queryByRole("dialog", { name: /image preview/i })).not.toBeInTheDocument();

    // Find and click the second thumbnail
    const thumbnails = screen.getAllByRole("button", { name: /view slide/i });
    expect(thumbnails.length).toBe(2);

    fireEvent.click(thumbnails[1]);

    // Popup modal should be open
    const dialog = screen.getByRole("dialog", { name: /image preview/i });
    expect(dialog).toBeInTheDocument();

    // Verify close cross button exists with accessible label
    const closeBtn = screen.getByRole("button", { name: /close image preview/i });
    expect(closeBtn).toBeInTheDocument();

    // Verify the image inside the popup
    const popupImg = dialog.querySelector("img");
    expect(popupImg).toHaveAttribute("src", "/images/downsampling.avif");
    expect(popupImg).toHaveAttribute("alt", "Volume Downsampling Slide");
  });

  it("should close the popup when the cross button is clicked", () => {
    render(<Carousel images={testImages} />);

    const thumbnails = screen.getAllByRole("button", { name: /view slide/i });
    fireEvent.click(thumbnails[0]);

    // Ensure dialog is open
    expect(screen.getByRole("dialog", { name: /image preview/i })).toBeInTheDocument();

    // Click close button
    const closeBtn = screen.getByRole("button", { name: /close image preview/i });
    fireEvent.click(closeBtn);

    // Dialog should be closed
    expect(screen.queryByRole("dialog", { name: /image preview/i })).not.toBeInTheDocument();
  });

  it("should close the popup when Escape key is pressed", () => {
    render(<Carousel images={testImages} />);

    const thumbnails = screen.getAllByRole("button", { name: /view slide/i });
    fireEvent.click(thumbnails[0]);

    expect(screen.getByRole("dialog", { name: /image preview/i })).toBeInTheDocument();

    // Press Escape
    fireEvent.keyDown(window, { key: "Escape" });

    expect(screen.queryByRole("dialog", { name: /image preview/i })).not.toBeInTheDocument();
  });

  it("should open the popup when clicking the main preview image", () => {
    render(<Carousel images={testImages} />);

    const mainImageButton = screen.getByRole("button", { name: /click to enlarge image/i });
    fireEvent.click(mainImageButton);

    const dialog = screen.getByRole("dialog", { name: /image preview/i });
    expect(dialog).toBeInTheDocument();

    const popupImg = dialog.querySelector("img");
    expect(popupImg).toHaveAttribute("src", "/images/car.avif");
  });

  it("should navigate to next image using next button in popup", () => {
    render(<Carousel images={testImages} />);

    const thumbnails = screen.getAllByRole("button", { name: /view slide/i });
    fireEvent.click(thumbnails[0]);

    const nextBtn = screen.getByRole("button", { name: /next image/i });
    fireEvent.click(nextBtn);

    const dialog = screen.getByRole("dialog", { name: /image preview/i });
    const popupImg = dialog.querySelector("img");
    expect(popupImg).toHaveAttribute("src", "/images/downsampling.avif");
  });
});
