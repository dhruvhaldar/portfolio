"use client";

import classNames from "classnames";
import type React from "react";
import { forwardRef, memo } from "react";
import { Flex } from "./Flex";
import styles from "./StatusIndicator.module.scss";

interface StatusIndicatorProps extends React.ComponentProps<typeof Flex> {
  /** Size of the indicator */
  size: "s" | "m" | "l";
  /** Color theme */
  color:
    | "blue"
    | "indigo"
    | "violet"
    | "magenta"
    | "pink"
    | "red"
    | "orange"
    | "yellow"
    | "moss"
    | "green"
    | "emerald"
    | "aqua"
    | "cyan"
    | "gray";
  /** Aria label for accessibility */
  ariaLabel?: string;
  /** Custom class name */
  className?: string;
  /** Custom styles */
  style?: React.CSSProperties;
}

/**
 * A colored dot indicator for status representation.
 */
const StatusIndicatorComponent = forwardRef<HTMLDivElement, StatusIndicatorProps>(
  ({ size, color, ariaLabel = `${color} status indicator`, className, style, ...rest }, ref) => {
    return (
      <Flex
        ref={ref}
        style={style}
        className={classNames(styles.statusIndicator, styles[size], styles[color], className)}
        aria-label={ariaLabel}
        radius="full"
        {...rest}
      />
    );
  },
);

StatusIndicatorComponent.displayName = "StatusIndicator";

const StatusIndicator = memo(StatusIndicatorComponent);
StatusIndicator.displayName = "StatusIndicator";

export { StatusIndicator };
