"use client";

import React from "react";
import classNames from "classnames";
import { Flex, DropdownWrapper, User, UserProps } from ".";
import styles from "./UserMenu.module.scss";
import { DropdownWrapperProps } from "./DropdownWrapper";

interface UserMenuProps
  extends UserProps,
  Pick<DropdownWrapperProps, "minHeight" | "minWidth" | "maxWidth"> {
  /** Selected state */
  selected?: boolean;
  /** Dropdown content */
  dropdown?: React.ReactNode;
  /** Custom class name */
  className?: string;
  /** Custom styles */
  style?: React.CSSProperties;
}

/**
 * A user profile component that triggers a dropdown menu.
 */
const UserMenu: React.FC<UserMenuProps> = ({
  selected = false,
  dropdown,
  minWidth,
  maxWidth,
  minHeight,
  className,
  style,
  ...userProps
}) => {
  return (
    <DropdownWrapper
      minWidth={minWidth}
      maxWidth={maxWidth}
      minHeight={minHeight}
      style={{
        borderRadius: "var(--radius-full)",
      }}
      trigger={
        <Flex
          tabIndex={0}
          role="button"
          direction="column"
          padding="4"
          radius="full"
          cursor="interactive"
          border={selected ? "neutral-medium" : "transparent"}
          background={selected ? "neutral-strong" : "transparent"}
          className={classNames(className || "", selected ? styles.selected : "", styles.wrapper)}
          style={style}
        >
          <User {...userProps} />
        </Flex>
      }
      dropdown={<>{dropdown}</>}
    />
  );
};

UserMenu.displayName = "UserMenu";
export { UserMenu };
