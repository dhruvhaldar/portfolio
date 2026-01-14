"use client";

import React, { forwardRef, ReactNode, useState, useEffect, memo } from "react";
import classNames from "classnames";
import { ElementType } from "./ElementType";
import { Flex, Icon, Tooltip } from ".";
import styles from "./ToggleButton.module.scss";
import iconStyles from "./IconButton.module.scss";

interface CommonProps {
  /** Button label */
  label?: ReactNode;
  /** Selected state */
  selected: boolean;
  /** Visual style variant */
  variant?: "ghost" | "outline";
  /** Size dimension */
  size?: "s" | "m" | "l";
  /** Border radius configuration */
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
  /** Content alignment */
  justifyContent?: "flex-start" | "center" | "flex-end" | "space-between";
  /** Whether to fill available width */
  fillWidth?: boolean;
  /** Font weight */
  weight?: "default" | "strong";
  /** Truncate text */
  truncate?: boolean;
  /** Prefix icon */
  prefixIcon?: string;
  /** Suffix icon */
  suffixIcon?: string;
  /** Custom class name */
  className?: string;
  /** Custom styles */
  style?: React.CSSProperties;
  /** Content children */
  children?: ReactNode;
  /** Link URL */
  href?: string;
  /** Tooltip text */
  tooltip?: string;
  /** Tooltip position */
  tooltipPosition?: "top" | "bottom" | "left" | "right";
}

export type ToggleButtonProps = CommonProps & React.ButtonHTMLAttributes<HTMLButtonElement>;

/**
 * A button component that can be toggled between selected and unselected states.
 */
const ToggleButtonComponent = forwardRef<HTMLElement, ToggleButtonProps>(
  (
    {
      label,
      selected,
      variant = "ghost",
      size = "m",
      radius,
      justifyContent = "center",
      fillWidth = false,
      weight = "default",
      truncate = false,
      prefixIcon,
      suffixIcon,
      className,
      style,
      children,
      href,
      tooltip,
      tooltipPosition = "top",
      onFocus,
      onBlur,
      ...props
    },
    ref,
  ) => {
    const [isTooltipVisible, setTooltipVisible] = useState(false);
    const [isHover, setIsHover] = useState(false);

    const handleFocus = (event: React.FocusEvent<HTMLButtonElement | HTMLAnchorElement>) => {
      setIsHover(true);
      if (onFocus) onFocus(event as any);
    };

    const handleBlur = (event: React.FocusEvent<HTMLButtonElement | HTMLAnchorElement>) => {
      setIsHover(false);
      if (onBlur) onBlur(event as any);
    };

    useEffect(() => {
      let timer: NodeJS.Timeout;
      if (isHover) {
        timer = setTimeout(() => {
          setTooltipVisible(true);
        }, 400);
      } else {
        setTooltipVisible(false);
      }

      return () => clearTimeout(timer);
    }, [isHover]);

    return (
      <ElementType
        ref={ref}
        href={href}
        className={classNames(
          styles.button,
          styles[variant],
          styles[size],
          selected && styles.selected,
          radius === "none"
            ? "radius-none"
            : radius
              ? `radius-${size}-${radius}`
              : `radius-${size}`,
          "text-decoration-none",
          "button",
          "cursor-interactive",
          {
            ["fill-width"]: fillWidth,
            ["fit-width"]: !fillWidth,
            ["justify-" + justifyContent]: justifyContent,
          },
          className,
        )}
        style={style}
        onMouseEnter={() => setIsHover(true)}
        onMouseLeave={() => setIsHover(false)}
        onFocus={handleFocus}
        onBlur={handleBlur}
        {...props}
      >
        {prefixIcon && <Icon name={prefixIcon} size={size === "l" ? "m" : "s"} />}
        {(label || children) && (
          <Flex
            padding={size === "s" ? "2" : "4"}
            textWeight={weight}
            textSize={size === "l" ? "m" : "s"}
            className="font-label"
          >
            {label || children}
          </Flex>
        )}
        {suffixIcon && <Icon name={suffixIcon} size={size === "l" ? "m" : "s"} />}
        {tooltip && isTooltipVisible && (
          <Flex position="absolute" zIndex={1} className={iconStyles[tooltipPosition]}>
            <Tooltip label={tooltip} />
          </Flex>
        )}
      </ElementType>
    );
  },
);

ToggleButtonComponent.displayName = "ToggleButton";

// Bolt: Memoized to prevent unnecessary re-renders in Header navigation where only one button state changes.
const ToggleButton = memo(ToggleButtonComponent);
ToggleButton.displayName = "ToggleButton";
export { ToggleButton };
