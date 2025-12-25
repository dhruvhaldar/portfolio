"use client";

import { forwardRef } from "react";
import { Flex } from ".";

interface ColumnProps extends React.ComponentProps<typeof Flex> {
  /** Content children */
  children?: React.ReactNode;
}

/**
 * A layout component for vertical stacking.
 * Alias for Flex with direction="column".
 */
const Column = forwardRef<HTMLDivElement, ColumnProps>(({ children, direction, ...rest }, ref) => {
  return (
    <Flex direction="column" ref={ref} {...rest}>
      {children}
    </Flex>
  );
});

Column.displayName = "Column";
export { Column };
