"use client"; // Add this line

import React, { useEffect } from 'react';
import lazyframe from 'lazyframe';
import 'lazyframe/dist/lazyframe.css';

import { Flex, Skeleton, Text, Icon } from "@/once-ui/components";

interface LazyframeVideoProps {
  /** The source URL of the video (e.g., YouTube URL) */
  src: string;
  /** The title of the video frame */
  title?: string;
  /** Width of the video container */
  width?: string;
  /** Height of the video container */
  height?: string;
}

// Video title overlay gradient
const overlayBackground = "linear-gradient(to bottom, rgba(0,0,0,0.6) 0%, rgba(0,0,0,0) 100%)";

// Helper to extract YouTube ID
const getYouTubeId = (url: string) => {
  // Regex from lazyframe/src/lazyframe.js for robust matching
  const regex = /(?:youtube\.com\/\S*(?:(?:\/e(?:mbed))?\/|watch\?(?:\S*?&?v\=))|youtu\.be\/)([a-zA-Z0-9_-]{6,11})/;
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
}) => {
  const videoRef = React.useRef<HTMLDivElement>(null);
  const initializedRef = React.useRef(false);

  const youtubeId = getYouTubeId(src);
  const thumbnailUrl = youtubeId ? `https://i.ytimg.com/vi/${youtubeId}/hqdefault.jpg` : undefined;

  const [isLoading, setIsLoading] = React.useState(true);
  const [isPlaying, setIsPlaying] = React.useState(false);

  useEffect(() => {
    let isMounted = true;

    if (thumbnailUrl) {
      const img = new Image();
      img.src = thumbnailUrl;

      const handleLoad = () => {
        if (isMounted) setIsLoading(false);
      };

      const handleError = () => {
        // Fallback to showing the frame even if thumbnail fails
        if (isMounted) setIsLoading(false);
      };

      img.onload = handleLoad;
      img.onerror = handleError;
    } else {
      setIsLoading(false);
    }

    return () => {
      isMounted = false;
    };
  }, [thumbnailUrl]);

  useEffect(() => {
    if (!initializedRef.current && videoRef.current) {
      lazyframe(videoRef.current);
      initializedRef.current = true;
    }
  }, []);

  const handlePlay = () => {
    setIsPlaying(true);
  };

  return (
    <Flex
      fillWidth
      radius="l"
      padding="s"
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
        onClickCapture={handlePlay}
        style={{
          isolation: "isolate"
        }}
      >
        {isLoading && (
          <Skeleton
            shape="block"
            fillWidth
            style={{
              height: height === "auto" ? "auto" : height,
              aspectRatio: "16/9"
            }}
          />
        )}
        <div
          ref={videoRef}
          className="lazyframe"
          data-src={src}
          data-vendor="youtube"
          data-thumbnail={thumbnailUrl}
          style={{
            width,
            height,
            aspectRatio: '16/9',
            objectFit: 'cover',
            display: isLoading ? 'none' : 'block'
          }}
        ></div>
        {!isPlaying && !isLoading && (
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
                  onBackground="neutral-strong"
                  style={{
                    textShadow: "0 1px 2px rgba(0,0,0,0.5)"
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
              padding="m"
              style={{
                pointerEvents: "none",
                zIndex: 2
              }}
            >
              <Icon
                name="youtube"
                size="l"
                onSolid="brand-strong"
                style={{
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