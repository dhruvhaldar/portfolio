"use client";
import type React from "react";
import { forwardRef } from "react";
import { Flex, IconButton, type IconButtonProps, Text } from ".";
interface InteractiveDetailsProps {
  /** Label text */
  label?: React.ReactNode;
  /** Description text */
  description?: React.ReactNode;
  /** Info/Help button props */
  iconButtonProps?: IconButtonProps;
  /** Click handler */
  onClick: () => void;
  /** Custom class name */
  className?: string;
  /** Element ID */
  id?: string;
  /** Whether the input is required */
  required?: boolean;
}

/**
 * A component for displaying interactive details with a label and optional description.
 */
const InteractiveDetails: React.FC<InteractiveDetailsProps> = forwardRef<
  HTMLDivElement,
  InteractiveDetailsProps
>(({ label, description, iconButtonProps, onClick, className, id, required }, ref) => {
  return (
    <Flex ref={ref} direction="column" className={className} onClick={onClick} id={id}>
      <Flex gap="4" vertical="center">
        <Text as="span" variant="label-default-m" onBackground="neutral-strong">
          {label}
          {required && (
            <Text as="span" onBackground="danger-weak" aria-hidden="true">
              &nbsp;*
            </Text>
          )}
        </Text>
        {iconButtonProps?.tooltip && (
          <div onClick={(e) => e.stopPropagation()}>
            <IconButton size="s" variant="ghost" icon="helpCircle" {...iconButtonProps} />
          </div>
        )}
      </Flex>
      {description && (
        <Text as="span" variant="body-default-s" onBackground="neutral-weak">
          {description}
        </Text>
      )}
    </Flex>
  );
});

InteractiveDetails.displayName = "InteractiveDetails";

export { InteractiveDetails };
export type { InteractiveDetailsProps };
