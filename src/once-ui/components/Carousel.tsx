"use client";

import { Flex, RevealFx, Scroller, SmartImage } from "@/once-ui/components";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";

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
  const [isTransitioning, setIsTransitioning] = useState(revealedByDefault);
  const [initialTransition, setInitialTransition] = useState(revealedByDefault);
  const nextImageRef = useRef<HTMLImageElement | null>(null);
  const transitionTimeoutRef = useRef<NodeJS.Timeout | undefined>(undefined);

  const preloadNextImage = useCallback(
    (nextIndex: number) => {
      if (nextIndex >= 0 && nextIndex < images.length) {
        nextImageRef.current = new Image();
        nextImageRef.current.src = images[nextIndex].src;
      }
    },
    [images],
  );

  const handleControlClick = useCallback(
    (nextIndex: number) => {
      if (nextIndex !== activeIndex && !transitionTimeoutRef.current) {
        preloadNextImage(nextIndex);

        setIsTransitioning(false);

        transitionTimeoutRef.current = setTimeout(() => {
          setActiveIndex(nextIndex);

          setTimeout(() => {
            setIsTransitioning(true);
            transitionTimeoutRef.current = undefined;
          }, 300);
        }, 800);
      }
    },
    [activeIndex, preloadNextImage],
  );

  const handleImageClick = useCallback(() => {
    if (images.length > 1) {
      const nextIndex = (activeIndex + 1) % images.length;
      handleControlClick(nextIndex);
    }
  }, [images.length, activeIndex, handleControlClick]);

  useEffect(() => {
    if (!revealedByDefault && !initialTransition) {
      setIsTransitioning(true);
      setInitialTransition(true);
    }
    return () => {
      if (transitionTimeoutRef.current) {
        clearTimeout(transitionTimeoutRef.current);
      }
    };
  }, [revealedByDefault, initialTransition]);

  if (images.length === 0) {
    return null;
  }

  const isInteractive = images.length > 1;

  return (
    <Flex fillWidth gap="12" direction="column" {...rest}>
      <RevealFx
        onClick={handleImageClick}
        onKeyDown={(e) => {
          if (isInteractive && (e.key === "Enter" || e.key === " ")) {
            e.preventDefault();
            handleImageClick();
          }
        }}
        role={isInteractive ? "button" : undefined}
        tabIndex={isInteractive ? 0 : undefined}
        aria-label={isInteractive ? "Next slide" : undefined}
        fillWidth
        revealedByDefault={revealedByDefault}
        trigger={isTransitioning}
        translateY="16"
        aspectRatio={aspectRatio}
        speed="fast"
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
      </RevealFx>
      {isInteractive &&
        (indicator === "line" ? (
          <Flex gap="4" paddingX="s" fillWidth horizontal="center">
            {images.map((_, index) => (
              <Flex
                key={index}
                onClick={() => handleControlClick(index)}
                onKeyDown={(e: React.KeyboardEvent) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    handleControlClick(index);
                  }
                }}
                role="button"
                tabIndex={0}
                aria-label={`Go to slide ${index + 1}`}
                style={{
                  background:
                    activeIndex === index
                      ? "var(--neutral-on-background-strong)"
                      : "var(--neutral-alpha-medium)",
                  transition: "background 0.3s ease",
                }}
                cursor="interactive"
                fillWidth
                height="2"
              />
            ))}
          </Flex>
        ) : (
          <Scroller fillWidth gap="4" onItemClick={handleControlClick}>
            {images.map((image, index) => (
              <Flex
                key={index}
                role="button"
                tabIndex={0}
                aria-label={`Go to slide ${index + 1}`}
                onKeyDown={(e: React.KeyboardEvent) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    handleControlClick(index);
                  }
                }}
                style={{
                  border: activeIndex === index ? "2px solid var(--brand-solid-strong)" : "none",
                  borderRadius: "var(--radius-m-nest-4)",
                  transition: "border 0.3s ease",
                }}
                cursor="interactive"
                padding="4"
                width="80"
                height="80"
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
            ))}
          </Scroller>
        ))}
    </Flex>
  );
};

Carousel.displayName = "Carousel";
export { Carousel };
