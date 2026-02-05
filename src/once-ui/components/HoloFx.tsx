"use client";

import React, { useEffect, useRef, forwardRef, memo, useMemo } from "react";
import styles from "./HoloFx.module.scss";
import { Flex } from ".";
import { CSSProperties } from "react";
import classNames from "classnames";

interface MaskOptions {
  maskPosition?: string;
}

interface HoloFxProps extends React.ComponentProps<typeof Flex> {
  /** Content to apply holographic effect to */
  children: React.ReactNode;
  /** Light layer configuration */
  light?: {
    opacity?: number;
    filter?: string;
    blending?: CSSProperties["mixBlendMode"];
    mask?: MaskOptions;
  };
  /** Burn/Shadow layer configuration */
  burn?: {
    opacity?: number;
    filter?: string;
    blending?: CSSProperties["mixBlendMode"];
    mask?: MaskOptions;
  };
  /** Texture layer configuration */
  texture?: {
    opacity?: number;
    filter?: string;
    blending?: CSSProperties["mixBlendMode"];
    image?: string;
    mask?: MaskOptions;
  };
}

const formatMask = (maskPosition: string = "100 200"): string => {
  const [x, y] = maskPosition.split(" ");
  const formattedX = `${x}%`;
  const formattedY = `${y ? y : x}%`;
  return `radial-gradient(ellipse ${formattedX} ${formattedY} at var(--gradient-pos-x, 50%) var(--gradient-pos-y, 50%), black 50%, transparent 100%)`;
};

const getMaskStyle = (mask?: MaskOptions): string => {
  return mask?.maskPosition ? formatMask(mask.maskPosition) : formatMask();
};

function setRef<T>(ref: React.Ref<T> | undefined, value: T | null) {
  if (typeof ref === "function") {
    ref(value);
  } else if (ref && "current" in ref) {
    (ref as React.MutableRefObject<T | null>).current = value;
  }
}

/**
 * A holographic visual effect component.
 * Simulates light interaction and texture.
 */
