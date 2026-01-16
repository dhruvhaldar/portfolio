"use client";

import React, { ElementType, ComponentPropsWithoutRef } from "react";
import classNames from "classnames";

import { TextProps, CommonProps, SpacingProps } from "../interfaces";
import { ColorScheme, ColorWeight } from "../types";
import { generateTextSpacerClass, getVariantClasses } from "../utils/layout";

type TypeProps<T extends ElementType> = TextProps<T> &
  CommonProps &
  SpacingProps &
  ComponentPropsWithoutRef<T>;

/**
 * A universal typography component.
 * Supports variants, responsive sizing, and alignment.
 */
const Text = <T extends ElementType = "span">({
  as,
  variant,
  size,
  weight,
  onBackground,
  onSolid,
  align,
  wrap,
  padding,
  paddingLeft,
  paddingRight,
  paddingTop,
  paddingBottom,
  paddingX,
  paddingY,
  margin,
  marginLeft,
  marginRight,
  marginTop,
  marginBottom,
  marginX,
  marginY,
  children,
  style,
  className,
  ...props
}: TypeProps<T>) => {
  const Component = as || "span";

  if (variant && (size || weight)) {
    console.warn("When 'variant' is set, 'size' and 'weight' are ignored.");
  }

  if (onBackground && onSolid) {
    console.warn(
      "You cannot use both 'onBackground' and 'onSolid' props simultaneously. Only one will be applied.",
    );
  }

  const sizeClass = size ? `font-${size}` : "";
  const weightClass = weight ? `font-${weight}` : "";

  const classes = variant ? getVariantClasses(variant) : [sizeClass, weightClass];

  let colorClass = "";
  if (onBackground) {
    const [scheme, weight] = onBackground.split("-") as [ColorScheme, ColorWeight];
    colorClass = `${scheme}-on-background-${weight}`;
  } else if (onSolid) {
    const [scheme, weight] = onSolid.split("-") as [ColorScheme, ColorWeight];
    colorClass = `${scheme}-on-solid-${weight}`;
  }

  const combinedClasses = classNames(
    ...classes,
    colorClass,
    className,
    generateTextSpacerClass("p", padding),
    generateTextSpacerClass("pl", paddingLeft),
    generateTextSpacerClass("pr", paddingRight),
    generateTextSpacerClass("pt", paddingTop),
    generateTextSpacerClass("pb", paddingBottom),
    generateTextSpacerClass("px", paddingX),
    generateTextSpacerClass("py", paddingY),
    generateTextSpacerClass("m", margin),
    generateTextSpacerClass("ml", marginLeft),
    generateTextSpacerClass("mr", marginRight),
    generateTextSpacerClass("mt", marginTop),
    generateTextSpacerClass("mb", marginBottom),
    generateTextSpacerClass("mx", marginX),
    generateTextSpacerClass("my", marginY),
  );

  return (
    <Component
      className={combinedClasses}
      style={{
        textAlign: align,
        textWrap: wrap,
        ...style,
      }}
      {...props}
    >
      {children}
    </Component>
  );
};

Text.displayName = "Text";

export { Text };
