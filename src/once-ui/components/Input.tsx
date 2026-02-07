"use client";

import classNames from "classnames";
import type React from "react";
import {
  type InputHTMLAttributes,
  type ReactNode,
  forwardRef,
  memo,
  useCallback,
  useEffect,
  useState,
} from "react";
import { Flex, Icon, Spinner, Text } from ".";
import useDebounce from "../hooks/useDebounce";
import styles from "./Input.module.scss";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  /** Element ID */
  id: string;
  /** Input label */
  label: string;
  /** Height size */
  height?: "s" | "m";
  /** Error state */
  error?: boolean;
  /** Error message text */
  errorMessage?: ReactNode;
  /** Description help text */
  description?: ReactNode;
  /** Border radius */
  radius?:
    | "none"
    | "top"
    | "right"
    | "bottom"
    | "left"
    | "top-left"
    | "top-right"
    | "bottom-right"
    | "bottom-left";
  /** Custom class name */
  className?: string;
  /** Custom styles */
  style?: React.CSSProperties;
  /** Prefix element */
  hasPrefix?: ReactNode;
  /** Suffix element */
  hasSuffix?: ReactNode;
  /** Whether label acts as placeholder */
  labelAsPlaceholder?: boolean;
  /** Custom validation function */
  validate?: (value: ReactNode) => ReactNode | null;
  /** Whether the input is in a loading state */
  loading?: boolean;
  /** Show character count */
  showCount?: boolean;
}

/**
 * A form input component with built-in labeling, validation, and styling.
 */
