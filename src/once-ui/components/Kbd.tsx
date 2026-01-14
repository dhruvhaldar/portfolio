"use client";

import type React from "react";
import { type ReactNode, forwardRef } from "react";
import { Flex, Text } from ".";

interface KbdProps extends React.ComponentProps<typeof Flex> {
  /** Label text */
  label?: string;
  /** Content children */
  children?: ReactNode;
  /** Custom class name */
  className?: string;
  /** Custom styles */
  style?: React.CSSProperties;
}

/**
 * A keyboard input visualization component.
 * Renders a key style element.
 */
const Kbd = forwardRef<HTMLDivElement, KbdProps>(
  ({ label, children, className, style, ...rest }, ref) => (
    <Flex
      as="kbd"
      ref={ref}
      horizontal="center"
      minWidth="32"
      background="neutral-strong"
      radius="s"
      paddingX="4"
      paddingY="2"
      onBackground="neutral-medium"
      border="neutral-strong"
      className={className}
      style={style}
      {...rest}
    >
      <Text as="span" variant="label-default-s">
        {label || children}
      </Text>
    </Flex>
  ),
);

Kbd.displayName = "Kbd";
export { Kbd };
export type { KbdProps };
