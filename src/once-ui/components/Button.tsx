"use client";

import classNames from "classnames";
import type React from "react";
import { type ReactNode, forwardRef } from "react";
import { ElementType } from "./ElementType";

import { Arrow, Flex, Icon, Spinner } from ".";
import styles from "./Button.module.scss";

interface CommonProps {
  /** Visual variant of the button */
  variant?: "primary" | "secondary" | "tertiary" | "danger";
  /** Size of the button */
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
  /** Text label */
  label?: string;
  /** Font weight */
  weight?: "default" | "strong";
  /** Icon to display before text */
  prefixIcon?: string;
  /** Icon to display after text */
  suffixIcon?: string;
  /** Whether to show a loading spinner */
  loading?: boolean;
  /** Whether to fill available width */
  fillWidth?: boolean;
  /** Justification of content */
  justifyContent?: "flex-start" | "center" | "flex-end" | "space-between";
  /** Button content */
  children?: ReactNode;
  /** HREF for anchor link */
  href?: string;
  /** Custom class name */
  className?: string;
  /** Custom styles */
  style?: React.CSSProperties;
  /** Element ID */
  id?: string;
  /** Whether to show an arrow icon */
  arrowIcon?: boolean;
}

export type ButtonProps = CommonProps & React.ButtonHTMLAttributes<HTMLButtonElement>;
export type AnchorProps = CommonProps & React.AnchorHTMLAttributes<HTMLAnchorElement>;

/**
 * A flexible button component that can render as a button or an anchor link.
 * Supports various styles, sizes, icons, and loading states.
 */
const Button = forwardRef<HTMLButtonElement, ButtonProps | AnchorProps>(
  (
    {
      variant = "primary",
      size = "m",
      radius,
      label,
      weight = "strong",
      children,
      prefixIcon,
      suffixIcon,
      loading = false,
      fillWidth = false,
      justifyContent = "center",
      href,
      id,
      arrowIcon = false,
      className,
      style,
      ...props
    },
    ref,
  ) => {
    // biome-ignore lint/suspicious/noExplicitAny: ButtonHTMLAttributes includes disabled, but AnchorHTMLAttributes does not
    const isDisabled = (props as any).disabled || loading;
    const iconSize = size === "l" ? "s" : size === "m" ? "s" : "xs";
    const radiusSize = size === "s" || size === "m" ? "m" : "l";

    return (
      <ElementType
        id={id}
        href={href}
        ref={ref}
        disabled={isDisabled}
        aria-busy={loading ? "true" : undefined}
        className={classNames(
          styles.button,
          styles[variant],
          styles[size],
          radius === "none"
            ? "radius-none"
            : radius
              ? `radius-${radiusSize}-${radius}`
              : `radius-${radiusSize}`,
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
        {...props}
      >
        {prefixIcon && !loading && <Icon name={prefixIcon} size={iconSize} />}
        {loading && <Spinner size={size} />}
        {(label || children) && (
          <Flex
            paddingX="4"
            paddingY="0"
            textWeight={weight}
            textSize={size}
            className="font-label"
          >
            {label || children}
          </Flex>
        )}
        {arrowIcon && id && (
          <Arrow
            style={{
              marginLeft: "calc(-1 * var(--static-space-4))",
            }}
            trigger={"#" + id}
            scale={size === "s" ? 0.8 : size === "m" ? 0.9 : 1}
            color={variant === "primary" ? "onSolid" : "onBackground"}
          />
        )}
        {suffixIcon && <Icon name={suffixIcon} size={iconSize} />}
      </ElementType>
    );
  },
);

Button.displayName = "Button";
export { Button };
