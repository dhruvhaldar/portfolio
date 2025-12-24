"use client";

import React, { useRef, useEffect } from "react";
import styles from "./Spotlight.module.scss";
import classNames from "classnames";

interface SpotlightProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  color?: string;
  size?: number;
}

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

    let requestId: number = 0;

    const handleMouseMove = (e: MouseEvent) => {
      cancelAnimationFrame(requestId);

      requestId = requestAnimationFrame(() => {
        const rect = container.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        container.style.setProperty("--spotlight-x", `${x}px`);
        container.style.setProperty("--spotlight-y", `${y}px`);
      });
    };

    container.addEventListener("mousemove", handleMouseMove);
    return () => {
      container.removeEventListener("mousemove", handleMouseMove);
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
