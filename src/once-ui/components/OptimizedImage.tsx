"use client";

import React, { useState } from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";

interface OptimizedImageProps {
  src: string;
  alt: string;
  width: number;
  height: number;
  priority?: boolean;
  className?: string;
  fill?: boolean;
  blurDataURL?: string;
}

const OptimizedImage: React.FC<OptimizedImageProps> = ({
  src,
  alt,
  width,
  height,
  priority = false,
  className,
  fill = false,
  blurDataURL,
}) => {
  const [isLoading, setIsLoading] = useState(true);
  
  // Convert JPEG/PNG to AVIF if not already
  const avifSrc = src.replace(/\.(jpg|jpeg|png)$/, ".avif");
  
  return (
    <div className={cn("relative overflow-hidden", className)}>
      {/* Blur placeholder */}
      {blurDataURL && (
        <div
          className={cn(
            "absolute inset-0 transition-opacity duration-300",
            isLoading ? "opacity-100" : "opacity-0"
          )}
          style={{
            backgroundImage: `url(${blurDataURL})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            filter: "blur(20px)",
          }}
        />
      )}
      
      {/* Loading spinner */}
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-neutral-100 dark:bg-neutral-800">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-neutral-300 border-t-neutral-600 dark:border-neutral-600 dark:border-t-neutral-300" />
        </div>
      )}

      <Image
        src={avifSrc}
        alt={alt}
        width={fill ? undefined : width}
        height={fill ? undefined : height}
        priority={priority}
        fill={fill}
        sizes={fill ? "100vw" : `${width}px`}
        quality={90}
        loading={priority ? "eager" : "lazy"}
        onLoadingComplete={() => setIsLoading(false)}
        className={cn(
          "object-cover transition-opacity duration-300",
          isLoading ? "opacity-0" : "opacity-100",
          fill && "absolute inset-0"
        )}
      />
    </div>
  );
};

export { OptimizedImage }; 