"use client"; // Add this line

import React, { useEffect } from 'react';
import lazyframe from 'lazyframe';
import 'lazyframe/dist/lazyframe.css';

import { extractYoutubeId, isSafeImageSrc } from "@/app/utils/security";
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
const LazyframeVideo: React.FC<LazyframeVideoProps> = ({
  src,
  title = "Video player",
  width = "100%",
  height = "auto",
  thumbnail,
}) => {
  const videoRef = React.useRef<HTMLDivElement>(null);
  const initializedRef = React.useRef(false);

  const youtubeId = extractYoutubeId(src);
  const defaultThumbnailUrl = youtubeId ? `https://i.ytimg.com/vi/${youtubeId}/hqdefault.jpg` : undefined;

  // 🛡️ Sentinel: Validate thumbnail URL to prevent injection in style or attributes
  const isThumbnailSafe = thumbnail ? isSafeImageSrc(thumbnail) : false;
  if (thumbnail && !isThumbnailSafe) {
    console.error(`Security: Blocked dangerous thumbnail source in LazyframeVideo: ${thumbnail}`);
  }
  const activeThumbnailUrl = (isThumbnailSafe ? thumbnail : undefined) || defaultThumbnailUrl;

  // 🛡️ Sentinel: Reconstruct the URL using the sanitized ID to prevent payload injection
  // This ensures that even if a malicious URL passed regex validation (unlikely),
  // we only pass the clean ID to the underlying library.
  // Sentinel: Use youtube-nocookie.com for better privacy and autoplay since lazyframe handles click
  const safeSrc = youtubeId ? `https://www.youtube-nocookie.com/embed/${youtubeId}?autoplay=1` : null;

  const [isPlaying, setIsPlaying] = React.useState(false);

  if (!youtubeId || !safeSrc) {
    return null;
  }

  useEffect(() => {
    if (!initializedRef.current && videoRef.current) {
      lazyframe(videoRef.current, {
        onAppend: (iframe: HTMLIFrameElement) => {
          // 🛡️ Sentinel: Enforce strict sandbox policies on the generated iframe
          iframe.setAttribute("sandbox", "allow-scripts allow-same-origin allow-presentation");
          // 🛡️ Sentinel: Enforce permission policies consistent with SmartImage
          iframe.setAttribute("allow", "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture");

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
                iframe.setAttribute("allow", "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture");
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handlePlay = () => {
    setIsPlaying(true);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      // Trigger click on the lazyframe element to start loading
      videoRef.current?.click();
    }
  };

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
          ref={videoRef}
          className="lazyframe"
          data-src={safeSrc}
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

export default LazyframeVideo;