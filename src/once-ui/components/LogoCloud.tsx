"use client";

import classNames from "classnames";
import type React from "react";
import { forwardRef, useEffect, useState } from "react";
import type { ComponentProps } from "react";
import { Flex } from "./Flex";
import { Grid } from "./Grid";
import { Logo } from "./Logo";
import styles from "./LogoCloud.module.scss";

type LogoProps = ComponentProps<typeof Logo>;

interface LogoCloudProps extends React.ComponentProps<typeof Grid> {
  /** List of logos to display */
  logos: LogoProps[];
  /** Custom class name */
  className?: string;
  /** Custom styles */
  style?: React.CSSProperties;
  /** Maximum number of visible logos (displays all if total <= limit) */
  limit?: number;
  /** Rotation interval in ms */
  rotationInterval?: number;
}

const ANIMATION_DURATION = 5000;
const STAGGER_DELAY = 25;

/**
 * A component that displays a rotating grid of logos.
 */
const LogoCloud = forwardRef<HTMLDivElement, LogoCloudProps>(
  ({ logos, className, style, limit = 6, rotationInterval = ANIMATION_DURATION, ...rest }, ref) => {
    // Bolt: Use simple index logic instead of expensive array lookups
    const [startIndex, setStartIndex] = useState(0);

    useEffect(() => {
      // If we don't have enough logos to rotate, don't start the interval
      if (logos.length <= limit) {
        return;
      }

      const interval = setInterval(
        () => {
          setStartIndex((prevIndex) => (prevIndex + 1) % logos.length);
        },
        rotationInterval + STAGGER_DELAY * limit,
      );

      return () => clearInterval(interval);
    }, [logos.length, limit, rotationInterval]);

    // Calculate visible logos based on startIndex and limit
    // Bolt: This is O(limit) instead of O(limit * total)
    const visibleLogos: LogoProps[] = [];
    for (let i = 0; i < Math.min(limit, logos.length); i++) {
      const index = (startIndex + i) % logos.length;
      visibleLogos.push(logos[index]);
    }

    return (
      <Grid ref={ref} className={classNames(styles.container, className)} style={style} {...rest}>
        {visibleLogos.map((logo, index) => (
          <Flex
            // biome-ignore lint/suspicious/noArrayIndexKey: Animation requires key to change based on position
            key={`${startIndex}-${index}`}
            vertical="center"
            horizontal="center"
            paddingX="24"
            paddingY="20"
            radius="l"
          >
            <Logo
              className={styles.logo}
              style={{
                ...logo.style,
                animationDelay: `${index * STAGGER_DELAY}ms`,
              }}
              {...logo}
            />
          </Flex>
        ))}
      </Grid>
    );
  },
);

LogoCloud.displayName = "LogoCloud";
export { LogoCloud };
