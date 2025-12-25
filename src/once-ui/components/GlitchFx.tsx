"use client";

import React, { useEffect, useState, forwardRef } from "react";
import styles from "./GlitchFx.module.scss";
import { Flex } from "./Flex";
import classNames from "classnames";

interface GlitchFxProps extends React.ComponentProps<typeof Flex> {
  /** Content to apply glitch effect to. */
  children: React.ReactNode;
  /** Animation speed in milliseconds. @default "medium" */
  speed?: "slow" | "medium" | "fast";
  /** Interval between glitches in milliseconds. Only used when `trigger="custom"`. @default 2500 */
  interval?: number;
  /** Trigger method. One of: "instant" (trigger immediately), "hover" (trigger on hover), "custom" (trigger at intervals). @default "instant" */
  trigger?: "instant" | "hover" | "custom";
  /** Whether to loop the glitch effect continuously. @default true */
  continuous?: boolean;
}

/**
 * A visual effect component that applies a digital glitch distortion to its children.
 * 
 * Supports multiple trigger modes ("instant", "hover", "custom") and animation speeds ("slow", "medium", "fast").
 * Can loop continuously or trigger on demand. Extends the Flex component and supports ref forwarding.
 * 
 * @example
 * <GlitchFx trigger="hover" speed="fast">
 *   <h1>Glitched Text</h1>
 * </GlitchFx>
 */
const GlitchFx = forwardRef<HTMLDivElement, GlitchFxProps>(
  (
    {
      children,
      speed = "medium",
      interval = 2500,
      trigger = "instant",
      continuous = true,
      ...rest
    },
    ref,
  ) => {
    const [isGlitching, setIsGlitching] = useState(continuous || trigger === "instant");

    useEffect(() => {
      if (continuous || trigger === "instant") {
        setIsGlitching(true);
      }
    }, [continuous, trigger]);

    const handleMouseEnter = () => {
      if (trigger === "hover") {
        setIsGlitching(true);
      }
    };

    const handleMouseLeave = () => {
      if (trigger === "hover") {
        setIsGlitching(false);
      }
    };

    useEffect(() => {
      if (trigger === "custom") {
        const triggerGlitch = () => {
          setIsGlitching(true);
          setTimeout(() => setIsGlitching(false), 500);
        };
        const glitchInterval = setInterval(triggerGlitch, interval);
        return () => clearInterval(glitchInterval);
      }
    }, [trigger, interval]);

    const speedClass = styles[speed];

    return (
      <Flex
        ref={ref}
        position="relative"
        inline
        zIndex={0}
        className={classNames(speedClass, isGlitching && styles.active)}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        {...rest}
      >
        <Flex fillWidth inline position="relative" zIndex={1}>
          {children}
        </Flex>

        <Flex
          inline
          position="absolute"
          top="0"
          left="0"
          fill
          zIndex={0}
          opacity={50}
          className={classNames(styles.glitchLayer, styles.blueShift)}
        >
          {children}
        </Flex>

        <Flex
          inline
          position="absolute"
          top="0"
          left="0"
          fill
          zIndex={0}
          opacity={50}
          className={classNames(styles.glitchLayer, styles.redShift)}
        >
          {children}
        </Flex>
      </Flex>
    );
  },
);

GlitchFx.displayName = "GlitchFx";
export { GlitchFx };
