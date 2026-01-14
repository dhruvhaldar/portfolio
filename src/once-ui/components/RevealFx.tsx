"use client";

import type React from "react";
import { forwardRef, useEffect, useState } from "react";
import { Flex } from ".";
import type { SpacingToken } from "../types";
import styles from "./RevealFx.module.scss";

interface RevealFxProps extends React.ComponentProps<typeof Flex> {
  /** Content to reveal */
  children: React.ReactNode;
  /** Animation speed */
  speed?: "slow" | "medium" | "fast";
  /** Delay before reveal */
  delay?: number;
  /** Whether content is initially revealed */
  revealedByDefault?: boolean;
  /** Vertical translation distance */
  translateY?: number | SpacingToken;
  /** Trigger state */
  trigger?: boolean;
  /** Custom styles */
  style?: React.CSSProperties;
  /** Custom class name */
  className?: string;
}

/**
 * A component that reveals its content with a fade/slide animation.
 */
const RevealFx = forwardRef<HTMLDivElement, RevealFxProps>(
  (
    {
      children,
      speed = "medium",
      delay = 0,
      revealedByDefault = false,
      translateY,
      trigger,
      style,
      className,
      ...rest
    },
    ref,
  ) => {
    const [isRevealed, setIsRevealed] = useState(revealedByDefault);

    useEffect(() => {
      const timer = setTimeout(() => {
        setIsRevealed(true);
      }, delay * 1000);

      return () => clearTimeout(timer);
    }, [delay]);

    useEffect(() => {
      if (trigger !== undefined) {
        setIsRevealed(trigger);
      }
    }, [trigger]);

    const getSpeedDuration = () => {
      switch (speed) {
        case "fast":
          return "1s";
        case "medium":
          return "2s";
        case "slow":
          return "3s";
        default:
          return "2s";
      }
    };

    const getTranslateYValue = () => {
      if (typeof translateY === "number") {
        return `${translateY}rem`;
      } else if (typeof translateY === "string") {
        return `var(--static-space-${translateY})`;
      }
      return undefined;
    };

    const translateValue = getTranslateYValue();

    const revealStyle: React.CSSProperties = {
      transitionDuration: getSpeedDuration(),
      transform: isRevealed
        ? "translateY(0)"
        : translateValue
          ? `translateY(${translateValue})`
          : "translateY(0)",
      ...style,
    };

    return (
      <Flex
        fillWidth
        position="relative"
        horizontal="center"
        ref={ref}
        style={revealStyle}
        className={`${styles.revealFx} ${isRevealed ? styles.revealed : styles.hidden} ${className || ""}`}
        {...rest}
      >
        {children}
      </Flex>
    );
  },
);

RevealFx.displayName = "RevealFx";
export { RevealFx };
