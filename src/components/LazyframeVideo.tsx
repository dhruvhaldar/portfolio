"use client"; // Add this line

import React, { useEffect } from 'react';
import lazyframe from 'lazyframe';

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

/**
 * A video component that lazily loads video content (like YouTube) to improve performance.
 * Uses the 'lazyframe' library.
 */
const LazyframeVideo: React.FC<LazyframeVideoProps> = ({
  src,
  title = "Video player",
  width = "100%",
  height = "500px",
}) => {
  const initializedRef = React.useRef(false);
  useEffect(() => {
    if (!initializedRef.current) {
      lazyframe('.lazyframe');
      initializedRef.current = true;
    }
  }, []);

  return (
    <div
      className="lazyframe"
      data-src={src}
      data-vendor="youtube"
      title={title}
      style={{
        width,
        height,
        aspectRatio: '16/9',
        objectFit: 'cover',
      }}
    ></div>
  );
};

export default LazyframeVideo;