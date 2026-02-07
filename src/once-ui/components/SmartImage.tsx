"use client";

import Image from "next/image";
import type React from "react";
import { type CSSProperties, memo, useEffect, useMemo, useRef, useState } from "react";

import { extractYoutubeId, isSafeImageSrc } from "@/app/utils/security";
import { Flex, IconButton, Skeleton } from ".";

export interface SmartImageProps extends Omit<React.ComponentProps<typeof Flex>, "height"> {
  /** Aspect ratio of the image */
  aspectRatio?: string;
  /** Height of the image */
  height?: number | string;
  /** Alt text */
  alt?: string;
  /** Loading state */
  isLoading?: boolean;
  /** Object fit property */
  objectFit?: CSSProperties["objectFit"];
  /** Whether the image can be enlarged on click */
  enlarge?: boolean;
  /** Source URL */
  src: string;
  /** Whether to bypass Next.js image optimization */
  unoptimized?: boolean;
  /** Sizes attribute for responsive images */
  sizes?: string;
  /** Priority loading */
  priority?: boolean;
  /** Preload image */
  preload?: boolean;
  /** Loading behavior */
  loading?: "lazy" | "eager";
  /** Responsive breakpoint sizes */
  responsive?: {
    mobile?: string;
    tablet?: string;
    desktop?: string;
  };
}

/**
 * An enhanced image component that supports lazy loading, responsive sizing, and lightbox enlargement.
 * Handles both images and video sources.
 */
