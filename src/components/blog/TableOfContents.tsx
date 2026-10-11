"use client";

import React, { useEffect, useState, useRef, useCallback } from "react";
import { Column, Flex, SmartLink, Text } from "@/once-ui/components";

export interface TableOfContentsItem {
  label: string;
  id: string;
  level?: number;
}

interface TableOfContentsProps {
  items: TableOfContentsItem[];
}

const TableOfContents: React.FC<TableOfContentsProps> = ({ items }) => {
  const [activeId, setActiveId] = useState<string>("");
  const isClicked = useRef(false);
  const itemRefs = useRef<{ [key: string]: HTMLElement | null }>({});
  const [indicatorState, setIndicatorState] = useState<{
    top: number;
    height: number;
    visible: boolean;
  }>({
    top: 0,
    height: 24,
    visible: false,
  });

  const updateIndicator = useCallback(() => {
    if (!activeId) {
      setIndicatorState((prev) => ({ ...prev, visible: false }));
      return;
    }
    const activeEl = itemRefs.current[activeId];
    if (activeEl) {
      setIndicatorState({
        top: activeEl.offsetTop,
        height: Math.max(activeEl.offsetHeight, 20),
        visible: true,
      });
    } else {
      setIndicatorState((prev) => ({ ...prev, visible: false }));
    }
  }, [activeId]);

  useEffect(() => {
    const handleScroll = () => {
      if (isClicked.current) return;

      let currentId = "";
      for (const item of items) {
        const element = document.getElementById(item.id);
        if (element) {
          const rect = element.getBoundingClientRect();
          if (rect.top >= 0 && rect.top < 300) {
            currentId = item.id;
            break;
          } else if (rect.top < 0) {
            currentId = item.id;
          }
        }
      }
      setActiveId(currentId);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    window.addEventListener("resize", updateIndicator);
    handleScroll();
    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", updateIndicator);
    };
  }, [items, updateIndicator]);

  useEffect(() => {
    updateIndicator();
  }, [activeId, updateIndicator]);

  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
    e.preventDefault();
    isClicked.current = true;
    setActiveId(id);

    const element = document.getElementById(id);
    if (element) {
      const offset = 100;
      const bodyRect = document.body.getBoundingClientRect().top;
      const elementRect = element.getBoundingClientRect().top;
      const elementPosition = elementRect - bodyRect;
      const offsetPosition = elementPosition - offset;

      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth",
      });
    }

    window.history.pushState(null, "", `#${id}`);

    setTimeout(() => {
      isClicked.current = false;
    }, 1000);
  };

  return (
    <nav aria-label="Table of contents">
      <Flex gap="16">
        <Column
          minWidth="4"
          position="relative"
          radius="full"
          background="neutral-alpha-weak"
          style={{
            backdropFilter: "blur(var(--static-space-1))",
            boxShadow: "var(--static-shadow-1)",
          }}
        >
          <Column
            position="absolute"
            background="brand-strong"
            radius="full"
            fillWidth
            style={{
              height: `${indicatorState.height}px`,
              top: `${indicatorState.top}px`,
              transition:
                "top 0.25s cubic-bezier(0.4, 0, 0.2, 1), height 0.25s cubic-bezier(0.4, 0, 0.2, 1)",
              opacity: indicatorState.visible ? 1 : 0,
            }}
          />
        </Column>
        <Column gap="8" fillWidth>
          {items.map((item) => {
            const isSubItem = item.level === 3;
            const isActive = activeId === item.id;

            return (
              <SmartLink
                key={item.id}
                ref={(el: HTMLAnchorElement | null) => {
                  itemRefs.current[item.id] = el;
                }}
                href={`#${item.id}`}
                unstyled
                fillWidth
                onClick={(e) => handleClick(e, item.id)}
                aria-current={isActive ? "true" : undefined}
                aria-label={`Navigate to ${item.label} section`}
                style={{
                  display: "block",
                  paddingLeft: isSubItem ? "0.75rem" : "0",
                }}
              >
                <Flex
                  minHeight="24"
                  vertical="center"
                  style={{
                    padding: "0.25rem 0",
                  }}
                >
                  <Text
                    variant={isSubItem ? "body-default-xs" : "body-default-s"}
                    onBackground={isActive ? "neutral-strong" : "neutral-medium"}
                    style={{
                      transition: "color 0.2s",
                      textShadow: isActive ? "0 0 1px currentColor" : "none",
                      lineHeight: "1.4",
                      wordBreak: "break-word",
                    }}
                  >
                    {item.label}
                  </Text>
                </Flex>
              </SmartLink>
            );
          })}
        </Column>
      </Flex>
    </nav>
  );
};

export default TableOfContents;
