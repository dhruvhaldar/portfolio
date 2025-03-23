"use client"; // Add this line

import React, { useEffect } from 'react';
import lazyframe from 'lazyframe';

interface LazyframeVideoProps {
  src: string;
  title?: string;
  width?: string;
  height?: string;
  lazyload?: true;
}

const LazyframeVideo: React.FC<LazyframeVideoProps> = ({
  src,
  title = "Video player",
  width = "100%",
  height = "500px",
}) => {
  useEffect(() => {
    lazyframe('.lazyframe');
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