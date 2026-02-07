"use client";

import React, { useEffect, useMemo, memo } from 'react';
import lazyframe from 'lazyframe';
import 'lazyframe/dist/lazyframe.css';

import { extractYoutubeId } from "@/app/utils/security";
import { Flex, Text } from "@/once-ui/components";

interface LazyframeVideoProps {
  /** The source URL of the video (e.g., YouTube URL) */
  src: string;
  /** The title of the video frame */
  title?: string;
  /** Width of the video container */
  width?: string;
  /** Height of the video container */
  height?: string;
  /** Optional custom thumbnail URL */
  thumbnail?: string;
}

// Video title overlay gradient
const overlayBackground = "linear-gradient(to bottom, rgba(0,0,0,0.6) 0%, rgba(0,0,0,0) 100%)";

/**
 * A video component that lazily loads video content (like YouTube) to improve performance.
 * Uses the 'lazyframe' library.
 */
const LazyframeVideoComponent: React.FC<LazyframeVideoProps> = ({
  src,
  title = "Video player",
  width = "100%",
  height = "auto",
  thumbnail,
}) => {
  const videoRef = React.useRef<HTMLDivElement>(null);
  const initializedRef = React.useRef(false);

  // Bolt: Memoize regex execution and string operations to prevent redundant calculations on every render
  const { youtubeId, activeThumbnailUrl, safeSrc } = useMemo(() => {
    const youtubeId = extractYoutubeId(src);
    const defaultThumbnailUrl = youtubeId ? `https://i.ytimg.com/vi/${youtubeId}/hqdefault.jpg` : undefined;
    const activeThumbnailUrl = thumbnail || defaultThumbnailUrl;
    // 🛡️ Sentinel: Reconstruct the URL using the sanitized ID to prevent payload injection
    const safeSrc = youtubeId ? `https://www.youtube.com/watch?v=${youtubeId}` : null;
    return { youtubeId, activeThumbnailUrl, safeSrc };
  }, [src, thumbnail]);

  const [isPlaying, setIsPlaying] = React.useState(false);

  useEffect(() => {
    // Reset initialized ref when source changes
    if (initializedRef.current) {
        initializedRef.current = false;
    }
  }, [safeSrc]);

  useEffect(() => {
    if (!initializedRef.current && videoRef.current && safeSrc) {
      lazyframe(videoRef.current, {
        onAppend: (iframe: HTMLIFrameElement) => {
          // 🛡️ Sentinel: Enforce strict sandbox policies on the generated iframe
          iframe.setAttribute("sandbox", "allow-scripts allow-same-origin allow-presentation");

          // 🛡️ Sentinel: Ensure title attribute exists for accessibility and security context
          if (!iframe.getAttribute("title")) {
            iframe.setAttribute("title", title);
          }
        },
      });
      initializedRef.current = true;

      // 🛡️ Sentinel: Enforce sandbox and title on injected iframe
      const observer = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
          if (mutation.type === "childList") {
            mutation.addedNodes.forEach((node) => {
              if (node.nodeName === "IFRAME") {
                const iframe = node as HTMLIFrameElement;
                iframe.setAttribute(
                  "sandbox",
                  "allow-scripts allow-same-origin allow-presentation",
                );
                if (!iframe.getAttribute("title")) {
                  iframe.setAttribute("title", title || "Video player");
                }
                observer.disconnect();
              }
            });
          }
        });
      });

      observer.observe(videoRef.current, { childList: true, subtree: true });

      return () => observer.disconnect();
    }
    // Bolt: Added safeSrc to dependency array to re-initialize when video changes
  }, [safeSrc, title]);

  const handlePlay = () => {
    setIsPlaying(true);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      handlePlay();
    }
  };

  if (!youtubeId || !safeSrc) {
    return null;
  }

  return (
    <Flex
      fillWidth
      radius="l"
      padding="8"
      border="neutral-alpha-medium"
      background="neutral-alpha-weak"
      style={{
        backdropFilter: "blur(var(--static-space-1))"
      }}
    >
      <Flex
        position="relative"
        fillWidth
        radius="l"
        overflow="hidden"
        onClickCapture={isPlaying ? undefined : handlePlay}
        onKeyDown={isPlaying ? undefined : handleKeyDown}
        role={isPlaying ? undefined : "button"}
        tabIndex={isPlaying ? -1 : 0}
        aria-label={isPlaying ? undefined : `Play video: ${title}`}
        style={{
          isolation: "isolate",
          cursor: isPlaying ? "default" : "pointer"
        }}
      >
        <div
          // Bolt: Use key to force element recreation when source changes, ensuring lazyframe re-initialization
          key={safeSrc}
          ref={videoRef}
          className="lazyframe"
          data-src={safeSrc}
          data-vendor="youtube"
          data-thumbnail={activeThumbnailUrl}
          style={{
            width,
            height,
            aspectRatio: '16/9',
            objectFit: 'cover',
            display: 'block',
            backgroundImage: activeThumbnailUrl ? `url(${activeThumbnailUrl})` : undefined,
            backgroundSize: 'cover',
            backgroundPosition: 'center'
          }}
        ></div>
        {!isPlaying && (
          <>
            {/* Title Overlay */}
            {title && (
              <Flex
                position="absolute"
                top="0"
                left="0"
                padding="m"
                style={{
                  pointerEvents: "none",
                  zIndex: 2,
                  background: overlayBackground,
                  width: "100%"
                }}
              >
                <Text
                  variant="body-default-m"
                  style={{
                    color: "white",
                    textShadow: "0 1px 4px rgba(0,0,0,0.8)"
                  }}
                >
                  {title}
                </Text>
              </Flex>
            )}

            {/* Logo Overlay */}
            <Flex
              position="absolute"
              bottom="0"
              right="0"
              padding="s"
              style={{
                pointerEvents: "none",
                zIndex: 2
              }}
            >
              <img
                src="/images/youtube_full_logo.avif"
                alt="YouTube"
                style={{
                  height: '50px', // Scaled 2x
                  width: 'auto',
                  filter: "drop-shadow(0 1px 2px rgba(0,0,0,0.3))"
                }}
              />
            </Flex>
          </>
        )}
      </Flex>
    </Flex >
  );
};

// Bolt: Memoize component to prevent unnecessary re-renders when parent re-renders with stable props
const LazyframeVideo = memo(LazyframeVideoComponent);
LazyframeVideo.displayName = "LazyframeVideo";

export default LazyframeVideo;
