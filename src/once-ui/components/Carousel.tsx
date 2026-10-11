"use client";

import { memo, useCallback, useEffect, useMemo, useRef, useState } from "react";
import ReactDOM from "react-dom";
import { Flex, Scroller, SmartImage } from "@/once-ui/components";

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
      aria-current={isActive ? "true" : undefined}
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
          transition: "border 0.3s ease, transform 0.2s ease",
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
    return (
      prev.isActive === next.isActive &&
      prev.image.src === next.image.src &&
      prev.image.alt === next.image.alt
    );
  },
);

CarouselThumbnail.displayName = "CarouselThumbnail";

/**
 * An image carousel component with navigation indicators and interactive lightbox popup.
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
  const [popupIndex, setPopupIndex] = useState<number | null>(null);
  const [mounted, setMounted] = useState(false);
  const nextImageRef = useRef<HTMLImageElement | null>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

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
      setActiveIndex(nextIndex);
      setPopupIndex(nextIndex);
      preloadNextImage(nextIndex);
    },
    [preloadNextImage],
  );

  const handleImageClick = useCallback(() => {
    setPopupIndex(activeIndex);
  }, [activeIndex]);

  // Lock body scroll while popup is open
  useEffect(() => {
    if (popupIndex !== null) {
      const originalOverflow = document.body.style.overflow;
      document.body.style.overflow = "hidden";
      return () => {
        document.body.style.overflow = originalOverflow;
      };
    }
  }, [popupIndex]);

  // Handle keyboard navigation for the popup
  useEffect(() => {
    if (popupIndex === null) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setPopupIndex(null);
      } else if (e.key === "ArrowLeft") {
        setPopupIndex((current) => {
          if (current === null) return null;
          const len = imagesRef.current.length;
          return (current - 1 + len) % len;
        });
      } else if (e.key === "ArrowRight") {
        setPopupIndex((current) => {
          if (current === null) return null;
          const len = imagesRef.current.length;
          return (current + 1) % len;
        });
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [popupIndex]);

  if (images.length === 0) {
    return null;
  }

  const isInteractive = images.length > 1;

  return (
    <>
      <Flex fillWidth gap="12" direction="column" {...rest}>
        <Flex
          onClick={handleImageClick}
          onKeyDown={(e: React.KeyboardEvent) => {
            if (e.key === "Enter" || e.key === " ") {
              e.preventDefault();
              handleImageClick();
            }
          }}
          role="button"
          tabIndex={0}
          aria-label="Click to enlarge image"
          fillWidth
          position="relative"
          horizontal="center"
          aspectRatio={aspectRatio}
          cursor="interactive"
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
                cursor: "pointer",
              }),
              [],
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
                  aria-label={`View slide ${index + 1}: ${image.alt || "image"}`}
                  aria-current={index === activeIndex ? "true" : undefined}
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

      {/* Lightbox Popup Modal with Close Cross Button */}
      {mounted &&
        popupIndex !== null &&
        typeof document !== "undefined" &&
        ReactDOM.createPortal(
          <div
            role="dialog"
            aria-modal="true"
            aria-label="Image preview"
            onClick={() => setPopupIndex(null)}
            style={{
              position: "fixed",
              inset: 0,
              zIndex: 99999,
              backgroundColor: "rgba(0, 0, 0, 0.9)",
              backdropFilter: "blur(16px)",
              WebkitBackdropFilter: "blur(16px)",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              padding: "1rem",
              boxSizing: "border-box",
              userSelect: "none",
              animation: "carouselFadeIn 0.2s ease-out",
            }}
          >
            <style>{`
              @keyframes carouselFadeIn {
                from { opacity: 0; }
                to { opacity: 1; }
              }
              .carousel-popup-btn {
                display: flex;
                align-items: center;
                justify-content: center;
                border-radius: 50%;
                cursor: pointer;
                transition: transform 0.15s ease, background-color 0.15s ease;
                border: 1px solid rgba(255, 255, 255, 0.25);
                color: #ffffff;
                background-color: rgba(255, 255, 255, 0.15);
                box-shadow: 0 4px 12px rgba(0, 0, 0, 0.4);
                padding: 0;
              }
              .carousel-popup-btn:hover {
                background-color: rgba(255, 255, 255, 0.3);
                transform: scale(1.08);
              }
              .carousel-popup-btn:focus-visible {
                outline: 2px solid var(--brand-solid-strong, #3b82f6);
                outline-offset: 2px;
              }
              .carousel-popup-btn:active {
                transform: scale(0.96);
              }
            `}</style>

            {/* Top Bar with Cross Button */}
            <div
              style={{
                position: "fixed",
                top: "1rem",
                right: "1rem",
                zIndex: 100000,
                display: "flex",
                alignItems: "center",
                gap: "0.75rem",
              }}
              onClick={(e) => e.stopPropagation()}
            >
              <button
                type="button"
                className="carousel-popup-btn"
                onClick={() => setPopupIndex(null)}
                aria-label="Close image preview"
                style={{
                  width: "44px",
                  height: "44px",
                  minWidth: "44px",
                  minHeight: "44px",
                }}
              >
                <svg
                  width="22"
                  height="22"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                >
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>
            </div>

            {/* Previous Button (if multiple images) */}
            {images.length > 1 && (
              <button
                type="button"
                className="carousel-popup-btn"
                onClick={(e) => {
                  e.stopPropagation();
                  setPopupIndex((prev) =>
                    prev !== null ? (prev - 1 + images.length) % images.length : 0
                  );
                }}
                aria-label="Previous image"
                style={{
                  position: "fixed",
                  left: "1rem",
                  top: "50%",
                  transform: "translateY(-50%)",
                  width: "44px",
                  height: "44px",
                  minWidth: "44px",
                  minHeight: "44px",
                  zIndex: 100000,
                }}
              >
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                >
                  <polyline points="15 18 9 12 15 6" />
                </svg>
              </button>
            )}

            {/* Next Button (if multiple images) */}
            {images.length > 1 && (
              <button
                type="button"
                className="carousel-popup-btn"
                onClick={(e) => {
                  e.stopPropagation();
                  setPopupIndex((prev) =>
                    prev !== null ? (prev + 1) % images.length : 0
                  );
                }}
                aria-label="Next image"
                style={{
                  position: "fixed",
                  right: "1rem",
                  top: "50%",
                  transform: "translateY(-50%)",
                  width: "44px",
                  height: "44px",
                  minWidth: "44px",
                  minHeight: "44px",
                  zIndex: 100000,
                }}
              >
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                >
                  <polyline points="9 18 15 12 9 6" />
                </svg>
              </button>
            )}

            {/* Image & Caption Container */}
            <div
              onClick={(e) => e.stopPropagation()}
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                maxWidth: "min(94vw, 1300px)",
                maxHeight: "86vh",
                position: "relative",
              }}
            >
              <img
                src={images[popupIndex]?.src}
                alt={images[popupIndex]?.alt || "Enlarged image preview"}
                style={{
                  maxWidth: "min(92vw, 1300px)",
                  maxHeight: "min(80vh, 850px)",
                  width: "auto",
                  height: "auto",
                  objectFit: "contain",
                  borderRadius: "var(--radius-l, 12px)",
                  boxShadow:
                    "0 25px 60px -15px rgba(0, 0, 0, 0.9), 0 0 0 1px rgba(255, 255, 255, 0.15)",
                }}
              />

              {/* Caption & Counter */}
              <div
                style={{
                  marginTop: "0.85rem",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "0.75rem",
                  color: "rgba(255, 255, 255, 0.9)",
                  fontSize: "0.875rem",
                  textAlign: "center",
                  maxWidth: "min(92vw, 900px)",
                  padding: "0 0.5rem",
                }}
              >
                {images.length > 1 && (
                  <span
                    style={{
                      padding: "2px 8px",
                      borderRadius: "12px",
                      backgroundColor: "rgba(255, 255, 255, 0.15)",
                      fontSize: "0.75rem",
                      fontWeight: 600,
                      letterSpacing: "0.02em",
                    }}
                  >
                    {popupIndex + 1} / {images.length}
                  </span>
                )}
                {images[popupIndex]?.alt && (
                  <span style={{ textShadow: "0 1px 3px rgba(0, 0, 0, 0.8)" }}>
                    {images[popupIndex].alt}
                  </span>
                )}
              </div>
            </div>
          </div>,
          document.body,
        )}
    </>
  );
};

Carousel.displayName = "Carousel";

export { Carousel };
