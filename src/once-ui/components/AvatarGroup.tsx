"use client";

import classNames from "classnames";
import type React from "react";
import { forwardRef } from "react";

import { Avatar, type AvatarProps, Flex } from ".";
import styles from "./AvatarGroup.module.scss";

interface AvatarGroupProps extends React.ComponentProps<typeof Flex> {
  /** List of avatars to display */
  avatars: AvatarProps[];
  /** Size of avatars: "xs" | "s" | "m" | "l" | "xl" */
  size?: "xs" | "s" | "m" | "l" | "xl";
  /** Reverse stacking order */
  reverse?: boolean;
  /** Maximum number of avatars to show */
  limit?: number;
  /** Custom class name */
  className?: string;
  /** Custom styles */
  style?: React.CSSProperties;
  /** Ref forwarded to the root Flex container */
  ref?: React.Ref<HTMLDivElement>;
}

/**
 * A component to display a stack of avatars.
 * Supports limiting the number of visible avatars.
 * Inherits all props from Flex component.
 */
const AvatarGroup = forwardRef<HTMLDivElement, AvatarGroupProps>(
  ({ avatars, size = "m", reverse = false, limit, className, style, ...rest }, ref) => {
    const displayedAvatars = limit ? avatars.slice(0, limit) : avatars;
    const remainingCount = limit && avatars.length > limit ? avatars.length - limit : 0;

    return (
      <Flex
        position="relative"
        vertical="center"
        ref={ref}
        className={classNames(styles.avatarGroup, className)}
        style={style}
        zIndex={0}
        {...rest}
      >
        {displayedAvatars.map((avatarProps, index) => (
          <Avatar
            position="relative"
            key={index}
            size={size}
            {...avatarProps}
            className={styles.avatar}
            style={{
              ...avatarProps.style,
              zIndex: reverse ? displayedAvatars.length - index : index + 1,
            }}
          />
        ))}
        {remainingCount > 0 && (
          <Avatar
            value={`+${remainingCount}`}
            className={styles.avatar}
            size={size}
            style={{
              ...style,
              zIndex: reverse ? -1 : displayedAvatars.length + 1,
            }}
          />
        )}
      </Flex>
    );
  },
);

AvatarGroup.displayName = "AvatarGroup";

export { AvatarGroup };
export type { AvatarGroupProps };