const InputComponent = forwardRef<HTMLInputElement, InputProps>(
  (
    {
      id,
      label,
      height = "m",
      error = false,
      errorMessage,
      description,
      radius,
      className,
      style,
      hasPrefix,
      hasSuffix,
      loading = false,
      labelAsPlaceholder = false,
      showCount = false,
      children,
      onFocus,
      onBlur,
      onChange,
      validate,
      ...props
    },
    ref,
  ) => {
    const [isFocused, setIsFocused] = useState(false);

    // Bolt: Optimize re-renders by deriving isFilled from props when controlled
    const isControlled = typeof props.value !== "undefined";
    const [isFilledState, setIsFilledState] = useState(!!props.value || !!props.defaultValue);
    const isFilled = isControlled ? !!props.value : isFilledState;

    // internalLength logic
    const [internalLengthState, setInternalLengthState] = useState(
      props.value
        ? props.value.toString().length
        : props.defaultValue
          ? props.defaultValue.toString().length
          : 0,
    );
    const internalLength = isControlled
      ? props.value
        ? props.value.toString().length
        : 0
      : internalLengthState;

    const maxLength = props.maxLength ?? 255;

    const [validationError, setValidationError] = useState<ReactNode | null>(null);
    const debouncedValue = useDebounce(props.value, 1000);

    const handleFocus = useCallback(
      (event: React.FocusEvent<HTMLInputElement>) => {
        setIsFocused(true);
        if (onFocus) onFocus(event);
      },
      [onFocus],
    );

    const handleBlur = useCallback(
      (event: React.FocusEvent<HTMLInputElement>) => {
        setIsFocused(false);
        if (!isControlled) {
          if (event.target.value) {
            setIsFilledState(true);
          } else {
            setIsFilledState(false);
          }
        }
        if (onBlur) onBlur(event);
      },
      [onBlur, isControlled],
    );

    const handleChange = useCallback(
      (event: React.ChangeEvent<HTMLInputElement>) => {
        if (!isControlled) {
          setInternalLengthState(event.target.value.length);
        }
        if (onChange) onChange(event);
      },
      [onChange, isControlled],
    );

    // Bolt: Removed useEffect for isFilled sync to prevent double renders

    const validateInput = useCallback(() => {
      if (!debouncedValue) {
        setValidationError(null);
        return;
      }

      if (validate) {
        const error = validate(debouncedValue);
        if (error) {
          setValidationError(error);
        } else {
          setValidationError(null);
        }
      } else {
        setValidationError(null);
      }
    }, [debouncedValue, validate]);

    useEffect(() => {
      validateInput();
    }, [validateInput]);

    const displayError = validationError || errorMessage;
    const countId = `${id}-count`;

    const describedBy: string[] = [];
    if (displayError) describedBy.push(`${id}-error`);
    if (description) describedBy.push(`${id}-description`);
    if (showCount) describedBy.push(countId);

    const inputClassNames = classNames(styles.input, "font-body", "font-default", "font-m", {
      [styles.filled]: isFilled,
      [styles.focused]: isFocused,
      [styles.withPrefix]: hasPrefix,
      [styles.withSuffix]: hasSuffix,
      [styles.labelAsPlaceholder]: labelAsPlaceholder,
      [styles.hasChildren]: children,
      [styles.error]: displayError && debouncedValue !== "",
    });

    return (
      <Flex
        position="relative"
        direction="column"
        gap="8"
        style={style}
        fillWidth
        fitHeight
        className={classNames(className, {
          [styles.error]: (error || (displayError && debouncedValue !== "")) && props.value !== "",
        })}
      >
        <Flex
          transition="micro-medium"
          border="neutral-medium"
          background="neutral-alpha-weak"
          position="relative"
          overflow="hidden"
          vertical="stretch"
          className={classNames(
            styles.base,
            {
              [styles.s]: height === "s",
            },
            {
              [styles.m]: height === "m",
            },
            radius === "none" ? "radius-none" : radius ? `radius-l-${radius}` : "radius-l",
          )}
        >
          {hasPrefix && (
            <Flex paddingLeft="12" className={styles.prefix}>
              {hasPrefix}
            </Flex>
          )}
          <Flex fillWidth direction="column" position="relative">
            <input
              aria-label={labelAsPlaceholder ? label : undefined}
              {...props}
              maxLength={maxLength}
              ref={ref}
              id={id}
              aria-busy={loading}
              placeholder={labelAsPlaceholder ? label : props.placeholder}
              onFocus={handleFocus}
              onBlur={handleBlur}
              onChange={handleChange}
              className={inputClassNames}
              aria-describedby={describedBy.length > 0 ? describedBy.join(" ") : undefined}
              aria-invalid={!!displayError}
            />
            {!labelAsPlaceholder && (
              <Text
                as="label"
                variant="label-default-m"
                htmlFor={id}
                className={classNames(styles.label, styles.inputLabel, {
                  [styles.floating]: isFocused || isFilled,
                })}
              >
                {label}
                {props.required && (
                  <Text as="span" onBackground="danger-weak" aria-hidden="true">
                    &nbsp;*
                  </Text>
                )}
              </Text>
            )}
            {children}
          </Flex>
          {(hasSuffix || loading) && (
            <Flex paddingRight="12" className={styles.suffix}>
              {loading ? <Spinner size={height === "s" ? "xs" : "s"} /> : hasSuffix}
            </Flex>
          )}
        </Flex>
        {displayError && errorMessage !== false && (
          <Flex paddingX="16" gap="8" vertical="center">
            <Icon name="errorCircle" size="s" onBackground="danger-weak" />
            <Text as="span" id={`${id}-error`} variant="body-default-s" onBackground="danger-weak">
              {validationError || errorMessage}
            </Text>
          </Flex>
        )}
        {description && (
          <Flex paddingX="16">
            <Text
              as="span"
              id={`${id}-description`}
              variant="body-default-s"
              onBackground="neutral-weak"
            >
              {description}
            </Text>
          </Flex>
        )}
        {showCount && (
          <Flex paddingX="16" fillWidth horizontal="end">
            <Text id={countId} variant="body-default-s" onBackground="neutral-weak">
              <span aria-hidden="true">
                {internalLength} / {maxLength}
              </span>
              <span className="sr-only">
                {internalLength} characters entered out of {maxLength} maximum
              </span>
            </Text>
          </Flex>
        )}
      </Flex>
    );
  },
);

InputComponent.displayName = "Input";

// Bolt: Memoize Input to prevent unnecessary re-renders when props are stable
const Input = memo(InputComponent);
Input.displayName = "Input";

export { Input };
export type { InputProps };
