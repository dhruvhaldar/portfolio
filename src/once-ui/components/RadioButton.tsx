"use client";

import classNames from "classnames";
import type React from "react";
import { forwardRef, useEffect, useState } from "react";
import { Flex, InteractiveDetails, type InteractiveDetailsProps } from ".";
import styles from "./SharedInteractiveStyles.module.scss";

interface RadioButtonProps
  extends Omit<InteractiveDetailsProps, "onClick">,
    Omit<React.InputHTMLAttributes<HTMLInputElement>, "checked" | "onChange"> {
  /** Whether the radio button is checked */
  isChecked?: boolean;
  /** Toggle handler */
  onToggle?: () => void;
}
const generateId = () => `radio-${Math.random().toString(36).substring(2, 9)}`;

/**
 * A radio button component.
 * Allows selection of a single option from a set.
 *
 * @example
 * // Uncontrolled usage
 * <RadioButton label="Option 1" name="group1" value="option1" />
 *
 * @example
 * // Controlled usage
 * <RadioButton
 *   label="Option 1"
 *   name="group1"
 *   value="option1"
 *   isChecked={selected === "option1"}
 *   onToggle={() => setSelected("option1")}
 * />
 */
const RadioButton: React.FC<RadioButtonProps> = forwardRef<HTMLInputElement, RadioButtonProps>(
  (
    { style, className, isChecked: controlledIsChecked, name, value, onToggle, disabled, ...props },
    ref,
  ) => {
    const [isChecked, setIsChecked] = useState(controlledIsChecked || false);
    const [radioId] = useState(generateId());

    useEffect(() => {
      if (controlledIsChecked !== undefined) {
        setIsChecked(controlledIsChecked);
      }
    }, [controlledIsChecked]);

    const toggleItem = () => {
      if (disabled) return;
      if (onToggle) {
        onToggle();
      } else {
        if (!isChecked) {
          setIsChecked(true);
        }
      }
    };

    const handleKeyDown = (event: React.KeyboardEvent) => {
      if (disabled) return;
      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        toggleItem();
      }
    };

    return (
      <Flex
        vertical="center"
        gap="16"
        zIndex={1}
        className={classNames(styles.container, className, {
          [styles.disabled]: disabled,
        })}
        style={style}
      >
        <input
          type="radio"
          ref={ref}
          name={name}
          value={value}
          checked={controlledIsChecked !== undefined ? controlledIsChecked : isChecked}
          onChange={toggleItem}
          disabled={disabled}
          className={styles.hidden}
          tabIndex={-1}
          aria-hidden="true"
          {...props}
        />
        <Flex
          role="radio"
          aria-checked={controlledIsChecked !== undefined ? controlledIsChecked : isChecked}
          aria-labelledby={radioId}
          aria-disabled={disabled}
          aria-required={props.required}
          position="relative"
          horizontal="center"
          vertical="center"
          radius="full"
          onClick={toggleItem}
          onKeyDown={handleKeyDown}
          tabIndex={disabled ? -1 : 0}
          className={classNames(styles.element, {
            [styles.checked]: controlledIsChecked !== undefined ? controlledIsChecked : isChecked,
            [styles.disabled]: disabled,
          })}
        >
          {(controlledIsChecked !== undefined ? controlledIsChecked : isChecked) && (
            <Flex
              style={{
                backgroundColor: "var(--neutral-on-solid-strong)",
              }}
              radius="full"
              width="12"
              height="12"
              className={styles.icon}
            />
          )}
        </Flex>
        {props.label && (
          <InteractiveDetails
            id={radioId}
            {...props}
            onClick={toggleItem}
            required={props.required}
          />
        )}
      </Flex>
    );
  },
);

RadioButton.displayName = "RadioButton";

export { RadioButton };
export type { RadioButtonProps };
