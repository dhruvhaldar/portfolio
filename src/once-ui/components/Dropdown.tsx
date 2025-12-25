"use client";

import React, { ReactNode, forwardRef, SyntheticEvent } from "react";
import { Flex } from ".";

interface DropdownProps extends Omit<React.ComponentProps<typeof Flex>, "onSelect"> {
  /** Currently selected option value */
  selectedOption?: string;
  /** Dropdown options (children) */
  children?: ReactNode;
  /** Escape key handler */
  onEscape?: () => void;
  /** Selection handler */
  onSelect?: (event: string) => void;
}

/**
 * A generic dropdown container with glassmorphism styling.
 */
const Dropdown = forwardRef<HTMLDivElement, DropdownProps>(
  ({ selectedOption, className, children, onEscape, onSelect, ...rest }, ref) => {
    const handleSelect = (event: SyntheticEvent<HTMLDivElement>) => {
      const value = event.currentTarget.getAttribute("data-value");
      if (onSelect && value) {
        onSelect(value);
      }
    };

    return (
      <Flex
        ref={ref}
        role="listbox"
        onClick={handleSelect}
        flex={1}
        border="neutral-medium"
        background="surface"
        overflow="hidden"
        style={{
          backdropFilter: 'blur(10px)',
          background: 'var(--neutral-alpha-strong)',
          ...rest.style,
        }}
        {...rest}
      >
        <Flex flex={1} overflowY="auto" direction="column" gap="2">
          {children}
        </Flex>
      </Flex>
    );
  },
);

Dropdown.displayName = "Dropdown";

export { Dropdown };
export type { DropdownProps };
