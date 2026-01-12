"use client";

import React, { forwardRef } from "react";
import classNames from "classnames";

import { Flex, InteractiveDetails, InteractiveDetailsProps } from ".";
import styles from "./Switch.module.scss";
import commonStyles from "./SharedInteractiveStyles.module.scss";

interface SwitchProps
  extends Omit<InteractiveDetailsProps, "onClick">,
  React.InputHTMLAttributes<HTMLInputElement> {
  /** Custom styles */
  style?: React.CSSProperties;
  /** Custom class name */
  className?: string;
  /** Whether the switch is checked */
  isChecked: boolean;
  /** Form name */
  name?: string;
  /** Input value */
  value?: string;
  /** Disabled state */
  disabled?: boolean;
  /** Reverse toggle direction */
  reverse?: boolean;
  /** Aria label for accessibility */
  ariaLabel?: string;
  /** Toggle handler */
  onToggle: () => void;
}

/**
 * A toggle switch component.
 * Allows binary selection.
 */
const Switch: React.FC<SwitchProps> = forwardRef<HTMLInputElement, SwitchProps>(
  (
    {
      className,
      isChecked,
      reverse = false,
      onToggle,
      ariaLabel = "Toggle switch",
      disabled,
      name,
      value,
      ...props
    },
    ref,
  ) => {
    const handleKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
      if (!disabled && (event.key === "Enter" || event.key === " ")) {
        event.preventDefault();
        onToggle();
      }
    };

    const handleClick = () => {
      if (!disabled) {
        onToggle();
      }
    };

    return (
      <Flex
        fit={!reverse}
        inline={!reverse}
        gap="16"
        vertical="center"
        horizontal={reverse ? "space-between" : undefined}
        fillWidth={reverse}
        className={classNames(styles.container, className, {
          [styles.reverse]: reverse,
          [styles.disabled]: disabled,
        })}
        onClick={handleClick}
        onKeyDown={handleKeyDown}
        role="switch"
        aria-checked={isChecked}
        aria-label={ariaLabel}
        aria-disabled={disabled}
        tabIndex={disabled ? -1 : 0}
      >
        <input
          ref={ref}
          type="checkbox"
          name={name}
          value={value}
          checked={isChecked}
          onChange={onToggle}
          className={commonStyles.hidden}
          tabIndex={-1}
          {...props}
        />
        <div
          className={classNames(styles.switch, {
            [styles.checked]: isChecked,
            [styles.disabled]: disabled,
          })}
        >
          <div
            className={classNames(styles.element, {
              [styles.checked]: isChecked,
              [styles.disabled]: disabled,
            })}
          />
        </div>
        {props.label && (
          <InteractiveDetails
            {...props}
            onClick={() => { }} // Empty handler; clicks handled by parent Flex
          />
        )}
      </Flex>
    );
  },
);

Switch.displayName = "Switch";

export { Switch };
