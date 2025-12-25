"use client";import React, { CSSProperties, useState, useRef, useEffect } from "react";import Image from "next/image";import { Flex, Skeleton } from "@/once-ui/components";

export interface SmartImageProps extends React.ComponentProps<typeof Flex> {
  aspectRatio?: string;
  height?: number;
  alt?: string;
  isLoading?: boolean;
  objectFit?: CSSProperties["objectFit"];
  enlarge?: boolean;
  src: string;
  unoptimized?: boolean;
  sizes?: string;
  priority?: boolean;
  preload?: boolean;
  loading?: "lazy" | "eager";
  responsive?: {
    mobile?: string;
    tablet?: string;
    desktop?: string;
  };
}

const SmartImage: React.FC<SmartImageProps> = ({
  aspectRatio,
  height,
  alt = "",
  isLoading = false,
  objectFit = "cover",
  enlarge = false,
  src,
  unoptimized = true,
  priority,
  preload,
  loading = "lazy", 
  responsive,
  sizes = responsive 
    ? `
      (max-width: 640px) ${responsive.mobile || '100vw'}, 
      (max-width: 1024px) ${responsive.tablet || '50vw'}, 
      ${responsive.desktop || '33vw'}
    `
    : "(max-width: 1200px) 100vw, 33vw",
  ...rest
}) => {
  // Use preload if provided, otherwise fall back to priority for backward compatibility
  const shouldPreload = preload !== undefined ? preload : priority;
  const calculateHeight = () => {
    if (height) return typeof height === 'number' ? `${height}rem` : height;
    if (responsive?.mobile) return responsive.mobile;
    if (aspectRatio) return 'auto';
    return '100%';
  };

  const [isEnlarged, setIsEnlarged] = useState(false);
  const imageRef = useRef<HTMLDivElement>(null);

  const handleClick = () => {
    if (enlarge) {
      setIsEnlarged(!isEnlarged);
    }
  };

  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (enlarge && (event.key === "Enter" || event.key === " ")) {
      event.preventDefault();
      handleClick();
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

  const calculateTransform = () => {
    if (!imageRef.current) return {};

    const rect = imageRef.current.getBoundingClientRect();
    const scaleX = window.innerWidth / rect.width;
    const scaleY = window.innerHeight / rect.height;
    const scale = Math.min(scaleX, scaleY) * 0.9;

    const translateX = (window.innerWidth - rect.width) / 2 - rect.left;
    const translateY = (window.innerHeight - rect.height) / 2 - rect.top;

    return {
      transform: isEnlarged
        ? `translate(${translateX}px, ${translateY}px) scale(${scale})`
        : "translate(0, 0) scale(1)",
      transition: "all 0.3s ease-in-out",
      zIndex: isEnlarged ? 2 : undefined,
    };
  };

  const isYouTubeVideo = (url: string) => {
    const youtubeRegex =
      /(?:youtube\.com\/(?:[^\/\n\s]+\/\S+\/|(?:v|e(?:mbed)?)\/|\S*?[?&]v=)|youtu\.be\/)([a-zA-Z0-9_-]{11})/;
    return youtubeRegex.test(url);
  };

  const getYouTubeEmbedUrl = (url: string) => {
    const match = url.match(
      /(?:youtube\.com\/(?:[^\/\n\s]+\/\S+\/|(?:v|e(?:mbed)?)\/|\S*?[?&]v=)|youtu\.be\/)([a-zA-Z0-9_-]{11})/,
    );
    return match
      ? `https://www.youtube.com/embed/${match[1]}?controls=0&rel=0&modestbranding=1`
      : "";
  };

  const isVideo = src?.endsWith(".mp4");const isYouTube = isYouTubeVideo(src);
  const [isLoaded, setIsLoaded] = useState(false);

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
          isolation: "isolate",
          height: calculateHeight(),
          aspectRatio: aspectRatio,
          borderRadius: isEnlarged ? "0" : undefined,
          ...calculateTransform(),
        }}
        onClick={handleClick}
        onKeyDown={handleKeyDown}
        role={enlarge ? "button" : undefined}
        tabIndex={enlarge ? 0 : undefined}
        aria-label={enlarge ? (isEnlarged ? "Zoom out" : "Zoom in") : undefined}
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
            sizes={sizes}
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
    </>);};SmartImage.displayName = "SmartImage";export { SmartImage };
