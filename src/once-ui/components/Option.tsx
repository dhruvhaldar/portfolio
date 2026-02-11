import classNames from "classnames";
import type React from "react";
import { forwardRef, memo } from "react";
import { Flex, Text } from ".";
import { ElementType } from "./ElementType";
import styles from "./Option.module.scss";

export interface OptionProps {
  /** Label content */
  label: React.ReactNode;
  /** Link URL (mutually exclusive with onClick) */
  href?: string;
  /** Value identifier */
  value: string;
  /** Prefix content */
  hasPrefix?: React.ReactNode;
  /** Suffix content */
  hasSuffix?: React.ReactNode;
  /** Description text */
  description?: React.ReactNode;
  /** Danger style */
  danger?: boolean;
  /** Selected state */
  selected?: boolean;
  /** Highlighted state */
  highlighted?: boolean;
  /** Tab index */
  tabIndex?: number;
  /** Click handler */
  onClick?: (value: string) => void;
  /** ID for accessibility */
  id?: string;
}

/**
 * A selectable option component for dropdowns and lists.
 */
// Bolt: Memoized to prevent re-renders when other options change
const Option = memo(
  forwardRef<HTMLDivElement, OptionProps>(
    (
      {
        label,
        value,
        href,
        hasPrefix,
        hasSuffix,
        description,
        danger,
        selected,
        highlighted,
        tabIndex,
        onClick,
        ...props
      },
      ref,
    ) => {
      if (href && onClick) {
        console.warn("Option should not have both `href` and `onClick` props.");
      }

      // Palette: Enhance keyboard accessibility by handling clicks on the wrapper
      const handleClick = (e: React.MouseEvent) => {
        if (onClick) {
          onClick(value);
        }
      };

      return (
        <ElementType
          tabIndex={tabIndex}
          ref={ref}
          href={href}
          className="reset-button-styles"
          style={{ width: "100%" }}
          onClick={handleClick}
          // Palette: Ensure Dropdown delegation works when keyboard activates the button
          data-value={value}
        >
          <Flex
            {...props}
            fillWidth
            vertical="center"
            paddingX="12"
            paddingY="8"
            gap="12"
            radius="m"
            // biome-ignore lint/a11y/useSemanticElements: Custom dropdown implementation
            role="option"
            aria-selected={selected}
            // Inner flex uses -1 to keep option out of tab order; wrapper ElementType handles focus
            tabIndex={-1}
            borderWidth={1}
            borderStyle="solid"
            cursor="interactive"
            transition="micro-medium"
            // onClick removed from here to prevent double firing and ensure keyboard works on wrapper
            className={classNames(styles.option, {
              [styles.danger]: danger,
              [styles.selected]: selected,
              [styles.highlighted]: highlighted,
            })}
            data-value={value}
          >
            {hasPrefix && <Flex className={styles.prefix}>{hasPrefix}</Flex>}
            <Flex
              horizontal="start"
              style={{
                whiteSpace: "nowrap",
              }}
              fillWidth
              direction="column"
            >
              <Text onBackground="neutral-strong" variant="label-default-s">
                {label}
              </Text>
              {description && (
                <Text variant="body-default-xs" onBackground="neutral-weak">
                  {description}
                </Text>
              )}
            </Flex>
            {hasSuffix && <Flex className={styles.suffix}>{hasSuffix}</Flex>}
          </Flex>
        </ElementType>
      );
    },
  ),
);

Option.displayName = "Option";
export { Option };
