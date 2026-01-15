"use client";

import React, { CSSProperties, useState, useRef, useEffect, useMemo, memo } from "react";
import Image from "next/image";

import { Flex, IconButton, Skeleton } from ".";

export interface SmartImageProps extends Omit<React.ComponentProps<typeof Flex>, 'height'> {
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

// 🛡️ Sentinel: Anchored regex to prevent confusion attacks (e.g. matching inside query params)
const YOUTUBE_REGEX =
  /^(?:https?:\/\/)?(?:[a-zA-Z0-9-]+\.)?(?:youtube\.com\/(?:[^\/\n\s]+\/\S+\/|(?:v|e(?:mbed)?)\/|\S*?[?&]v=)|youtu\.be\/)([a-zA-Z0-9_-]{11})/;

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
      ? `(max-width: 640px) ${responsive.mobile || '100vw'}, (max-width: 1024px) ${responsive.tablet || '50vw'}, ${responsive.desktop || '33vw'}`
      : "(max-width: 1200px) 100vw, 33vw";
  }, [sizes, responsive]);

  const calculateHeight = useMemo(() => {
    if (height) return typeof height === 'number' ? `${height}rem` : height;
    if (responsive?.mobile) return responsive.mobile;
    if (aspectRatio) return 'auto';
    return '100%';
  }, [height, responsive, aspectRatio]);

  const [isEnlarged, setIsEnlarged] = useState(false);
  const imageRef = useRef<HTMLDivElement>(null);

  const handleClick = () => {
    if (enlarge) {
      setIsEnlarged(!isEnlarged);
    }
  };

  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (enlarge && (event.key === 'Enter' || event.key === ' ')) {
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

  useEffect(() => {
    if (isEnlarged) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
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

  const isYouTubeVideo = (url: string) => {
    return YOUTUBE_REGEX.test(url);
  };

  const getYouTubeEmbedUrl = (url: string) => {
    const match = url.match(YOUTUBE_REGEX);
    return match
      ? `https://www.youtube.com/embed/${match[1]}?controls=0&rel=0&modestbranding=1`
      : "";
  };

  const isVideo = src?.endsWith(".mp4");
  const isYouTube = isYouTubeVideo(src);
  const [isLoaded, setIsLoaded] = useState(!!shouldPreload);

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
        {isLoading && <Skeleton shape="block" />}
        {!isLoading && isVideo && (
          <video
            src={src}
            autoPlay
            loop
            muted
            playsInline
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
            src={getYouTubeEmbedUrl(src)}
            allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
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
        >
          <IconButton
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
