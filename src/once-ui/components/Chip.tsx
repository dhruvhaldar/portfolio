"use client";

import classNames from "classnames";
import type React from "react";
import { type MouseEventHandler, type ReactNode, forwardRef } from "react";
import { Flex, Icon, IconButton, type IconButtonProps, Text } from ".";
import styles from "./Chip.module.scss";

interface ChipProps extends React.ComponentProps<typeof Flex> {
  /** Label text */
  label: string;
  /** Selected state */
  selected?: boolean;
  /** Icon before text */
  prefixIcon?: string;
  /** Remove handler */
  onRemove?: () => void;
  /** Click handler */
  onClick?: MouseEventHandler<HTMLDivElement>;
  /** Content children */
  children?: ReactNode;
  /** Props forwarded to the remove icon button */
  iconButtonProps?: Partial<IconButtonProps>;
  /** Custom styles */
  style?: React.CSSProperties;
  /** Custom class name */
  className?: string;
}

/**
 * A compact interactive element, often used for filters or selections.
 * Supports distinct states and removal action.
 */
const Chip: React.FC<ChipProps> = forwardRef<HTMLDivElement, ChipProps>(
  (
    {
      label,
      selected = true,
      prefixIcon,
      onRemove,
      onClick,
      children,
      iconButtonProps = {},
      ...rest
    },
    ref,
  ) => {
    const defaultIconButtonProps: IconButtonProps = {
      icon: "close",
      variant: "ghost",
      size: "s",
      tooltip: "Remove",
      onClick: (e) => {
        e.stopPropagation();
        if (onRemove) onRemove();
      },
    };

    const combinedIconButtonProps = {
      ...defaultIconButtonProps,
      ...iconButtonProps,
      onClick: (e: React.MouseEvent<HTMLButtonElement>) => {
        defaultIconButtonProps.onClick?.(e);
        iconButtonProps.onClick?.(e);
      },
    };

    const handleKeyDown: React.KeyboardEventHandler<HTMLDivElement> = (e) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        if (onClick) onClick(e as unknown as React.MouseEvent<HTMLDivElement>);
      }
    };

    const isInteractive = !!onClick;

    return (
      <Flex
        ref={ref}
        fit
        vertical="center"
        radius="full"
        paddingX="8"
        paddingY="4"
        role={isInteractive ? "button" : undefined}
        tabIndex={isInteractive ? 0 : undefined}
        onClick={onClick}
        onKeyDown={isInteractive ? handleKeyDown : undefined}
        aria-pressed={isInteractive ? selected : undefined}
        cursor={isInteractive ? "interactive" : undefined}
        transition="micro-medium"
        className={classNames(styles.chip, {
          [styles.selected]: selected,
          [styles.unselected]: !selected,
        })}
        {...rest}
      >
        {prefixIcon && <Icon name={prefixIcon} size="s" />}
        <Flex paddingX="8" paddingY="2">
          <Text variant="body-default-s">{label || children}</Text>
        </Flex>
        {onRemove && (
          <IconButton
            style={{
              color: "inherit",
            }}
            {...combinedIconButtonProps}
          />
        )}
      </Flex>
    );
  },
);

Chip.displayName = "Chip";

export { Chip };
