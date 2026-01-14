"use client";

import classNames from "classnames";
import type React from "react";
import { type ReactNode, forwardRef } from "react";
import { Icon } from ".";
import { ElementType } from "./ElementType";

interface CommonProps {
  /** Icon to display before text */
  prefixIcon?: string;
  /** Icon to display after text */
  suffixIcon?: string;
  /** Whether to fill available width */
  fillWidth?: boolean;
  /** Size of the icons */
  iconSize?: "xs" | "s" | "m" | "l" | "xl";
  /** Selected state */
  selected?: boolean;
  /** Whether to remove default styling */
  unstyled?: boolean;
  /** Content children */
  children: ReactNode;
  /** HREF URL */
  href?: string;
  /** Custom styles */
  style?: React.CSSProperties;
  /** Custom class name */
  className?: string;
}

export type SmartLinkProps = CommonProps & React.AnchorHTMLAttributes<HTMLAnchorElement>;

/**
 * A flexible link component that enhances Next.js Link.
 * Supports icons, active states, and styling variants.
 */
const SmartLink = forwardRef<HTMLAnchorElement, SmartLinkProps>(
  (
    {
      href,
      prefixIcon,
      suffixIcon,
      fillWidth = false,
      iconSize = "xs",
      style,
      className,
      selected,
      unstyled = false,
      children,
      ...props
    },
    ref,
  ) => {
    const content = (
      <>
        {prefixIcon && <Icon name={prefixIcon} size={iconSize} />}
        {children}
        {suffixIcon && <Icon name={suffixIcon} size={iconSize} />}
      </>
    );

    const commonProps = {
      ref,
      className: classNames(className, "align-items-center display-inline-flex g-8 radius-s", {
        "fill-width": fillWidth,
        "fit-width": !fillWidth,
        "px-4 mx-4": !unstyled,
      }),
      style: !unstyled
        ? {
            ...(selected && {
              textDecoration: "underline",
            }),
            ...style,
          }
        : {
            textDecoration: "none",
            ...style,
          },
      ...props,
    };

    return (
      <ElementType href={href} {...commonProps}>
        {content}
      </ElementType>
    );
  },
);

SmartLink.displayName = "SmartLink";

export { SmartLink };
