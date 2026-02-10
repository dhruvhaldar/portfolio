"use client";

import React, { useState, forwardRef, useImperativeHandle, useId } from "react";
import { Flex, Icon, Heading, Column } from ".";
import styles from "./Accordion.module.scss";

interface AccordionProps extends Omit<React.ComponentProps<typeof Flex>, "title"> {
  /** The title of the accordion header */
  title: React.ReactNode;
  /** The content to be displayed when expanded */
  children: React.ReactNode;
  /** Whether the accordion is open by default */
  open?: boolean;
}

/**
 * A collapsible accordion component.
 * Supports expanding and collapsing content with animation.
 * 
 * @remarks
 * The component is ref-forwarded and exposes imperative methods:
 * - `toggle()`: Toggle the accordion open/closed state
 * - `open()`: Programmatically open the accordion
 * - `close()`: Programmatically close the accordion
 */
const Accordion: React.FC<AccordionProps> = forwardRef(
  ({ title, children, open = false, ...rest }, ref) => {
    const [isOpen, setIsOpen] = useState(open);
    const uniqueId = useId();
    const contentId = `accordion-content-${uniqueId}`;

    const toggleAccordion = () => {
      setIsOpen(!isOpen);
    };

    const handleKeyDown = (event: React.KeyboardEvent) => {
      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        toggleAccordion();
      }
    };

    useImperativeHandle(ref, () => ({
      ...((ref as React.MutableRefObject<HTMLDivElement>)?.current ?? {}),
      toggle: toggleAccordion,
      open: () => {
        setIsOpen(true);
      },
      close: () => {
        setIsOpen(false);
      },
    }));

    return (
      <Flex fillWidth direction="column" className={styles.border}>
        <Flex
          tabIndex={0}
          role="button"
          className={styles.accordion}
          cursor="pointer"
          transition="macro-medium"
          paddingY="16"
          paddingX="20"
          vertical="center"
          horizontal="space-between"
          onClick={toggleAccordion}
          onKeyDown={handleKeyDown}
          aria-expanded={isOpen}
          aria-controls={contentId}
        >
          <Heading as="h3" variant="heading-strong-s">
            {title}
          </Heading>
          <Icon
            name="chevronDown"
            size="m"
            style={{
              display: "flex",
              transform: isOpen ? "rotate(180deg)" : "rotate(0deg)",
              transition: "var(--transition-micro-medium)",
            }}
          />
        </Flex>
        <Flex
          id={contentId}
          fillWidth
          style={{
            display: "grid",
            gridTemplateRows: isOpen ? "1fr" : "0fr",
            transition:
              "grid-template-rows var(--transition-duration-macro-medium) var(--transition-eased)",
          }}
          aria-hidden={!isOpen}
          // @ts-expect-error: inert is a valid HTML attribute but might be missing from some React type definitions
          inert={!isOpen ? "true" : undefined}
        >
          <Flex fillWidth minHeight={0} overflow="hidden">
            <Column fillWidth paddingX="20" paddingTop="8" paddingBottom="16" {...rest}>
              {children}
            </Column>
          </Flex>
        </Flex>
      </Flex>
    );
  },
);

Accordion.displayName = "Accordion";
export { Accordion };
