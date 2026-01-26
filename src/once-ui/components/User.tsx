"use client";

import classNames from "classnames";
import type React from "react";
import { forwardRef, memo } from "react";

import { Avatar, type AvatarProps, Flex, Skeleton, Tag, type TagProps, Text } from ".";

interface UserProps {
  /** User name */
  name?: string;
  /** Custom content */
  children?: React.ReactNode;
  /** Subtitle text or element */
  subline?: React.ReactNode;
  /** Tag text */
  tag?: string;
  /** Tag properties */
  tagProps?: TagProps;
  /** Loading state */
  loading?: boolean;
  /** Avatar properties */
  avatarProps?: AvatarProps;
  /** Custom class name */
  className?: string;
}

/**
 * A user profile component that displays an avatar, name, and subline.
 */
const UserComponent = forwardRef<HTMLDivElement, UserProps>(
  (
    { name, children, subline, tagProps = {}, loading = false, avatarProps = {}, className },
    ref,
  ) => {
    const { src, value, empty, ...restAvatarProps } = avatarProps;
    const isEmpty = empty || (!src && !value);

    return (
      <Flex ref={ref} vertical="center" gap="8" className={classNames(className)}>
        <Avatar
          size="m"
          src={src}
          value={value}
          empty={isEmpty}
          loading={loading}
          {...restAvatarProps}
        />
        {children}
        {name && (
          <Flex direction="column" paddingLeft="4" paddingRight="12">
            {loading ? (
              <Flex minWidth={6} paddingY="4">
                <Skeleton width="xl" height="m" shape="line" aria-label="Loading name" />
              </Flex>
            ) : (
              <Flex gap="8" vertical="center">
                <Text variant="heading-strong-xs" onBackground="neutral-strong">
                  {name}
                </Text>
                {tagProps.label && (
                  <Tag size="s" {...tagProps}>
                    {tagProps.label}
                  </Tag>
                )}
              </Flex>
            )}
            {loading ? (
              <Flex paddingY="4">
                <Skeleton width="l" height="xs" shape="line" aria-label="Loading subline" />
              </Flex>
            ) : (
              <Text wrap="nowrap" variant="body-default-xs" onBackground="neutral-weak">
                {subline}
              </Text>
            )}
          </Flex>
        )}
      </Flex>
    );
  },
);

UserComponent.displayName = "User";

// Bolt: Memoize User to prevent unnecessary re-renders in lists/headers
const User = memo(UserComponent);
User.displayName = "User";

export { User };
export type { UserProps };
