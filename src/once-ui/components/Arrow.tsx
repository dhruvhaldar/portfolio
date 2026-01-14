"use client";

import classNames from "classnames";
import { useEffect, useRef } from "react";
import { Flex } from ".";
import styles from "./Arrow.module.scss";

interface ArrowProps {
  /** CSS selector string for the element that triggers the arrow animation on hover */
  trigger: string;
  /** Scale factor for the arrow size (default: 0.8) */
  scale?: number;
  /** Color theme for the arrow. Use 'onBackground' for light backgrounds or 'onSolid' for solid backgrounds */
  color?: "onBackground" | "onSolid";
  /** Custom styles */
  style?: React.CSSProperties;
  /** Custom class name */
  className?: string;
}

/**
 * An animated arrow component that responds to hover events on a trigger element.
 *
 * @example
 * ```tsx
 * <Arrow trigger="#my-button" scale={1.2} color="onBackground" />
 * ```
 *
 * @remarks
 * The trigger element is located using document.querySelector. If the element
 * is not found, the arrow will render but won't respond to hover events.
 */
const Arrow: React.FC<ArrowProps> = ({
  trigger,
  scale = 0.8,
  color = "onBackground",
  style,
  className,
}) => {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const triggerElement = document.querySelector(trigger);

    if (triggerElement && ref.current) {
      const handleMouseOver = () => {
        ref.current?.classList.add(styles.active);
      };

      const handleMouseOut = () => {
        ref.current?.classList.remove(styles.active);
      };

      triggerElement.addEventListener("mouseenter", handleMouseOver);
      triggerElement.addEventListener("mouseleave", handleMouseOut);

      return () => {
        triggerElement.removeEventListener("mouseenter", handleMouseOver);
        triggerElement.removeEventListener("mouseleave", handleMouseOut);
      };
    }
  }, [trigger]);

  return (
    <Flex
      ref={ref}
      position="relative"
      vertical="center"
      horizontal="center"
      className={classNames(styles.arrowContainer, className)}
      style={{
        transform: `scale(${scale})`,
        ...style,
      }}
    >
      <Flex className={classNames(styles.arrow, styles[color])} height={0.1} />
      <Flex className={classNames(styles.arrowHead, styles[color])} height={0.0875} />
      <Flex className={classNames(styles.arrowHead, styles[color])} height={0.0875} />
    </Flex>
  );
};

Arrow.displayName = "Arrow";
export { Arrow };
