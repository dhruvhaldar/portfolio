"use client";

import type { Placement } from "@floating-ui/react-dom";
import classNames from "classnames";
import type React from "react";
import {
  type ReactNode,
  forwardRef,
  useCallback,
  useEffect,
  useId,
  useMemo,
  useRef,
  useState,
} from "react";
import { DropdownWrapper, Flex, Icon, IconButton, Input, type InputProps, Option } from ".";
import type { DropdownWrapperProps } from "./DropdownWrapper";
import inputStyles from "./Input.module.scss";
import type { OptionProps } from "./Option";

type SelectOptionType = Omit<OptionProps, "selected"> & {
  displayLabel?: string;
};

interface SelectProps
  extends Omit<InputProps, "onSelect" | "value">,
    Pick<DropdownWrapperProps, "minHeight" | "minWidth" | "maxWidth"> {
  /** List of selectable options */
  options: SelectOptionType[];
  /** Current selected value */
  value?: string;
  /** Content to display when no results found */
  emptyState?: ReactNode;
  /** Selection handler */
  onSelect?: (value: string) => void;
  /** Placement of the dropdown */
  floatingPlacement?: Placement;
  /** Whether the select is searchable */
  searchable?: boolean;
  /** Custom class name */
  className?: string;
  /** Custom styles */
  style?: React.CSSProperties;
}

/**
 * A dropdown select component with support for searching and custom options.
 */
