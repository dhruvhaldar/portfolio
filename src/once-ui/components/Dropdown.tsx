"use client";

import type React from "react";
import { type ReactNode, type SyntheticEvent, forwardRef } from "react";
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

    const handleKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
      const target = event.currentTarget;
      const focusableQuery =
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])';
      const focusableElements = Array.from(
        target.querySelectorAll(focusableQuery),
      ) as HTMLElement[];

      if (focusableElements.length === 0) return;

      const focusedIndex = focusableElements.indexOf(document.activeElement as HTMLElement);

      if (event.key === "ArrowDown") {
        event.preventDefault();
        const nextIndex = focusedIndex === -1 ? 0 : (focusedIndex + 1) % focusableElements.length;
        focusableElements[nextIndex].focus();
      } else if (event.key === "ArrowUp") {
        event.preventDefault();
        const prevIndex =
          focusedIndex === -1
            ? focusableElements.length - 1
            : (focusedIndex - 1 + focusableElements.length) % focusableElements.length;
        focusableElements[prevIndex].focus();
      }
    };

    return (
      <Flex
        ref={ref}
        role="listbox"
        tabIndex={0}
        onKeyDown={handleKeyDown}
        onClick={handleSelect}
        flex={1}
        border="neutral-medium"
        background="surface"
        overflow="hidden"
        style={{
          backdropFilter: "blur(10px)",
          background: "var(--neutral-alpha-strong)",
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
