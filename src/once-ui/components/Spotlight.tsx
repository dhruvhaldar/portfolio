"use client";

import classNames from "classnames";
import type React from "react";
import { useEffect, useRef } from "react";
import styles from "./Spotlight.module.scss";

interface SpotlightProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  /**
   * Color of the spotlight effect. Defaults to rgba(255, 255, 255, 0.1).
   */
  color?: string;
  /**
   * Size of the spotlight effect in pixels. Defaults to 400.
   */
  size?: number;
}

/**
 * A container component that adds a "spotlight" radial gradient effect that follows the mouse cursor.
 * The effect is applied using CSS variables `--spotlight-x` and `--spotlight-y`.
 */
export const Spotlight: React.FC<SpotlightProps> = ({
  children,
  className,
  color,
  size,
  style,
  ...rest
}) => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    let requestId = 0;
    let mouseX = 0;
    let mouseY = 0;
    const cachedRect = { left: 0, top: 0 };

    const updateRect = () => {
      const rect = container.getBoundingClientRect();
      cachedRect.left = rect.left + window.scrollX;
      cachedRect.top = rect.top + window.scrollY;
    };

    const updateSpotlight = () => {
      const x = mouseX - cachedRect.left;
      const y = mouseY - cachedRect.top;

      container.style.setProperty("--spotlight-x", `${x}px`);
      container.style.setProperty("--spotlight-y", `${y}px`);

      requestId = 0;
    };

    const handleMouseMove = (e: MouseEvent) => {
      mouseX = e.pageX;
      mouseY = e.pageY;

      if (!requestId) {
        requestId = requestAnimationFrame(updateSpotlight);
      }
    };

    // Initialize cache
    updateRect();

    const onMouseEnter = () => {
      updateRect();
      container.addEventListener("mousemove", handleMouseMove);
      window.addEventListener("resize", updateRect);
    };

    const onMouseLeave = () => {
      container.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("resize", updateRect);
    };

    container.addEventListener("mouseenter", onMouseEnter);
    container.addEventListener("mouseleave", onMouseLeave);

    if (container.matches(":hover")) {
      onMouseEnter();
    }

    return () => {
      container.removeEventListener("mouseenter", onMouseEnter);
      container.removeEventListener("mouseleave", onMouseLeave);
      container.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("resize", updateRect);
      cancelAnimationFrame(requestId);
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className={classNames(styles.spotlight, className)}
      style={
        {
          ...style,
          ...(color && { "--spotlight-color": color }),
          ...(size && { "--spotlight-size": `${size}px` }),
        } as React.CSSProperties
      }
      {...rest}
    >
      {children}
    </div>
  );
};
