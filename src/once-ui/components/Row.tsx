"use client";

import { forwardRef } from "react";
import { Flex } from ".";

interface RowProps extends React.ComponentProps<typeof Flex> {
  /** Content children */
  children?: React.ReactNode;
}

/**
 * A layout component for horizontal stacking.
 * Alias for Flex with default direction.
 */
const Row = forwardRef<HTMLDivElement, RowProps>(({ children, ...rest }, ref) => {
  return (
    <Flex direction="row" ref={ref} {...rest}>
      {children}
    </Flex>
  );
});

Row.displayName = "Row";
export { Row };