const Select = forwardRef<HTMLDivElement, SelectProps>(
  (
    {
      options,
      value = "",
      onSelect,
      searchable = false,
      emptyState = "No results",
      minHeight,
      minWidth,
      maxWidth,
      floatingPlacement,
      className,
      style,
      ...rest
    },
    ref,
  ) => {
    const [isFocused, setIsFocused] = useState(false);
    const [isFilled, setIsFilled] = useState(!!value);
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [highlightedIndex, setHighlightedIndex] = useState<number | null>(() => {
      if (!options?.length || !value) return null;
      return options.findIndex((option) => option.value === value);
    });
    const [searchQuery, setSearchQuery] = useState("");
    const selectRef = useRef<HTMLDivElement | null>(null);
    const clearButtonRef = useRef<HTMLButtonElement>(null);
    const generatedId = useId();
    const listboxId = `${generatedId}-listbox`;

    const displayValue = useMemo(() => {
      const selectedOption = options.find((option) => option.value === value);
      if (selectedOption) {
        if (selectedOption.displayLabel) {
          return selectedOption.displayLabel;
        }
        if (typeof selectedOption.label === "string") {
          return selectedOption.label;
        }
      }
      return value;
    }, [options, value]);

    const filteredOptions = useMemo(() => {
      if (!searchQuery) return options;
      return options.filter((option) =>
        option.label?.toString().toLowerCase().includes(searchQuery.toLowerCase()),
      );
    }, [options, searchQuery]);

    useEffect(() => {
      setHighlightedIndex(null);
    }, [searchQuery]);

    const handleFocus = () => {
      setIsFocused(true);
    };

    const handleBlur = (event: React.FocusEvent<HTMLInputElement>) => {
      if (selectRef.current && !selectRef.current.contains(event.relatedTarget as Node)) {
        setIsFocused(false);
        setIsDropdownOpen(false);
      }
    };

    const handleSelect = useCallback(
      (value: string) => {
        if (onSelect) onSelect(value);
        setIsDropdownOpen(false);
        setIsFilled(true);
      },
      [onSelect],
    );

    // Bolt: Stable handler to prevent Option re-renders
    const handleOptionClick = useCallback(
      (optionValue: string) => {
        const selectedOption = filteredOptions.find((option) => option.value === optionValue);
        if (selectedOption?.onClick) {
          selectedOption.onClick(optionValue);
        }
        handleSelect(optionValue);
      },
      [filteredOptions, handleSelect],
    );

    const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
      if (!isFocused && event.key !== "Enter") return;

      switch (event.key) {
        case "Escape":
          setIsDropdownOpen(false);
          break;
        case "ArrowDown":
          if (!isDropdownOpen) {
            setIsDropdownOpen(true);
            break;
          }
          event.preventDefault();
          setHighlightedIndex((prevIndex) => {
            const newIndex =
              prevIndex === null || prevIndex === filteredOptions.length - 1 ? 0 : prevIndex + 1;
            return newIndex;
          });
          break;

        case "ArrowUp":
          event.preventDefault();
          setHighlightedIndex((prevIndex) => {
            const newIndex =
              prevIndex === null || prevIndex === 0 ? filteredOptions.length - 1 : prevIndex - 1;
            return newIndex;
          });
          break;

        case " ":
        case "Enter":
          event.preventDefault();
          if (highlightedIndex !== null && isDropdownOpen) {
            if (filteredOptions[highlightedIndex]) {
              handleSelect(filteredOptions[highlightedIndex].value);
            }
          } else {
            setIsDropdownOpen(true);
          }
          break;

        default:
          break;
      }
    };

    const handleClearSearch = (e: React.MouseEvent) => {
      e.preventDefault();
      e.stopPropagation();
      setSearchQuery("");
      // Force focus back to the input after clearing
      const input = selectRef.current?.querySelector("input");
      if (input) {
        input.focus();
      }
    };

    return (
      <DropdownWrapper
        fillWidth
        ref={(node) => {
          selectRef.current = node;
          if (typeof ref === "function") ref(node);
          else if (ref) ref.current = node;
        }}
        isOpen={isDropdownOpen}
        onOpenChange={setIsDropdownOpen}
        floatingPlacement={floatingPlacement}
        minHeight={minHeight}
        trigger={
          <Input
            {...rest}
            style={{
              textOverflow: "ellipsis",
              ...style,
            }}
            value={displayValue}
            onFocus={handleFocus}
            onBlur={handleBlur}
            onKeyDown={handleKeyDown}
            readOnly
            className={classNames("cursor-interactive", "fill-width", {
              [inputStyles.filled]: isFilled,
              [inputStyles.focused]: isFocused,
              className,
            })}
            role="combobox"
            aria-activedescendant={
              isDropdownOpen && highlightedIndex !== null
                ? `${generatedId}-option-${highlightedIndex}`
                : undefined
            }
            aria-controls={listboxId}
            aria-haspopup="listbox"
            aria-expanded={isDropdownOpen}
          />
        }
        dropdownId={listboxId}
        dropdown={
          <>
            {searchable && (
              <Flex fillWidth position="relative">
                <Input
                  data-scaling="90"
                  style={{
                    marginTop: "-1px",
                    marginLeft: "-1px",
                    width: "calc(100% + 2px)",
                  }}
                  labelAsPlaceholder
                  id={`${generatedId}-search`}
                  label="Search"
                  height="s"
                  radius="none"
                  hasSuffix={
                    searchQuery ? (
                      <IconButton
                        tooltip="Clear"
                        tooltipPosition="left"
                        icon="close"
                        variant="ghost"
                        size="s"
                        onClick={handleClearSearch}
                      />
                    ) : undefined
                  }
                  hasPrefix={<Icon name="search" size="xs" />}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onClick={(e) => e.stopPropagation()}
                  onBlur={handleBlur}
                />
              </Flex>
            )}
            <Flex fillWidth padding="4" direction="column" gap="2">
              {filteredOptions.map((option, index) => (
                <Option
                  key={option.value}
                  id={`${generatedId}-option-${index}`}
                  {...option}
                  onClick={handleOptionClick}
                  selected={option.value === value}
                  highlighted={index === highlightedIndex}
                  tabIndex={-1}
                />
              ))}
              {filteredOptions.length === 0 && (
                <Flex fillWidth vertical="center" horizontal="center" paddingX="16" paddingY="32">
                  {emptyState}
                </Flex>
              )}
            </Flex>
          </>
        }
      />
    );
  },
);

Select.displayName = "Select";
export { Select };
