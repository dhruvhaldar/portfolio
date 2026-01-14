"use client";

import {
  type Placement,
  autoUpdate,
  flip,
  offset,
  shift,
  size,
  useFloating,
} from "@floating-ui/react-dom";
import type React from "react";
import {
  type ReactNode,
  forwardRef,
  useCallback,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from "react";
import { Dropdown, Flex } from ".";
import styles from "./DropdownWrapper.module.scss";

export interface DropdownWrapperProps {
  /** Whether to fill width */
  fillWidth?: boolean;
  /** Minimum width of dropdown */
  minWidth?: number;
  /** Maximum width of dropdown */
  maxWidth?: number;
  /** Minimum height of dropdown */
  minHeight?: number;
  /** Floating placement strategy */
  floatingPlacement?: Placement;
  /** Trigger element */
  trigger: ReactNode;
  /** Dropdown content element */
  dropdown: ReactNode;
  /** Selected option value */
  selectedOption?: string;
  /** Custom styles */
  style?: React.CSSProperties;
  /** Custom class name */
  className?: string;
  /** Selection handler */
  onSelect?: (value: string) => void;
  /** Whether the dropdown is open (controlled) */
  isOpen?: boolean;
  /** Open state change handler */
  onOpenChange?: (isOpen: boolean) => void;
}

/**
 * A wrapper component that manages the positioning and state of a dropdown.
 * Uses floating-ui for positioning.
 */
const DropdownWrapper = forwardRef<HTMLDivElement, DropdownWrapperProps>(
  (
    {
      trigger,
      dropdown,
      selectedOption,
      minHeight,
      onSelect,
      isOpen: controlledIsOpen,
      onOpenChange,
      minWidth,
      maxWidth,
      fillWidth = false,
      floatingPlacement = "bottom-start",
      className,
      style,
    },
    ref,
  ) => {
    const wrapperRef = useRef<HTMLDivElement>(null);
    const dropdownRef = useRef<HTMLDivElement | null>(null);
    const [mounted, setMounted] = useState(false);
    const [internalIsOpen, setInternalIsOpen] = useState(false);

    const isControlled = controlledIsOpen !== undefined;
    const isOpen = isControlled ? controlledIsOpen : internalIsOpen;

    const handleOpenChange = useCallback(
      (newIsOpen: boolean) => {
        if (!isControlled) {
          setInternalIsOpen(newIsOpen);
        }
        onOpenChange?.(newIsOpen);
      },
      [isControlled, onOpenChange],
    );

    const { x, y, strategy, refs, update } = useFloating({
      placement: floatingPlacement,
      open: isOpen,
      middleware: [
        offset(4),
        minHeight ? undefined : flip(),
        shift(),
        size({
          apply({ availableWidth, availableHeight, elements }) {
            Object.assign(elements.floating.style, {
              width: fillWidth ? "100%" : "auto",
              minWidth: minWidth ? `${minWidth}rem` : undefined,
              maxWidth: maxWidth ? `${maxWidth}rem` : `${availableWidth}px`,
              minHeight: `${Math.min(minHeight || 0)}px`,
              maxHeight: `${availableHeight}px`,
            });
          },
        }),
      ],
      whileElementsMounted: autoUpdate,
    });

    useImperativeHandle(ref, () => wrapperRef.current as HTMLDivElement);

    useEffect(() => {
      if (wrapperRef.current) {
        refs.setReference(wrapperRef.current);
      }
    }, [refs]);

    useEffect(() => {
      if (!mounted) {
        setMounted(true);
      }
    }, [mounted]);

    useEffect(() => {
      if (isOpen && mounted) {
        requestAnimationFrame(() => {
          if (dropdownRef.current) {
            refs.setFloating(dropdownRef.current);
            update();
          }
        });
      }
    }, [isOpen, mounted, refs, update]);

    const handleClickOutside = useCallback(
      (event: MouseEvent) => {
        if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
          handleOpenChange(false);
        }
      },
      [handleOpenChange],
    );

    const handleFocusOut = useCallback(
      (event: FocusEvent) => {
        if (wrapperRef.current && !wrapperRef.current.contains(event.relatedTarget as Node)) {
          handleOpenChange(false);
        }
      },
      [handleOpenChange],
    );

    useEffect(() => {
      const wrapperEl = wrapperRef.current;
      document.addEventListener("mousedown", handleClickOutside);
      wrapperEl?.addEventListener("focusout", handleFocusOut);
      return () => {
        document.removeEventListener("mousedown", handleClickOutside);
        wrapperEl?.removeEventListener("focusout", handleFocusOut);
      };
    }, [handleClickOutside, handleFocusOut]);

    return (
      <Flex
        fillWidth={fillWidth}
        direction="column"
        transition="macro-medium"
        style={{
          ...(minHeight && isOpen
            ? {
                marginBottom: `${minHeight + 8}px`,
              }
            : {}),
          ...style,
        }}
        className={className}
        position="relative"
        ref={wrapperRef}
        onClick={() => handleOpenChange(!isOpen)}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            handleOpenChange(!isOpen);
          }
        }}
        tabIndex={-1}
        role="button"
        aria-haspopup="listbox"
        aria-expanded={isOpen}
      >
        {trigger}
        {isOpen && (
          <Flex
            zIndex={1}
            className={styles.fadeIn}
            minWidth={minWidth}
            ref={dropdownRef}
            style={{
              position: strategy,
              top: y ?? 0,
              offset: 4,
              left: x ?? 0,
            }}
            role="listbox"
          >
            <Dropdown
              minWidth={minWidth}
              radius="l"
              selectedOption={selectedOption}
              onSelect={onSelect}
            >
              {dropdown}
            </Dropdown>
          </Flex>
        )}
      </Flex>
    );
  },
);

DropdownWrapper.displayName = "DropdownWrapper";
export { DropdownWrapper };
