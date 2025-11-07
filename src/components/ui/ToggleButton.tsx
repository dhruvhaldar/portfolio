"use client";

import React, { forwardRef, ReactNode } from "react";
import classNames from "classnames";
import styles from "./ToggleButton.module.scss";

export type IconName = string; // Define your icon names as needed

interface CommonProps {
  label?: ReactNode;
  selected?: boolean;
  variant?: "ghost" | "outline";
  size?: "s" | "m" | "l";
  radius?: string;
  horizontal?: "start" | "center" | "end" | "between";
  fillWidth?: boolean;
  weight?: "default" | "strong";
  prefixIcon?: IconName;
  suffixIcon?: IconName;
  className?: string;
  style?: React.CSSProperties;
  children?: ReactNode;
  href?: string;
  onClick?: () => void;
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

const ToggleButton = forwardRef<HTMLElement, ToggleButtonProps>(
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
    },
    ref,
  ) => {
    const Element = href ? 'a' : 'button';
    
    return (
      <Element
        ref={ref as any}
        href={href}
        className={classNames(
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
        )}
        style={style}
        {...props}
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
      </Element>
    );
  },
);

ToggleButton.displayName = "ToggleButton";

export { ToggleButton };
