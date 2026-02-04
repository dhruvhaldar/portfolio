"use client";

import React, { forwardRef, useState } from "react";
import { Input } from ".";
import { Flex } from ".";
import { IconButton } from ".";
import styles from "./NumberInput.module.scss";
import classNames from "classnames";

interface NumberInputProps
  extends Omit<React.ComponentProps<typeof Input>, "type" | "value" | "onChange"> {
  /** Current value */
  value?: number;
  /** Change handler */
  onChange?: (value: number) => void;
  /** Minimum value */
  min?: number;
  /** Maximum value */
  max?: number;
  /** Incremental step size */
  step?: number;
  /** Padding width for leading zeros */
  padStart?: number;
}

/**
 * An input component for numerical values with increment/decrement controls.
 */
const NumberInput = forwardRef<HTMLInputElement, NumberInputProps>(
  ({ value, onChange, min, max, step = 1, padStart, ...props }, ref) => {
    const [localValue, setLocalValue] = useState<string>(
      padStart && value !== undefined
        ? value.toString().padStart(padStart, "0")
        : (value?.toString() ?? ""),
    );

    React.useEffect(() => {
      if (value !== undefined) {
        const formatted = padStart
          ? value.toString().padStart(padStart, "0")
          : value.toString();
        setLocalValue(formatted);
      }
    }, [value, padStart]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const newValue = e.target.value;
      setLocalValue(newValue);

      const numValue = parseFloat(newValue);
      if (!isNaN(numValue) && onChange) {
        const clampedValue = Math.min(
          max ?? numValue,
          Math.max(min ?? numValue, numValue)
        );
        onChange(clampedValue);
      }
    };

    const updateValue = (newValue: number) => {
      const formattedValue = padStart
        ? newValue.toString().padStart(padStart, "0")
        : newValue.toString();
      setLocalValue(formattedValue);
      onChange?.(newValue);
    };

    const increment = () => {
      const currentValue = parseFloat(localValue) || 0;
      const newValue = currentValue + step;
      if (max === undefined || newValue <= max) {
        updateValue(newValue);
      }
    };

    const decrement = () => {
      const currentValue = parseFloat(localValue) || 0;
      const newValue = currentValue - step;
      if (min === undefined || newValue >= min) {
        updateValue(newValue);
      }
    };

    return (
      <Input
        {...props}
        ref={ref}
        type="number"
        value={localValue}
        onChange={handleChange}
        min={min}
        max={max}
        step={step}
        hasSuffix={
          <>
            <Flex minWidth={1.25}></Flex>
            <Flex
              position="absolute"
              right="0"
              top="0"
              direction="column"
              borderLeft="neutral-medium"
              fillHeight
              background="neutral-alpha-weak"
            >
              <Flex
                fillHeight
                borderBottom="neutral-medium"
                paddingX="4"
                className={classNames(styles.stepper, "transition-micro-medium")}
              >
                <IconButton
                  icon="chevronUp"
                  variant="ghost"
                  size="s"
                  onClick={increment}
                  aria-label="Increment value"
                  disabled={max !== undefined && (parseFloat(localValue) || 0) >= max}
                />
              </Flex>
              <Flex
                fillHeight
                paddingX="4"
                className={classNames(styles.stepper, "transition-micro-medium")}
              >
                <IconButton
                  icon="chevronDown"
                  variant="ghost"
                  size="s"
                  onClick={decrement}
                  aria-label="Decrement value"
                  disabled={min !== undefined && (parseFloat(localValue) || 0) <= min}
                />
              </Flex>
            </Flex>
          </>
        }
        className={styles.numberInput}
      />
    );
  },
);

NumberInput.displayName = "NumberInput";
export { NumberInput };
