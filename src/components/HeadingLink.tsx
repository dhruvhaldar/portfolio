"use client";

import React from "react";
import { Heading, Flex, IconButton, useToast } from "@/once-ui/components";
import styles from "@/components/HeadingLink.module.scss";

interface HeadingLinkProps {
    /** The unique ID for the heading, used for the anchor link */
    id: string;
    /** The heading level (h1-h6) */
    level: 1 | 2 | 3 | 4 | 5 | 6;
    /** The content to be displayed within the heading */
    children: React.ReactNode;
    /** Optional inline styles */
    style?: React.CSSProperties;
}

/**
 * A heading component that includes a copy-to-clipboard link.
 * Shows a toast notification when the link is copied.
 */
export const HeadingLink: React.FC<HeadingLinkProps> = ({ id, level, children, style }) => {
    const { addToast } = useToast();

    const copyURL = (id: string): void => {
        const url = `${window.location.origin}${window.location.pathname}#${id}`;
        navigator.clipboard.writeText(url).then(
            () => {
                addToast({ variant: "success", message: "Link copied to clipboard." });
            },
            () => {
                addToast({ variant: "danger", message: "Failed to copy link." });
            },
        );
    };

    const variantMap = {
        1: "display-strong-xs",
        2: "heading-strong-xl",
        3: "heading-strong-l",
        4: "heading-strong-m",
        5: "heading-strong-s",
        6: "heading-strong-xs",
    } as const;

    const variant = variantMap[level];
    const asTag = `h${level}` as keyof JSX.IntrinsicElements;

    return (
        <Flex
            style={style}
            onClick={() => copyURL(id)}
            className={styles.control}
            vertical="center"
            gap="4"
        >
            <Heading className={styles.text} id={id} variant={variant} as={asTag}>
                {children}
            </Heading>
            <IconButton
                className={styles.visibility}
                size="s"
                icon="openLink"
                variant="ghost"
                tooltip="Copy"
                tooltipPosition="right"
            />
        </Flex>
    );
};
