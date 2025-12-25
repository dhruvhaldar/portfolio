import classNames from "classnames";
import { Flex, Text } from ".";
import styles from "./Option.module.scss";
import { ElementType } from "./ElementType";
import React, { forwardRef } from "react";

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
}

/**
 * A selectable option component for dropdowns and lists.
 */
const Option = forwardRef<HTMLDivElement, OptionProps>(
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

    return (
      <ElementType
        tabIndex={tabIndex}
        ref={ref}
        href={href}
        className="reset-button-styles"
        style={{ width: "100%" }}
      >
        <Flex
          {...props}
          fillWidth
          vertical="center"
          paddingX="12"
          paddingY="8"
          gap="12"
          radius="m"
          role="option"
          aria-selected={selected}
          tabIndex={-1}
          borderWidth={1}
          borderStyle="solid"
          cursor="interactive"
          transition="micro-medium"
          onClick={() => onClick?.(value)}
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
);

Option.displayName = "Option";
export { Option };
