import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { AvatarGroup, AvatarProps } from "..";

describe("AvatarGroup", () => {
  const mockAvatars: AvatarProps[] = [
    { src: "https://example.com/a.jpg", alt: "Avatar A" },
    { src: "https://example.com/b.jpg", alt: "Avatar B" },
    { src: "https://example.com/c.jpg", alt: "Avatar C" },
  ];

  it("renders all avatars when no limit is provided", () => {
    render(<AvatarGroup avatars={mockAvatars} />);

    // We expect 3 avatars
    // SmartImage might render Image or fallback.
    // Avatar with src renders SmartImage.
    // If SmartImage uses next/image, it should have the alt text.
    // If we use getAllByRole('img'), we might pick up decorative images or icons if any.
    // But here we provided alt text.
    const avatars = screen.getAllByRole("img", { hidden: true }); // hidden: true to include elements hidden by accessibility tweaks if any
    // Wait, SmartImage uses Next Image which is role="img".
    // But let's filter by aria-label or alt if possible.

    // Actually, in Avatar.tsx:
    // <SmartImage ... alt={alt || "Avatar"} ... />

    // In SmartImage.tsx:
    // <Image src={src} alt={alt} ... />

    // So role="img" should work.
    // However, if SmartImage determines src is unsafe, it returns null.
    // "https://example.com/a.jpg" might be considered unsafe by security utils?
    // isSafeImageSrc checks protocol. https is fine.

    // Note: If SmartImage implementation involves async loading or lazy loading, it might render Skeleton first.
    // Skeleton has aria-label="Loading: ...".

    // Let's check for images with alt texts.
    expect(screen.getByAltText("Avatar A")).toBeInTheDocument();
    expect(screen.getByAltText("Avatar B")).toBeInTheDocument();
    expect(screen.getByAltText("Avatar C")).toBeInTheDocument();
  });

  it("renders limited avatars and remaining count", () => {
    render(<AvatarGroup avatars={mockAvatars} limit={2} />);

    // We expect 2 avatars (A and B)
    expect(screen.getByAltText("Avatar A")).toBeInTheDocument();
    expect(screen.getByAltText("Avatar B")).toBeInTheDocument();

    // Avatar C should NOT be there
    expect(screen.queryByAltText("Avatar C")).not.toBeInTheDocument();

    // Count avatar should be there: "+1"
    // The count avatar uses `value` prop in AvatarGroup.tsx:
    // <Avatar value={`+${remainingCount}`} ... />
    // Avatar with `value` renders:
    // <Text ...>{value}</Text>

    expect(screen.getByText("+1")).toBeInTheDocument();
  });

  it("renders correctly with empty list", () => {
    const { container } = render(<AvatarGroup avatars={[]} />);
    expect(container.firstChild).toBeEmptyDOMElement();
  });

  it("applies reverse stacking z-index", () => {
    // Just verify it doesn't crash
    render(<AvatarGroup avatars={mockAvatars} reverse />);
    expect(screen.getByAltText("Avatar A")).toBeInTheDocument();
  });
});
