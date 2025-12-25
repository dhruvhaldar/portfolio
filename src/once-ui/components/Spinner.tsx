import React, { forwardRef } from "react";

import styles from "./Spinner.module.scss";
import { Flex } from "./Flex";

interface SpinnerProps extends React.ComponentProps<typeof Flex> {
  /** Size of the spinner */
  size?: "xs" | "s" | "m" | "l" | "xl";
  /** Aria label for accessibility */
  ariaLabel?: string;
  /** Custom class name */
  className?: string;
  /** Custom styles */
  style?: React.CSSProperties;
}

/**
 * A loading spinner component.
 */
const Spinner = forwardRef<HTMLDivElement, SpinnerProps>(
  ({ size = "m", ariaLabel = "Loading", className, style, ...rest }, ref) => {
    return (
      <Flex horizontal="center" vertical="center" style={style} className={className} {...rest}>
        <Flex
          ref={ref}
          horizontal="center"
          vertical="center"
          className={styles[size]}
          role="status"
          aria-label={ariaLabel}
        >
          <div className={styles.spinner} />
        </Flex>
      </Flex>
    );
  },
);

Spinner.displayName = "Spinner";

export { Spinner };
