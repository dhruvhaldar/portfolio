"use client"; // Add this line

import React, { useEffect } from 'react';
import lazyframe from 'lazyframe';
import 'lazyframe/dist/lazyframe.css';

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

// Helper to extract YouTube ID
const getYouTubeId = (url: string) => {
  // 🛡️ Sentinel: Strictly validate the URL starts with expected domains
  // Allow subdomains like www, m, music, etc.
  const regex = /^(?:https?:\/\/)?(?:[a-zA-Z0-9-]+\.)?(?:youtube\.com\/\S*(?:(?:\/e(?:mbed))?\/|watch\?(?:\S*?&?v\=))|youtu\.be\/)([a-zA-Z0-9_-]{6,11})/;
  const match = url.match(regex);
  return match ? match[1] : null;
};

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

  const youtubeId = getYouTubeId(src);
  const defaultThumbnailUrl = youtubeId ? `https://i.ytimg.com/vi/${youtubeId}/hqdefault.jpg` : undefined;
  const activeThumbnailUrl = thumbnail || defaultThumbnailUrl;

  const [isPlaying, setIsPlaying] = React.useState(false);

  if (!youtubeId) {
    return null;
  }

  // 🛡️ Sentinel: Reconstruct the URL to ensure it's a clean, canonical YouTube URL.
  // This prevents query parameter injection or other URL manipulation attacks
  // that might bypass the regex check but confuse the lazyframe library.
  const cleanSrc = `https://www.youtube.com/watch?v=${youtubeId}`;

  useEffect(() => {
    if (!initializedRef.current && videoRef.current) {
      lazyframe(videoRef.current);
      initializedRef.current = true;
    }
  }, []);

  const handlePlay = () => {
    setIsPlaying(true);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      handlePlay();
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
          data-src={cleanSrc}
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

export default LazyframeVideo;
