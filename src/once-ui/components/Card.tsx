"use client";

import type React from "react";
import { forwardRef } from "react";
import { Flex } from ".";
import styles from "./Card.module.scss";

interface CardProps extends React.ComponentProps<typeof Flex> {
  /** Card content */
  children?: React.ReactNode;
}

/**
 * A basic card component providing a container with surface background and styling.
 */
const Card = forwardRef<HTMLDivElement, CardProps>(
  ({ children, style, className, ...rest }, ref) => {
    return (
      <Flex
        ref={ref}
        background="surface"
        transition="macro-medium"
        border="neutral-medium"
        cursor="interactive"
        className={styles.card}
        {...rest}
      >
        {children}
      </Flex>
    );
  },
);

Card.displayName = "Card";
export { Card };
