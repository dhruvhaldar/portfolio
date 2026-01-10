"use client";

import React, { CSSProperties, forwardRef, useEffect, useRef, memo, useMemo } from "react";
import { SpacingToken } from "../types";
import { Flex } from "./Flex";
import { DisplayProps } from "../interfaces";
import styles from "./Background.module.scss";
import classNames from "classnames";

function setRef<T>(ref: React.Ref<T> | undefined, value: T | null) {
  if (typeof ref === "function") {
    ref(value);
  } else if (ref && "current" in ref) {
    (ref as React.MutableRefObject<T | null>).current = value;
  }
}

interface MaskProps {
  /** Whether the mask follows the cursor */
  cursor?: boolean;
  /** Horizontal position percentage (0-100) */
  x?: number;
  /** Vertical position percentage (0-100) */
  y?: number;
  /** Radius of the mask */
  radius?: number;
}

interface GradientProps {
  /** Whether to display the gradient */
  display?: boolean;
  /** Opacity of the gradient */
  opacity?: DisplayProps["opacity"];
  /** Horizontal position percentage */
  x?: number;
  /** Vertical position percentage */
  y?: number;
  /** Width percentage */
  width?: number;
  /** Height percentage */
  height?: number;
  /** Tilt angle in degrees */
  tilt?: number;
  /** Start color token */
  colorStart?: string;
  /** End color token */
  colorEnd?: string;
}

interface DotsProps {
  /** Whether to display the dots pattern */
  display?: boolean;
  /** Opacity of the dots */
  opacity?: DisplayProps["opacity"];
  /** Color token for the dots */
  color?: string;
  /** Size token for the dots */
  size?: SpacingToken;
}

interface GridProps {
  /** Whether to display the grid pattern */
  display?: boolean;
  /** Opacity of the grid */
  opacity?: DisplayProps["opacity"];
  /** Color token for the grid lines */
  color?: string;
  /** Width of grid cells */
  width?: string;
  /** Height of grid cells */
  height?: string;
}

interface LinesProps {
  /** Whether to display the lines pattern */
  display?: boolean;
  /** Opacity of the lines */
  opacity?: DisplayProps["opacity"];
  /** Size token for the spacing between lines */
  size?: SpacingToken;
}

interface BackgroundProps extends React.ComponentProps<typeof Flex> {
  /** Positioning strategy */
  position?: CSSProperties["position"];
  /** Gradient effect configuration */
  gradient?: GradientProps;
  /** Dots pattern configuration */
  dots?: DotsProps;
  /** Grid pattern configuration */
  grid?: GridProps;
  /** Lines pattern configuration */
  lines?: LinesProps;
  /** Mask configuration */
  mask?: MaskProps;
  /** Custom class name */
  className?: string;
  /** Custom styles */
  style?: React.CSSProperties;
  /** Content children */
  children?: React.ReactNode;
}

/**
 * A versatile background component supporting gradients, patterns (dots, grid, lines), and masking.
 */
