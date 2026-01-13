"use client";

import React, { forwardRef, useState, useEffect, ReactNode, memo } from "react";
import classNames from "classnames";
import { IconType } from "react-icons";
import { iconLibrary } from "../icons";
import { ColorScheme, ColorWeight } from "../types";
import { Flex, Tooltip } from ".";
import styles from "./Icon.module.scss";
import iconStyles from "./IconButton.module.scss";

interface IconProps extends React.ComponentProps<typeof Flex> {
  /** Name of the icon to render */
  name: string;
  /** Background color style */
  onBackground?: `${ColorScheme}-${ColorWeight}`;
  /** Solid background style */
  onSolid?: `${ColorScheme}-${ColorWeight}`;
  /** Size of the icon */
  size?: "xs" | "s" | "m" | "l" | "xl";
  /** Whether the icon is decorative (hidden from assistive tech) */
  decorative?: boolean;
  /** Tooltip text */
  tooltip?: ReactNode;
  /** Tooltip position */
  tooltipPosition?: "top" | "bottom" | "left" | "right";
}

const getIconClasses = (
  size: string,
  onBackground?: string,
  onSolid?: string,
) => {
  let colorClass = "color-inherit";

  if (onBackground) {
    const [scheme, weight] = onBackground.split("-") as [
      ColorScheme,
      ColorWeight,
    ];
    colorClass = `${scheme}-on-background-${weight}`;
  } else if (onSolid) {
    const [scheme, weight] = onSolid.split("-") as [ColorScheme, ColorWeight];
    colorClass = `${scheme}-on-solid-${weight}`;
  }

  return classNames(colorClass, styles.icon, styles[size]);
};

// Bolt: Heavy component handling tooltip state and effects
const IconWithTooltip = forwardRef<HTMLDivElement, IconProps>(
  (
    {
      name,
      onBackground,
      onSolid,
      size = "m",
      decorative = true,
      tooltip,
      tooltipPosition = "top",
      onFocus,
      onBlur,
      ...rest
    },
    ref,
  ) => {
    const [isTooltipVisible, setTooltipVisible] = useState(false);
    const [isHover, setIsHover] = useState(false);
    const IconC: IconType | undefined = iconLibrary[name];

    const handleFocus = (event: React.FocusEvent<HTMLDivElement>) => {
      setIsHover(true);
      if (onFocus) onFocus(event as any);
    };

    const handleBlur = (event: React.FocusEvent<HTMLDivElement>) => {
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

    if (!IconC) {
      console.warn(`Icon "${name}" does not exist in the library.`);
      return null;
    }

    if (onBackground && onSolid) {
      console.warn(
        "You cannot use both 'onBackground' and 'onSolid' props simultaneously. Only one will be applied.",
      );
    }

    const classes = getIconClasses(size, onBackground, onSolid);

    return (
      <Flex
        inline
        fit
        position="relative"
        as="div"
        ref={ref}
        className={classes}
        role={decorative ? "presentation" : undefined}
        aria-hidden={decorative ? "true" : undefined}
        aria-label={decorative ? undefined : name}
        onMouseEnter={() => setIsHover(true)}
        onMouseLeave={() => setIsHover(false)}
        onFocus={handleFocus}
        onBlur={handleBlur}
        {...rest}
      >
        <IconC />
        {isTooltipVisible && (
          <Flex
            position="absolute"
            zIndex={1}
            className={iconStyles[tooltipPosition]}
          >
            <Tooltip label={tooltip} />
          </Flex>
        )}
      </Flex>
    );
  },
);
IconWithTooltip.displayName = "IconWithTooltip";

// Bolt: Lightweight component for icons without tooltips (no state/hooks)
const BasicIcon = forwardRef<HTMLDivElement, IconProps>(
  (
    {
      name,
      onBackground,
      onSolid,
      size = "m",
      decorative = true,
      tooltip, // Unused
      tooltipPosition, // Unused
      ...rest
    },
    ref,
  ) => {
    const IconC: IconType | undefined = iconLibrary[name];

    if (!IconC) {
      console.warn(`Icon "${name}" does not exist in the library.`);
      return null;
    }

    if (onBackground && onSolid) {
      console.warn(
        "You cannot use both 'onBackground' and 'onSolid' props simultaneously. Only one will be applied.",
      );
    }

    const classes = getIconClasses(size, onBackground, onSolid);

    return (
      <Flex
        inline
        fit
        position="relative"
        as="div"
        ref={ref}
        className={classes}
        role={decorative ? "presentation" : undefined}
        aria-hidden={decorative ? "true" : undefined}
        aria-label={decorative ? undefined : name}
        {...rest}
      >
        <IconC />
      </Flex>
    );
  },
);
BasicIcon.displayName = "BasicIcon";

/**
 * Renders an icon from the icon library.
 * Supports coloring, sizing, and tooltips.
 */
const IconComponent = forwardRef<HTMLDivElement, IconProps>((props, ref) => {
  if (props.tooltip) {
    return <IconWithTooltip {...props} ref={ref} />;
  }
  return <BasicIcon {...props} ref={ref} />;
});

IconComponent.displayName = "IconComponent";

// Bolt: Memoize Icon to prevent unnecessary re-renders of this frequently used leaf component
const Icon = memo(IconComponent);
Icon.displayName = "Icon";

export { Icon };
