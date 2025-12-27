"use client";

import React, { useState, useEffect } from "react";
import { Column, Flex, SmartLink, Text } from "@/once-ui/components";

interface TableOfContentsProps {
    items: {
        label: string;
        id: string;
    }[];
}

const TableOfContents: React.FC<TableOfContentsProps> = ({ items }) => {
    const [activeId, setActiveId] = useState<string>("");
    const isClicked = React.useRef(false);

    useEffect(() => {
        const handleScroll = () => {
            if (isClicked.current) return;

            let currentId = "";
            for (const item of items) {
                const element = document.getElementById(item.id);
                if (element) {
                    const rect = element.getBoundingClientRect();
                    if (rect.top >= 0 && rect.top < 300) { // Element is near top
                        currentId = item.id;
                        break;
                    } else if (rect.top < 0) { // Element passed top, could be the active section
                        currentId = item.id;
                    }
                }
            }
            setActiveId(currentId);
        }

        window.addEventListener("scroll", handleScroll);
        handleScroll(); // Initial check
        return () => window.removeEventListener("scroll", handleScroll);
    }, [items]);

    // Calculate relative top position for the indicator 
    // Height (32) + Gap (16) = 48px per item
    const activeIndex = items.findIndex((item) => item.id === activeId);
    const indicatorTop = activeIndex !== -1 ? activeIndex * 48 : 0;
    const showIndicator = activeIndex !== -1;

    const handleClick = (e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
        e.preventDefault();
        isClicked.current = true;
        setActiveId(id);

        const element = document.getElementById(id);
        if (element) {
            // Offset for sticky header if needed, but smooth scroll is key
            const offset = 100; // Adjust this value based on your header height
            const bodyRect = document.body.getBoundingClientRect().top;
            const elementRect = element.getBoundingClientRect().top;
            const elementPosition = elementRect - bodyRect;
            const offsetPosition = elementPosition - offset;

            window.scrollTo({
                top: offsetPosition,
                behavior: "smooth"
            });
        }

        // Optional: Update URL without jumping
        window.history.pushState(null, "", `#${id}`);

        setTimeout(() => {
            isClicked.current = false;
        }, 1000);
    };

    return (
        <Flex gap="16">
            <Column minWidth="4" position="relative" radius="full" background="neutral-alpha-weak" style={{ backdropFilter: "blur(var(--static-space-1))", boxShadow: "var(--static-shadow-1)" }}>
                <Column
                    position="absolute"
                    background="brand-strong"
                    radius="full"
                    fillWidth
                    style={{
                        height: "32px",
                        top: `${indicatorTop}px`,
                        transition: "top 0.3s ease-in-out",
                        opacity: showIndicator ? 1 : 0
                    }}
                />
            </Column>
            <Column gap="16">
                {items.map((item) => (
                    <SmartLink
                        key={item.id}
                        href={`#${item.id}`}
                        unstyled
                        onClick={(e) => handleClick(e, item.id)}
                    >
                        <Flex
                            height="32"
                            vertical="center"
                        >
                            <Text
                                variant="body-default-s"
                                onBackground={activeId === item.id ? "neutral-strong" : "neutral-medium"}
                                style={{
                                    transition: "color 0.2s",
                                    textShadow: activeId === item.id ? "0 0 1px currentColor" : "none"
                                }}
                            >
                                {item.label}
                            </Text>
                        </Flex>
                    </SmartLink>
                ))}
            </Column>
        </Flex>
    );
};

export default TableOfContents;
