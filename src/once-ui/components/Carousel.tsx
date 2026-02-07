"use client";

import { Flex, Scroller, SmartImage } from "@/once-ui/components";
import { memo, useCallback, useEffect, useMemo, useRef, useState } from "react";

interface Image {
  src: string;
  alt: string;
}

interface CarouselProps extends React.ComponentProps<typeof Flex> {
  /** Array of images to display */
  images: Image[];
  /** Indicator style */
  indicator?: "line" | "thumbnail";
  /** Aspect ratio of the carousel */
  aspectRatio?: string;
  /** Image sizes attribute */
  sizes?: string;
  /** Whether to skip the initial reveal animation and show the carousel immediately */
  revealedByDefault?: boolean;
  /** Whether to preload images */
  preload?: boolean;
}

// Bolt: Extracted and memoized components to prevent unnecessary re-renders of all indicators/thumbnails
// when only one changes state.

interface CarouselIndicatorProps {
  index: number;
  isActive: boolean;
  onClick: (index: number) => void;
}

const CarouselIndicator = memo(({ index, isActive, onClick }: CarouselIndicatorProps) => {
  return (
    <Flex
      onClick={() => onClick(index)}
      onKeyDown={(e: React.KeyboardEvent) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          onClick(index);
        }
      }}
      role="button"
      tabIndex={0}
      aria-label={`Go to slide ${index + 1}`}
      style={{
        background: isActive
          ? "var(--neutral-on-background-strong)"
          : "var(--neutral-alpha-medium)",
        transition: "background 0.3s ease",
      }}
      cursor="interactive"
      fillWidth
      height="2"
    />
  );
});

CarouselIndicator.displayName = "CarouselIndicator";

interface CarouselThumbnailProps extends React.ComponentProps<typeof Flex> {
  image: Image;
  isActive: boolean;
  // Scroller injects these, but we ignore their changes in the comparator
  // as long as isActive and image are stable, assuming the handler logic is stable.
  onClick?: React.MouseEventHandler;
  onKeyDown?: React.KeyboardEventHandler;
}

const CarouselThumbnail = memo(
  ({ image, isActive, style, ...rest }: CarouselThumbnailProps) => {
    return (
      <Flex
        style={{
          border: isActive ? "2px solid var(--brand-solid-strong)" : "none",
          borderRadius: "var(--radius-m-nest-4)",
          transition: "border 0.3s ease",
          ...style,
        }}
        cursor="interactive"
        padding="4"
        width="80"
        height="80"
        {...rest}
      >
        <SmartImage
          alt={image.alt}
          aspectRatio="1 / 1"
          sizes="120px"
          src={image.src}
          cursor="interactive"
          radius="m"
          transition="macro-medium"
        />
      </Flex>
    );
  },
  (prev, next) => {
    // Bolt: Deep comparison for image props to allow stable renders even if image object reference changes
    return (
      prev.isActive === next.isActive &&
      prev.image.src === next.image.src &&
      prev.image.alt === next.image.alt
    );
  },
);

CarouselThumbnail.displayName = "CarouselThumbnail";

/**
 * An image carousel component with navigation indicators.
 */
const Carousel: React.FC<CarouselProps> = ({
  images = [],
  indicator = "thumbnail",
  aspectRatio = "16 / 9",
  sizes,
  revealedByDefault = false,
  preload = false,
  ...rest
}) => {
  const [activeIndex, setActiveIndex] = useState<number>(0);
  const nextImageRef = useRef<HTMLImageElement | null>(null);

  // Bolt: Use ref to access latest images in callbacks without adding it to dependency array
  // This stabilizes handleControlClick and prevents unnecessary re-renders of indicators
  const imagesRef = useRef(images);
  useEffect(() => {
    imagesRef.current = images;
  }, [images]);

  const preloadNextImage = useCallback((nextIndex: number) => {
    const currentImages = imagesRef.current;
    if (nextIndex >= 0 && nextIndex < currentImages.length) {
      nextImageRef.current = new Image();
      nextImageRef.current.src = currentImages[nextIndex].src;
    }
  }, []);

  const handleControlClick = useCallback(
    (nextIndex: number) => {
      setActiveIndex((current) => {
        if (nextIndex !== current) {
          preloadNextImage(nextIndex);
          return nextIndex;
        }
        return current;
      });
    },
    [preloadNextImage],
  );

  const handleImageClick = useCallback(() => {
    // Bolt: Access images via ref to keep handler stable
    const currentImages = imagesRef.current;
    if (currentImages.length > 1) {
      setActiveIndex((current) => {
        const nextIndex = (current + 1) % currentImages.length;
        if (nextIndex !== current) {
          preloadNextImage(nextIndex);
          return nextIndex;
        }
        return current;
      });
    }
  }, [preloadNextImage]);

  if (images.length === 0) {
    return null;
  }

  const isInteractive = images.length > 1;

  return (
    <Flex fillWidth gap="12" direction="column" {...rest}>
      <Flex
        onClick={handleImageClick}
        onKeyDown={(e: React.KeyboardEvent) => {
          if (isInteractive && (e.key === "Enter" || e.key === " ")) {
            e.preventDefault();
            handleImageClick();
          }
        }}
        role={isInteractive ? "button" : undefined}
        tabIndex={isInteractive ? 0 : undefined}
        aria-label={isInteractive ? "Next slide" : undefined}
        fillWidth
        position="relative"
        horizontal="center"
        aspectRatio={aspectRatio}
      >
        <SmartImage
          sizes={sizes}
          preload={preload}
          radius="l"
          border="neutral-alpha-weak"
          alt={images[activeIndex]?.alt}
          aspectRatio={aspectRatio}
          src={images[activeIndex]?.src}
          style={useMemo(
            () => ({
              ...(isInteractive && {
                cursor: "pointer",
              }),
            }),
            [isInteractive],
          )}
        />
      </Flex>
      {isInteractive &&
        (indicator === "line" ? (
          <Flex gap="4" paddingX="s" fillWidth horizontal="center">
            {images.map((image, index) => (
              <CarouselIndicator
                key={image.src}
                index={index}
                isActive={index === activeIndex}
                onClick={handleControlClick}
              />
            ))}
          </Flex>
        ) : (
          <Scroller fillWidth gap="4" onItemClick={handleControlClick}>
            {images.map((image, index) => (
              <CarouselThumbnail
                key={image.src}
                image={image}
                isActive={index === activeIndex}
                role="button"
                tabIndex={0}
                aria-label={`Go to slide ${index + 1}`}
                onKeyDown={(e: React.KeyboardEvent) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    handleControlClick(index);
                  }
                }}
              />
            ))}
          </Scroller>
        ))}
    </Flex>
  );
};

Carousel.displayName = "Carousel";
export { Carousel };