const BackgroundComponent = forwardRef<HTMLDivElement, BackgroundProps>(
  (
    {
      position = "fixed",
      gradient = {},
      dots = {},
      grid = {},
      lines = {},
      mask = {},
      children,
      className,
      style,
      ...rest
    },
    forwardedRef,
  ) => {
    const dotsColor = dots.color ?? "brand-on-background-weak";
    const dotsSize = "var(--static-space-" + (dots.size ?? "24") + ")";

    const cursorRef = useRef({ x: 0, y: 0 });
    const smoothRef = useRef({ x: 0, y: 0 });
    const backgroundRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
      setRef(forwardedRef, backgroundRef.current);
    }, [forwardedRef]);

    useEffect(() => {
      if (!mask.cursor) return;

      const element = backgroundRef.current;
      if (!element) return;

      let requestRef: number;
      // Cache the rect to avoid reflows on every mouse move
      let rect = element.getBoundingClientRect();

      const updateRect = () => {
        if (element) {
          rect = element.getBoundingClientRect();
        }
      };

      const handleMouseMove = (event: MouseEvent) => {
        cursorRef.current = {
          x: event.clientX - rect.left,
          y: event.clientY - rect.top,
        };
      };

      const updateLoop = () => {
        const cursor = cursorRef.current;
        const smooth = smoothRef.current;

        const dx = cursor.x - smooth.x;
        const dy = cursor.y - smooth.y;
        const easingFactor = 0.05;

        // Apply smoothing
        smooth.x += dx * easingFactor;
        smooth.y += dy * easingFactor;

        // Direct DOM manipulation to avoid React re-renders
        if (element) {
          element.style.setProperty("--mask-position-x", `${Math.round(smooth.x)}px`);
          element.style.setProperty("--mask-position-y", `${Math.round(smooth.y)}px`);
        }

        requestRef = requestAnimationFrame(updateLoop);
      };

      window.addEventListener("resize", updateRect);
      window.addEventListener("scroll", updateRect);
      document.addEventListener("mousemove", handleMouseMove);

      requestRef = requestAnimationFrame(updateLoop);

      return () => {
        window.removeEventListener("resize", updateRect);
        window.removeEventListener("scroll", updateRect);
        document.removeEventListener("mousemove", handleMouseMove);
        if (requestRef) cancelAnimationFrame(requestRef);
      };
    }, [mask.cursor]);

    const maskStyle: CSSProperties = useMemo(() => {
      if (!mask) return {};

      // Basic mask properties
      const baseStyle: CSSProperties = {
        "--mask-radius": `${mask.radius || 50}vh`,
      } as CSSProperties;

      if (mask.cursor) {
        // Position handled by effect
        return baseStyle;
      }

      if (mask.x != null && mask.y != null) {
        return {
          ...baseStyle,
          "--mask-position-x": `${mask.x}%`,
          "--mask-position-y": `${mask.y}%`,
        } as CSSProperties;
      }

      return {};
    }, [mask]);

    const remap = (
      value: number,
      inputMin: number,
      inputMax: number,
      outputMin: number,
      outputMax: number,
    ) => {
      return ((value - inputMin) / (inputMax - inputMin)) * (outputMax - outputMin) + outputMin;
    };

    const adjustedX = gradient.x != null ? remap(gradient.x, 0, 100, 37.5, 62.5) : 50;
    const adjustedY = gradient.y != null ? remap(gradient.y, 0, 100, 37.5, 62.5) : 50;

    return (
      <Flex
        ref={backgroundRef}
        fill
        position={position}
        className={classNames(mask && styles.mask, className)}
        top="0"
        left="0"
        zIndex={0}
        overflow="hidden"
        style={{
          position,
          top: 0,
          left: 0,
          zIndex: 0,
          ...maskStyle,
          ...style,
        }}
        {...rest}
      >
        {gradient.display && (
          <Flex
            position="absolute"
            className={styles.gradient}
            opacity={gradient.opacity}
            pointerEvents="none"
            style={{
              ["--gradient-position-x" as string]: `${adjustedX}%`,
              ["--gradient-position-y" as string]: `${adjustedY}%`,
              ["--gradient-width" as string]:
                gradient.width != null ? `${gradient.width / 4}%` : "25%",
              ["--gradient-height" as string]:
                gradient.height != null ? `${gradient.height / 4}%` : "25%",
              ["--gradient-tilt" as string]: gradient.tilt != null ? `${gradient.tilt}deg` : "0deg",
              ["--gradient-color-start" as string]: gradient.colorStart
                ? `var(--${gradient.colorStart})`
                : "var(--brand-solid-strong)",
              ["--gradient-color-end" as string]: gradient.colorEnd
                ? `var(--${gradient.colorEnd})`
                : "var(--brand-solid-weak)",
            }}
          />
        )}
        {dots.display && (
          <Flex
            position="absolute"
            top="0"
            left="0"
            fill
            pointerEvents="none"
            className={styles.dots}
            opacity={dots.opacity}
            style={
              {
                "--dots-color": `var(--${dotsColor})`,
                "--dots-size": dotsSize,
              } as React.CSSProperties
            }
          />
        )}
        {lines.display && (
          <Flex
            position="absolute"
            top="0"
            left="0"
            fill
            pointerEvents="none"
            className={styles.lines}
            opacity={lines.opacity}
            style={{
              backgroundImage: `repeating-linear-gradient(45deg, var(--brand-on-background-weak) 0, var(--brand-on-background-weak) 0.5px, var(--static-transparent) 0.5px, var(--static-transparent) var(--static-space-${lines.size ?? "24"}))`,
            }}
          />
        )}
        {grid.display && (
          <Flex
            position="absolute"
            top="0"
            left="0"
            fill
            pointerEvents="none"
            className={styles.grid}
            opacity={grid.opacity}
            style={{
              backgroundSize: `
                ${grid.width || "var(--static-space-32)"}
                ${grid.height || "var(--static-space-32)"}`,
              backgroundPosition: "0 0",
              backgroundImage: `
                linear-gradient(
                  90deg,
                  var(--${grid.color || "brand-on-background-weak"}) 0,
                  var(--${grid.color || "brand-on-background-weak"}) 1px,
                  var(--static-transparent) 1px,
                  var(--static-transparent) ${grid.width || "var(--static-space-32)"}
                ),
                linear-gradient(
                  0deg,
                  var(--${grid.color || "brand-on-background-weak"}) 0,
                  var(--${grid.color || "brand-on-background-weak"}) 1px,
                  var(--static-transparent) 1px,
                  var(--static-transparent) ${grid.height || "var(--static-space-32)"}
                )
              `,
            }}
          />
        )}
        {children}
      </Flex>
    );
  },
);

const Background = memo(BackgroundComponent);
Background.displayName = "Background";

export { Background };
