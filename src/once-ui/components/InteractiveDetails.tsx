"use client"; import React, { forwardRef } from "react"; import { Text, Flex, IconButton, IconButtonProps } from "."; interface InteractiveDetailsProps {
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
}

/**
 * A component for displaying interactive details with a label and optional description.
 */
const InteractiveDetails: React.FC<InteractiveDetailsProps> = forwardRef<
  HTMLDivElement,
  InteractiveDetailsProps
>(({ label, description, iconButtonProps, onClick, className, id }, ref) => {
  return (
    <Flex ref={ref} direction="column" className={className} onClick={onClick} id={id}>
      <Flex gap="4" vertical="center">
        <Text as="span" variant="label-default-m" onBackground="neutral-strong">
          {label}
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