const HoloFxComponent = forwardRef<HTMLDivElement, HoloFxProps>(
  ({ children, light, burn, texture, ...rest }, ref) => {
    const internalRef = useRef<HTMLDivElement>(null);
    // Bolt: Track visibility to enable/disable listeners
    const isVisible = useRef(false);
    // Bolt: Cache rect to prevent layout thrashing
    const rectRef = useRef<DOMRect | null>(null);
    // Bolt: Track raf ID to cancel animation
    const rafRef = useRef<number | null>(null);
    // Bolt: Track mouse position
    const mouseRef = useRef({ x: 0, y: 0 });

    useEffect(() => {
      setRef(ref, internalRef.current);
    }, [ref]);

    // Bolt: Memoize defaults to prevent unnecessary object creation
    const lightDefaults = useMemo(
      () => ({
        opacity: 30,
        blending: "color-dodge" as CSSProperties["mixBlendMode"],
        mask: getMaskStyle(light?.mask),
        ...light,
      }),
      [light],
    );

    const burnDefaults = useMemo(
      () => ({
        opacity: 30,
        filter: "brightness(0.2) contrast(2)",
        blending: "color-dodge" as CSSProperties["mixBlendMode"],
        mask: getMaskStyle(burn?.mask),
        ...burn,
      }),
      [burn],
    );

    const textureDefaults = useMemo(
      () => ({
        opacity: 10,
        blending: "color-dodge" as CSSProperties["mixBlendMode"],
        image:
          "repeating-linear-gradient(-45deg, var(--static-white) 0, var(--static-white) 1px, transparent 3px, transparent 2px)",
        mask: getMaskStyle(texture?.mask),
        ...texture,
      }),
      [texture],
    );

    useEffect(() => {
      const element = internalRef.current;
      if (!element) return;

      const updateRect = () => {
        if (element) {
          rectRef.current = element.getBoundingClientRect();
        }
      };

      const updateStyle = () => {
        if (!rectRef.current || !element) {
          rafRef.current = null;
          return;
        }

        const rect = rectRef.current;
        const { x, y } = mouseRef.current;

        const offsetX = x - rect.left;
        const offsetY = y - rect.top;

        const centerX = rect.width / 2;
        const centerY = rect.height / 2;

        if (centerX === 0 || centerY === 0) {
          rafRef.current = null;
          return;
        }

        const deltaX = ((offsetX - centerX) / centerX) * 100;
        const deltaY = ((offsetY - centerY) / centerY) * 100;

        element.style.setProperty("--gradient-pos-x", `${deltaX}%`);
        element.style.setProperty("--gradient-pos-y", `${deltaY}%`);

        rafRef.current = null;
      };

      const handleMouseMove = (event: MouseEvent) => {
        if (!isVisible.current) return;
        mouseRef.current.x = event.clientX;
        mouseRef.current.y = event.clientY;

        if (!rafRef.current) {
          rafRef.current = requestAnimationFrame(updateStyle);
        }
      };

      // Bolt: Use IntersectionObserver to only attach listeners when visible
      // This solves the N listeners problem when many HoloFx components are present
      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            isVisible.current = entry.isIntersecting;
            if (entry.isIntersecting) {
              updateRect();
              document.addEventListener("mousemove", handleMouseMove);
              // Bolt: Update rect on scroll/resize to ensure correct positioning
              // Capture phase ensures we catch scroll events from any parent
              window.addEventListener("scroll", updateRect, { capture: true, passive: true });
              window.addEventListener("resize", updateRect, { passive: true });
            } else {
              document.removeEventListener("mousemove", handleMouseMove);
              window.removeEventListener("scroll", updateRect, { capture: true });
              window.removeEventListener("resize", updateRect);
              if (rafRef.current) {
                cancelAnimationFrame(rafRef.current);
                rafRef.current = null;
              }
            }
          });
        },
        { threshold: 0 },
      );

      observer.observe(element);

      return () => {
        observer.disconnect();
        document.removeEventListener("mousemove", handleMouseMove);
        window.removeEventListener("scroll", updateRect, { capture: true });
        window.removeEventListener("resize", updateRect);
        if (rafRef.current) {
          cancelAnimationFrame(rafRef.current);
        }
      };
    }, []);

    return (
      <Flex
        position="relative"
        overflow="hidden"
        className={styles.holoFx}
        ref={internalRef}
        {...rest}
      >
        <Flex fill className={styles.base}>
          {children}
        </Flex>
        <Flex
          hide="m"
          position="absolute"
          fill
          pointerEvents="none"
          className={classNames(styles.overlay, styles.burn)}
          style={{
            ["--burn-opacity" as any]: burnDefaults.opacity + "%",
            filter: burnDefaults.filter,
            mixBlendMode: burnDefaults.blending,
            maskImage: burnDefaults.mask as string,
          }}
        >
          {children}
        </Flex>
        <Flex
          hide="m"
          position="absolute"
          fill
          pointerEvents="none"
          className={classNames(styles.overlay, styles.light)}
          style={{
            ["--light-opacity" as any]: lightDefaults.opacity + "%",
            filter: lightDefaults.filter,
            mixBlendMode: lightDefaults.blending,
            maskImage: lightDefaults.mask as string,
          }}
        >
          {children}
        </Flex>
        <Flex
          hide="m"
          position="absolute"
          fill
          pointerEvents="none"
          className={classNames(styles.overlay, styles.texture)}
          style={{
            ["--texture-opacity" as any]: textureDefaults.opacity + "%",
            backgroundImage: textureDefaults.image,
            filter: textureDefaults.filter,
            mixBlendMode: textureDefaults.blending,
            maskImage: textureDefaults.mask as string,
          }}
        ></Flex>
      </Flex>
    );
  },
);

// Bolt: Memoize the component to prevent re-renders when parent re-renders
const HoloFx = memo(HoloFxComponent);
HoloFx.displayName = "HoloFx";
export { HoloFx };
