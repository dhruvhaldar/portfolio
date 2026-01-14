"use client";

import type React from "react";
import { type ReactNode, forwardRef } from "react";
import { Flex } from "./Flex";
import styles from "./InlineCode.module.scss";

interface InlineCodeProps extends React.ComponentProps<typeof Flex> {
  children: ReactNode;
}

/**
 * A styled component for inline code snippets.
 *
 * @param {InlineCodeProps} props - Component props
 * @param {ReactNode} props.children - The code content to display
 * @param {React.Ref<HTMLDivElement>} ref - Forwarded ref to the underlying Flex element
 * @returns {React.ReactElement} The styled inline code element
 */
const InlineCode = forwardRef<HTMLDivElement, InlineCodeProps>(({ children, ...rest }, ref) => {
  return (
    <Flex
      as="span"
      inline
      fit
      ref={ref}
      radius="s"
      vertical="center"
      paddingX="4"
      paddingY="1"
      textType="code"
      background="neutral-alpha-weak"
      border="neutral-alpha-medium"
      className={styles.inlineCode}
      {...rest}
    >
      {children}
    </Flex>
  );
});

InlineCode.displayName = "InlineCode";

export { InlineCode };
