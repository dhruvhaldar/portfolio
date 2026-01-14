import classNames from "classnames";
import type React from "react";
import { forwardRef } from "react";

import { Flex } from ".";
import styles from "./NavIcon.module.scss";

interface NavIconProps extends React.ComponentProps<typeof Flex> {
  /** Custom class name */
  className?: string;
  /** Custom styles */
  style?: React.CSSProperties;
  /** Click handler */
  onClick?: () => void;
  /** Whether the icon is active */
  isActive: boolean;
}

/**
 * A navigation icon component with an active state style.
 * Renders a hamburger-like icon that changes when active.
 */
const NavIcon = forwardRef<HTMLDivElement, NavIconProps>(
  ({ className, isActive, style, onClick, ...rest }, ref) => {
    return (
      <Flex
        ref={ref}
        tabIndex={0}
        radius="m"
        position="relative"
        cursor="interactive"
        width="40"
        height="40"
        minHeight="40"
        minWidth="40"
        className={className}
        style={style}
        onClick={onClick}
        {...rest}
      >
        <div className={classNames(styles.line, isActive && styles.active)} />
        <div className={classNames(styles.line, isActive && styles.active)} />
      </Flex>
    );
  },
);

NavIcon.displayName = "NavIcon";

export { NavIcon };
