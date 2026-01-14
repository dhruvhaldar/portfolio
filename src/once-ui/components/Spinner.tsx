import type React from "react";
import { forwardRef } from "react";

import { Flex } from "./Flex";
import styles from "./Spinner.module.scss";

interface SpinnerProps extends React.ComponentProps<typeof Flex> {
  /**
   * Size of the spinner
   * @default "m"
   */
  size?: "xs" | "s" | "m" | "l" | "xl";
  /**
   * Accessible label for screen readers
   * @default "Loading"
   */
  ariaLabel?: string;
}

/**
 * A loading spinner component with customizable size and styling.
 * Displays an animated circular spinner to indicate loading state.
 *
 * @example
 * <Spinner size="l" ariaLabel="Loading content" />
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
