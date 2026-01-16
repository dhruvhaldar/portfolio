"use client";

import classNames from "classnames";
import { CSSProperties, forwardRef } from "react";

import {
  CommonProps,
  ConditionalProps,
  DisplayProps,
  FlexProps,
  SizeProps,
  SpacingProps,
  StyleProps,
} from "../interfaces";
import { ColorScheme, ColorWeight } from "../types";
import { generateFlexClass, getVariantClasses, parseDimension } from "../utils/layout";

interface ComponentProps
  extends FlexProps,
  SpacingProps,
  SizeProps,
  StyleProps,
  CommonProps,
  DisplayProps,
  ConditionalProps { }

/**
 * A utility component for creating flexible layouts using CSS Flexbox.
 * Supports a wide range of props for controlling spacing, alignment, size, and styling.
 */
const Flex = forwardRef<HTMLDivElement, ComponentProps>(
  (
    {
      as: Component = "div",
      inline,
      direction,
      tabletDirection,
      mobileDirection,
      wrap = false,
      horizontal,
      vertical,
      flex,
      textVariant,
      textSize,
      textWeight,
      textType,
      onBackground,
      onSolid,
      align,
      top,
      right,
      bottom,
      left,
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
      gap,
      position,
      center,
      width,
      height,
      maxWidth,
      minWidth,
      minHeight,
      maxHeight,
      fit = false,
      fitWidth = false,
      fitHeight = false,
      fill = false,
      fillWidth = false,
      fillHeight = false,
      aspectRatio,
      hide,
      show,
      transition,
      background,
      solid,
      opacity,
      pointerEvents,
      border,
      borderTop,
      borderRight,
      borderBottom,
      borderLeft,
      borderStyle,
      borderWidth,
      radius,
      topRadius,
      rightRadius,
      bottomRadius,
      leftRadius,
      topLeftRadius,
      topRightRadius,
      bottomLeftRadius,
      bottomRightRadius,
      overflow,
      overflowX,
      overflowY,
      zIndex,
      shadow,
      cursor,
      className,
      style,
      children,
      ...rest
    },
    ref,
  ) => {
    if (onBackground && onSolid) {
      console.warn(
        "You cannot use both 'onBackground' and 'onSolid' props simultaneously. Only one will be applied.",
      );
    }

    if (background && solid) {
      console.warn(
        "You cannot use both 'background' and 'solid' props simultaneously. Only one will be applied.",
      );
    }

    const sizeClass = textSize ? `font-${textSize}` : "";
    const weightClass = textWeight ? `font-${textWeight}` : "";

    const variantClasses = textVariant ? getVariantClasses(textVariant) : [sizeClass, weightClass];

    let colorClass = "";
    if (onBackground) {
      const [scheme, weight] = onBackground.split("-") as [ColorScheme, ColorWeight];
      colorClass = `${scheme}-on-background-${weight}`;
    } else if (onSolid) {
      const [scheme, weight] = onSolid.split("-") as [ColorScheme, ColorWeight];
      colorClass = `${scheme}-on-solid-${weight}`;
    }

    const classes = classNames(
      inline ? "display-inline-flex" : "display-flex",
      padding && `p-${padding}`,
      paddingLeft && `pl-${paddingLeft}`,
      paddingRight && `pr-${paddingRight}`,
      paddingTop && `pt-${paddingTop}`,
      paddingBottom && `pb-${paddingBottom}`,
      paddingX && `px-${paddingX}`,
      paddingY && `py-${paddingY}`,
      margin && `m-${margin}`,
      marginLeft && `ml-${marginLeft}`,
      marginRight && `mr-${marginRight}`,
      marginTop && `mt-${marginTop}`,
      marginBottom && `mb-${marginBottom}`,
      marginX && `mx-${marginX}`,
      marginY && `my-${marginY}`,
      gap === "-1"
        ? direction === "column" || direction === "column-reverse"
          ? "g-vertical--1"
          : "g-horizontal--1"
        : gap && `g-${gap}`,
      top && `top-${top}`,
      right && `right-${right}`,
      bottom && `bottom-${bottom}`,
      left && `left-${left}`,
      generateFlexClass("background", background),
      generateFlexClass("solid", solid),
      generateFlexClass(
        "border",
        border || borderTop || borderRight || borderBottom || borderLeft,
      ),
      (border || borderTop || borderRight || borderBottom || borderLeft) &&
      !borderStyle &&
      "border-solid",
      border && !borderWidth && "border-1",
      (borderTop || borderRight || borderBottom || borderLeft) && "border-reset",
      borderTop && "border-top-1",
      borderRight && "border-right-1",
      borderBottom && "border-bottom-1",
      borderLeft && "border-left-1",
      borderWidth && `border-${borderWidth}`,
      borderStyle && `border-${borderStyle}`,
      radius === "full" ? "radius-full" : radius && `radius-${radius}`,
      topRadius && `radius-${topRadius}-top`,
      rightRadius && `radius-${rightRadius}-right`,
      bottomRadius && `radius-${bottomRadius}-bottom`,
      leftRadius && `radius-${leftRadius}-left`,
      topLeftRadius && `radius-${topLeftRadius}-top-left`,
      topRightRadius && `radius-${topRightRadius}-top-right`,
      bottomLeftRadius && `radius-${bottomLeftRadius}-bottom-left`,
      bottomRightRadius && `radius-${bottomRightRadius}-bottom-right`,
      direction && `flex-${direction}`,
      tabletDirection && `m-flex-${tabletDirection}`,
      mobileDirection && `s-flex-${mobileDirection}`,
      pointerEvents && `pointer-events-${pointerEvents}`,
      transition && `transition-${transition}`,
      hide && `${hide}-flex-hide`,
      show && `${show}-flex-show`,
      opacity && `opacity-${opacity}`,
      wrap && "flex-wrap",
      overflow && `overflow-${overflow}`,
      overflowX && `overflow-x-${overflowX}`,
      overflowY && `overflow-y-${overflowY}`,
      flex && `flex-${flex}`,
      horizontal &&
      (direction === "row" || direction === "row-reverse" || direction === undefined
        ? `justify-${horizontal}`
        : `align-${horizontal}`),
      vertical &&
      (direction === "row" || direction === "row-reverse" || direction === undefined
        ? `align-${vertical}`
        : `justify-${vertical}`),
      center && "center",
      fit && "fit",
      fitWidth && "fit-width",
      fitHeight && "fit-height",
      fill && "fill",
      fillWidth && !minWidth && "min-width-0",
      fillHeight && !minHeight && "min-height-0",
      (fillWidth || maxWidth) && "fill-width",
      (fillHeight || maxHeight) && "fill-height",
      shadow && `shadow-${shadow}`,
      position && `position-${position}`,
      zIndex && `z-index-${zIndex}`,
      textType && `font-${textType}`,
      cursor && `cursor-${cursor}`,
      colorClass,
      className,
      ...variantClasses,
    );

    const combinedStyle: CSSProperties = {
      maxWidth: parseDimension(maxWidth, "width"),
      minWidth: parseDimension(minWidth, "width"),
      minHeight: parseDimension(minHeight, "height"),
      maxHeight: parseDimension(maxHeight, "height"),
      width: parseDimension(width, "width"),
      height: parseDimension(height, "height"),
      aspectRatio: aspectRatio,
      textAlign: align,
      ...style,
    };

    return (
      <Component ref={ref} className={classes} style={combinedStyle} {...rest}>
        {children}
      </Component>
    );
  },
);

Flex.displayName = "Flex";
export { Flex };
