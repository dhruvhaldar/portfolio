"use client";

import React, { forwardRef } from "react";
import classNames from "classnames";

import styles from "./Skeleton.module.scss";
import { Flex } from "./Flex";

interface SkeletonProps extends React.ComponentProps<typeof Flex> {
  /** Shape of the skeleton */
  shape: "line" | "circle" | "block";
  /** Width size preset */
  width?: "xl" | "l" | "m" | "s" | "xs";
  /** Height size preset */
  height?: "xl" | "l" | "m" | "s" | "xs";
  /** Animation delay */
  delay?: "1" | "2" | "3" | "4" | "5" | "6";
  /** Custom styles */
  style?: React.CSSProperties;
  /** Custom class name */
  className?: string;
}

/**
 * A placeholder component that simulates content loading.
 */
const Skeleton: React.FC<SkeletonProps> = forwardRef<HTMLDivElement, SkeletonProps>(
  ({ shape = "line", width, height, delay, style, className, ...props }, ref) => {
    return (
      <Flex
        {...props}
        ref={ref}
        style={style}
        radius={shape === "line" || shape === "circle" ? "full" : undefined}
        inline
        className={classNames(
          styles.skeleton,
          styles[shape],
          width && styles["w-" + width],
          height && styles["h-" + height],
          delay && styles["delay-" + delay],
          className,
        )}
      />
    );
  },
);

Skeleton.displayName = "Skeleton";

export { Skeleton };
