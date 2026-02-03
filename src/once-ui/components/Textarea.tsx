"use client";

import React, {
  useState,
  useEffect,
  forwardRef,
  TextareaHTMLAttributes,
  useCallback,
  ReactNode,
  memo,
} from "react";
import classNames from "classnames";
import { Flex, Text } from ".";
import styles from "./Input.module.scss";
import useDebounce from "../hooks/useDebounce";

interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  /** Element ID */
  id: string;
  /** Input label */
  label: string;
  /** Number of lines or auto-grow */
  lines?: number | "auto";
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
  /** Prefix element */
  hasPrefix?: ReactNode;
  /** Suffix element */
  hasSuffix?: ReactNode;
  /** Whether label acts as placeholder */
  labelAsPlaceholder?: boolean;
  /** Resize behavior */
  resize?: "horizontal" | "vertical" | "both" | "none";
  /** Show character count */
  showCount?: boolean;
  /** Custom validation function that returns error message (ReactNode) or null if valid. Validation is debounced by 1s. */
  validate?: (value: ReactNode) => ReactNode | null;
}

/**
 * A multi-line text input component.
 * Supports auto-growing height and validation.
 */
const TextareaComponent = forwardRef<HTMLTextAreaElement, TextareaProps>(
  (
    {
      id,
      label,
      lines = 3,
      error = false,
      errorMessage,
      description,
      radius,
      className,
      hasPrefix,
      hasSuffix,
      labelAsPlaceholder = false,
      resize = "vertical",
      showCount = false,
      validate,
      children,
      onFocus,
      onBlur,
      onChange,
      style,
      ...props
    },
    ref,
  ) => {
    const [isFocused, setIsFocused] = useState(false);
    const [isFilled, setIsFilled] = useState(!!props.value);
    const [validationError, setValidationError] = useState<ReactNode | null>(null);
    const [height, setHeight] = useState<number | undefined>(undefined);
    const textareaRef = React.useRef<HTMLTextAreaElement>(null);
    const debouncedValue = useDebounce(props.value, 1000);

    const { maxLength = 4096 } = props;
    const [length, setLength] = useState(() => String(props.value || props.defaultValue || "").length);

    const adjustHeight = useCallback(() => {
      if (textareaRef.current) {
        textareaRef.current.style.height = "auto";
        textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`; // Set to scroll height
      }
    }, []);

    const handleChange = useCallback(
      (event: React.ChangeEvent<HTMLTextAreaElement>) => {
        setLength(event.target.value.length);
        if (lines === "auto") {
          adjustHeight();
        }
        if (onChange) onChange(event);
      },
      [lines, adjustHeight, onChange],
    );

    const handleFocus = useCallback(
      (event: React.FocusEvent<HTMLTextAreaElement>) => {
        setIsFocused(true);
        if (onFocus) onFocus(event);
      },
      [onFocus],
    );

    const handleBlur = useCallback(
      (event: React.FocusEvent<HTMLTextAreaElement>) => {
        setIsFocused(false);
        setIsFilled(!!event.target.value);
        if (onBlur) onBlur(event);
      },
      [onBlur],
    );

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
          setValidationError(errorMessage || null);
        }
      } else {
        setValidationError(null);
      }
    }, [debouncedValue, validate, errorMessage]);

    useEffect(() => {
      validateInput();
    }, [debouncedValue, validateInput]);

    useEffect(() => {
      if (lines === "auto") {
        adjustHeight();
      }
    }, [props.value, lines, adjustHeight]);

    useEffect(() => {
      if (props.value !== undefined) {
        setLength(String(props.value).length);
      }
    }, [props.value]);

    const displayError = validationError || errorMessage;

    const describedBy: string[] = [];
    if (displayError) describedBy.push(`${id}-error`);
    if (description) describedBy.push(`${id}-description`);
    if (showCount) describedBy.push(`${id}-count`);

    const textareaClassNames = classNames(
      styles.input,
      styles.textarea,
      "font-body",
      "font-default",
      "font-m",
      {
        [styles.filled]: isFilled,
        [styles.focused]: isFocused,
        [styles.withPrefix]: hasPrefix,
        [styles.withSuffix]: hasSuffix,
        [styles.labelAsPlaceholder]: labelAsPlaceholder,
        [styles.hasChildren]: children,
      },
    );

    const handleRef = useCallback((node: HTMLTextAreaElement | null) => {
      if (typeof ref === "function") {
        ref(node);
      } else if (ref) {
        ref.current = node;
      }
      //@ts-ignore
      textareaRef.current = node;
    }, [ref]);

    return (
      <Flex
        position="relative"
        direction="column"
        gap="8"
        fillWidth
        fitHeight
        className={classNames(className, {
          [styles.error]: displayError && debouncedValue !== "",
        })}
      >
        <Flex
          minHeight="56"
          transition="micro-medium"
          border="neutral-medium"
          background="neutral-alpha-weak"
          position="relative"
          overflow="hidden"
          vertical="stretch"
          className={classNames(
            styles.base,
            lines !== "auto" && styles.textareaBase,
            radius === "none" ? "radius-none" : radius ? `radius-l-${radius}` : "radius-l",
          )}
        >
          {hasPrefix && (
            <Flex paddingLeft="12" className={styles.prefix}>
              {hasPrefix}
            </Flex>
          )}
          <Flex fillWidth direction="column" position="relative">
            <textarea
              aria-label={labelAsPlaceholder ? label : undefined}
              maxLength={maxLength}
              {...props}
              ref={handleRef}
              id={id}
              rows={typeof lines === "number" ? lines : 1}
              placeholder={labelAsPlaceholder ? label : props.placeholder}
              onFocus={handleFocus}
              onBlur={handleBlur}
              className={textareaClassNames}
              aria-describedby={describedBy.length > 0 ? describedBy.join(" ") : undefined}
              aria-invalid={!!displayError}
              style={{
                ...style,
                resize: lines === "auto" ? "none" : resize,
                height: height ? `${height}rem` : "auto",
              }}
              onChange={handleChange}
            />
            {!labelAsPlaceholder && (
              <Text
                as="label"
                variant="label-default-m"
                htmlFor={id}
                className={classNames(styles.label, styles.textareaLabel, {
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
            {children && children}
          </Flex>
          {hasSuffix && (
            <Flex paddingRight="12" className={styles.suffix}>
              {hasSuffix}
            </Flex>
          )}
        </Flex>

        {(displayError || description || showCount) && (
          <Flex paddingX="16" fillWidth horizontal="space-between" gap="16">
             <Flex direction="column" fillWidth gap="4">
               {displayError && errorMessage !== false && (
                  <Text as="span" id={`${id}-error`} variant="body-default-s" onBackground="danger-weak">
                    {displayError}
                  </Text>
               )}
               {description && (
                  <Text
                    as="span"
                    id={`${id}-description`}
                    variant="body-default-s"
                    onBackground="neutral-weak"
                  >
                    {description}
                  </Text>
               )}
             </Flex>
             {showCount && (
                <Text
                    as="span"
                    id={`${id}-count`}
                    variant="body-default-s"
                    onBackground="neutral-weak"
                    style={{ whiteSpace: "nowrap" }}
                >
                    {length} / {maxLength}
                </Text>
             )}
          </Flex>
        )}
      </Flex>
    );
  },
);

TextareaComponent.displayName = "Textarea";

// Bolt: Memoize Textarea to prevent unnecessary re-renders when props are stable
const Textarea = memo(TextareaComponent);
Textarea.displayName = "Textarea";

export { Textarea };
export type { TextareaProps };