const SmartImageComponent: React.FC<SmartImageProps> = ({
  aspectRatio,
  height,
  alt = "",
  isLoading = false,
  objectFit = "cover",
  enlarge = false,
  src,
  unoptimized = false,
  priority,
  preload,
  loading = "lazy",
  responsive,
  sizes,
  ...rest
}) => {
  // Use preload if provided, otherwise fall back to priority for backward compatibility
  const shouldPreload = preload !== undefined ? preload : priority;

  const calculatedSizes = useMemo(() => {
    if (sizes) return sizes;
    return responsive
      ? `(max-width: 640px) ${responsive.mobile || "100vw"}, (max-width: 1024px) ${responsive.tablet || "50vw"}, ${responsive.desktop || "33vw"}`
      : "(max-width: 1200px) 100vw, 33vw";
  }, [sizes, responsive]);

  const calculateHeight = useMemo(() => {
    if (height) return typeof height === "number" ? `${height}rem` : height;
    if (responsive?.mobile) return responsive.mobile;
    if (aspectRatio) return "auto";
    return "100%";
  }, [height, responsive, aspectRatio]);

  const [isEnlarged, setIsEnlarged] = useState(false);
  const imageRef = useRef<HTMLDivElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const wasEnlarged = useRef(false);

  const handleClick = () => {
    if (enlarge) {
      setIsEnlarged(!isEnlarged);
    }
  };

  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (enlarge && (event.key === "Enter" || event.key === " ")) {
      event.preventDefault();
      setIsEnlarged(!isEnlarged);
    }
  };

  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape" && isEnlarged) {
        setIsEnlarged(false);
      }
    };

    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [isEnlarged]);

  // Palette: Manage focus and overflow when enlarged
  useEffect(() => {
    if (isEnlarged) {
      document.body.style.overflow = "hidden";
      wasEnlarged.current = true;
      // Focus close button on open
      requestAnimationFrame(() => {
        closeButtonRef.current?.focus();
      });
    } else {
      document.body.style.overflow = "auto";
      // Restore focus to trigger on close
      if (wasEnlarged.current) {
        imageRef.current?.focus();
        wasEnlarged.current = false;
      }
    }

    return () => {
      document.body.style.overflow = "auto";
    };
  }, [isEnlarged]);

  const transformStyle = useMemo(() => {
    if (!imageRef.current || !isEnlarged) {
      return {
        transform: "translate(0, 0) scale(1)",
        transition: "all 0.3s ease-in-out",
        zIndex: undefined,
      };
    }

    const rect = imageRef.current.getBoundingClientRect();
    const scaleX = window.innerWidth / rect.width;
    const scaleY = window.innerHeight / rect.height;
    const scale = Math.min(scaleX, scaleY) * 0.9;

    const translateX = (window.innerWidth - rect.width) / 2 - rect.left;
    const translateY = (window.innerHeight - rect.height) / 2 - rect.top;

    return {
      transform: `translate(${translateX}px, ${translateY}px) scale(${scale})`,
      transition: "all 0.3s ease-in-out",
      zIndex: 2,
    };
  }, [isEnlarged]);

  // Bolt: moved helper functions outside to avoid recreation on every render

  const { isVideo, isYouTube, youtubeEmbedUrl, isSafe } = useMemo(() => {
    if (!src) {
      return { isVideo: false, isYouTube: false, youtubeEmbedUrl: "", isSafe: true };
    }
    const isSafe = isSafeImageSrc(src);
    const isVideo = src?.endsWith(".mp4");

    // Bolt: Optimized to avoid redundant regex execution by extracting ID directly
    const youtubeId = extractYoutubeId(src);
    const isYouTube = !!youtubeId;
    // 🛡️ Sentinel: Use youtube-nocookie.com for better privacy
    const youtubeEmbedUrl = youtubeId ? `https://www.youtube-nocookie.com/embed/${youtubeId}?controls=0&rel=0&modestbranding=1` : "";

    return { isVideo, isYouTube, youtubeEmbedUrl, isSafe };
  }, [src]);

  const [isLoaded, setIsLoaded] = useState(!!shouldPreload);

  if (!src) {
    return null;
  }

  if (!isSafe) {
    console.error(`Security: Blocked dangerous image source: ${src}`);
    return null;
  }

  return (
    <>
      <Flex
        ref={imageRef}
        fillWidth
        overflow="hidden"
        position="relative"
        zIndex={0}
        cursor={enlarge ? "interactive" : ""}
        style={{
          outline: "none",
          isolation: "isolate",
          height: calculateHeight,
          aspectRatio: aspectRatio,
          borderRadius: isEnlarged ? "0" : undefined,
          ...transformStyle,
        }}
        onClick={handleClick}
        onKeyDown={enlarge ? handleKeyDown : undefined}
        role={enlarge ? "button" : undefined}
        tabIndex={enlarge ? 0 : undefined}
        aria-label={enlarge ? (isEnlarged ? "Close image" : "Enlarge image") : undefined}
        {...rest}
      >
        {(isLoading || (!isLoaded && !isVideo && !isYouTube)) && (
          <Skeleton
            shape="block"
            aria-busy="true"
            aria-label={alt ? `Loading: ${alt}` : "Loading image"}
            style={{
              position: "absolute",
              inset: 0,
            }}
          />
        )}
        {!isLoading && isVideo && (
          <video
            src={src}
            autoPlay
            loop
            muted
            playsInline
            aria-label={alt || "Video player"}
            style={{
              width: "100%",
              height: "100%",
              objectFit: objectFit,
            }}
          />
        )}
        {!isLoading && isYouTube && (
          <iframe
            width="100%"
            height="100%"
            src={youtubeEmbedUrl}
            allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            // 🛡️ Sentinel: Sandbox to restrict iframe capabilities (allow scripts/same-origin for YouTube)
            sandbox="allow-scripts allow-same-origin allow-presentation"
            title={alt || "YouTube video player"}
            style={{
              objectFit: objectFit,
            }}
          />
        )}
        {!isLoading && !isVideo && !isYouTube && (
          <Image
            src={src}
            alt={alt}
            priority={shouldPreload}
            fetchPriority={shouldPreload ? "high" : undefined}
            sizes={calculatedSizes}
            unoptimized={unoptimized}
            fill
            onLoad={() => setIsLoaded(true)}
            style={{
              objectFit: objectFit,
              opacity: isLoaded ? 1 : 0,
              filter: isLoaded ? "blur(0)" : "blur(20px)",
              transition: "opacity 0.5s ease-out, filter 0.5s ease-out",
            }}
          />
        )}
      </Flex>

      {isEnlarged && enlarge && (
        <Flex
          horizontal="center"
          vertical="center"
          position="fixed"
          background="overlay"
          onClick={handleClick}
          top="0"
          left="0"
          opacity={isEnlarged ? 100 : 0}
          cursor="interactive"
          transition="macro-medium"
          style={{
            width: "100vw",
            height: "100vh",
          }}
          role="dialog"
          aria-modal="true"
          aria-label="Enlarged view"
          onKeyDown={(e) => {
            if (e.key === "Tab") {
              e.preventDefault();
            }
          }}
        >
          <IconButton
            ref={closeButtonRef}
            icon="close"
            variant="ghost"
            style={{ position: "absolute", top: "16px", right: "16px", zIndex: 10 }}
            onClick={() => setIsEnlarged(false)}
            tooltip="Close"
          />
          <Flex
            position="relative"
            style={{
              height: "100vh",
              transform: "translate(-50%, -50%)",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {isVideo ? (
              <video
                src={src}
                autoPlay
                loop
                muted
                playsInline
                style={{
                  width: "90vw",
                  height: "auto",
                  objectFit: "contain",
                }}
              />
            ) : (
              <Image
                src={src}
                alt={alt}
                fill
                sizes="90vw"
                unoptimized={unoptimized}
                style={{
                  objectFit: "contain",
                }}
              />
            )}
          </Flex>
        </Flex>
      )}
    </>
  );
};

const SmartImage = memo(SmartImageComponent);
SmartImage.displayName = "SmartImage";
export { SmartImage };
