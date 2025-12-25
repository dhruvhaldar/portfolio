"use client";

import React, { forwardRef, ReactNode } from "react";
import classNames from "classnames";
import styles from "./ToggleButton.module.scss";

export type IconName = string; // Define your icon names as needed

interface CommonProps {
  /** content to display next to the icon */
  label?: ReactNode;
  /** whether the button is selected/active */
  selected?: boolean;
  /** visual variant of the button */
  variant?: "ghost" | "outline";
  /** size of the button */
  size?: "s" | "m" | "l";
  /** border radius */
  radius?: string;
  /** horizontal alignment of content */
  horizontal?: "start" | "center" | "end" | "between";
  /** whether to fill the width of the container */
  fillWidth?: boolean;
  /** font weight */
  weight?: "default" | "strong";
  /** icon to display before the label */
  prefixIcon?: IconName;
  /** icon to display after the label */
  suffixIcon?: IconName;
  /** custom class name */
  className?: string;
  /** custom inline styles */
  style?: React.CSSProperties;
  /** button content */
  children?: ReactNode;
  /** if provided, renders as an anchor link */
  href?: string;
  /** click handler */
  onClick?: () => void;
  /** accessible label */
  'aria-label'?: string;
}

export type ToggleButtonProps = CommonProps & React.ButtonHTMLAttributes<HTMLButtonElement>;

const Icon = ({ name, size = 's' }: { name: string; size?: 'xs' | 's' | 'm' }) => {
  const sizeMap = {
    'xs': '0.875rem',
    's': '1rem',
    'm': '1.25rem'
  };

  const iconSize = sizeMap[size] || '1rem';

  const icons: Record<string, JSX.Element> = {
    sun: (
      <svg stroke="currentColor" fill="none" strokeWidth="1.5" viewBox="0 0 24 24"
        aria-hidden="true" height={iconSize} width={iconSize} xmlns="http://www.w3.org/2000/svg">
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v2.25m6.364.386l-1.591 1.591M21 12h-2.25m-.386 6.364l-1.591-1.591M12 18.75V21m-4.773-4.227l-1.591 1.591M5.25 12H3m4.227-4.773L5.636 5.636M15.75 12a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0z" />
      </svg>
    ),
    moon: (
      <svg stroke="currentColor" fill="none" strokeWidth="1.5" viewBox="0 0 24 24"
        aria-hidden="true" height={iconSize} width={iconSize} xmlns="http://www.w3.org/2000/svg">
        <path strokeLinecap="round" strokeLinejoin="round" d="M21.752 15.002A9.72 9.72 0 0 1 18 15.75c-5.385 0-9.75-4.365-9.75-9.75 0-1.33.266-2.597.748-3.752A9.753 9.753 0 0 0 3 11.25C3 16.635 7.365 21 12.75 21a9.753 9.753 0 0 0 9.002-5.998z" />
      </svg>
    )
  };

  return (
    <span className="display-inline-flex position-relative fit color-inherit" aria-hidden="true">
      {icons[name] || <span>{name}</span>}
    </span>
  );
};

type ButtonOrAnchorProps = ToggleButtonProps & {
  ref?: React.Ref<HTMLButtonElement | HTMLAnchorElement>;
};

const ToggleButton = forwardRef<HTMLButtonElement | HTMLAnchorElement, ToggleButtonProps>(
  (
    {
      label,
      selected = false,
      variant = "ghost",
      size = "m",
      radius,
      horizontal = "center",
      fillWidth = false,
      weight = "default",
      prefixIcon,
      suffixIcon,
      className,
      style,
      children,
      href,
      ...props
    }: ButtonOrAnchorProps,
    ref,
  ) => {
    const buttonClassName = classNames(
      styles.button || 'button',
      styles[variant] || `variant-${variant}`,
      styles[size] || `size-${size}`,
      selected && (styles.selected || 'selected'),
      radius && `radius-${radius}`,
      {
        'fill-width': fillWidth,
        'justify-center': horizontal === 'center',
        'justify-start': horizontal === 'start',
        'justify-end': horizontal === 'end',
        'justify-between': horizontal === 'between',
        'font-strong': weight === 'strong',
      },
      className,
    );

    if (href) {
      return (
        <a
          ref={ref as React.Ref<HTMLAnchorElement>}
          href={href}
          className={buttonClassName}
          style={style}
          {...props as React.AnchorHTMLAttributes<HTMLAnchorElement>}
        >
          {prefixIcon && <Icon name={prefixIcon} size={size === "l" ? "s" : "xs"} />}
          {(label || children) && (
            <span className={classNames("label", {
              'ml-2': prefixIcon,
              'mr-2': suffixIcon,
            })}>
              {label || children}
            </span>
          )}
          {suffixIcon && <Icon name={suffixIcon} size={size === "l" ? "s" : "xs"} />}
        </a>
      );
    }

    return (
      <button
        ref={ref as React.Ref<HTMLButtonElement>}
        type="button"
        className={buttonClassName}
        style={style}
        {...props as React.ButtonHTMLAttributes<HTMLButtonElement>}
      >
        {prefixIcon && <Icon name={prefixIcon} size={size === "l" ? "s" : "xs"} />}
        {(label || children) && (
          <span className={classNames("label", {
            'ml-2': prefixIcon,
            'mr-2': suffixIcon,
          })}>
            {label || children}
          </span>
        )}
        {suffixIcon && <Icon name={suffixIcon} size={size === "l" ? "s" : "xs"} />}
      </button>
    );
  },
);

ToggleButton.displayName = "ToggleButton";

export { ToggleButton };
