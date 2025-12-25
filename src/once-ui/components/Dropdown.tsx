"use client";

import React, { ReactNode, forwardRef, SyntheticEvent } from "react";
import { Flex } from ".";

interface DropdownProps extends Omit<React.ComponentProps<typeof Flex>, "onSelect"> {
  /** Currently selected option value */
  selectedOption?: string;
  /** Dropdown options (children) */
  children?: ReactNode;

  /** Selection handler */
  onSelect?: (event: string) => void;
}

/**
 * A generic dropdown container with glassmorphism styling.
 */
const Dropdown = forwardRef<HTMLDivElement, DropdownProps>(
  ({ selectedOption, className, children, onSelect, ...rest }, ref) => {
    const handleSelect = (event: SyntheticEvent<HTMLDivElement>) => {
      const target = event.target as HTMLElement;
      const valueElement = target.closest("[data-value]") as HTMLElement | null;
      const value = valueElement?.getAttribute("data-value");
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
