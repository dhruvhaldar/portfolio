"use client";

import React, { useState, useEffect, useRef, type ReactNode } from "react";
import "./CodeHighlight.css";
import {
  Button,
  DropdownWrapper,
  Flex,
  IconButton,
  Option,
  Spotlight,
  useToast,
} from "@/once-ui/components";
import Prism from "prismjs";
import styles from "./CodeBlock.module.scss";
import "prismjs/plugins/line-highlight/prism-line-highlight";
import "prismjs/components/prism-jsx";
import "prismjs/components/prism-css";
import "prismjs/components/prism-typescript";
import "prismjs/components/prism-tsx";
import classNames from "classnames";

type CodeInstance = {
  code: string;
  language: string;
  label: string;
};

interface CodeBlockProps extends React.ComponentProps<typeof Flex> {
  highlight?: string;
  codeInstances?: CodeInstance[];
  codePreview?: ReactNode;
  copyButton?: boolean;
  compact?: boolean;
  className?: string;
  style?: React.CSSProperties;
}

/**
 * A component to display code snippets with syntax highlighting and optional preview.
 * Includes a "Spotlight" effect and glassmorphism styling for visual enhancement.
 */
const CodeBlock: React.FC<CodeBlockProps> = ({
  highlight,
  codeInstances = [],
  codePreview,
  copyButton = true,
  compact = false,
  className,
  style,
  ...rest
}) => {
  const codeRef = useRef<HTMLElement>(null);
  const preRef = useRef<HTMLPreElement>(null);
  const [selectedInstance, setSelectedInstance] = useState(0);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const { code, language, label } = codeInstances[selectedInstance] || {
    code: "",
    language: "",
    label: "Select Code",
  };
  const [copyIcon, setCopyIcon] = useState<string>("clipboard");
  const { addToast } = useToast();

  // biome-ignore lint/correctness/useExhaustiveDependencies: code triggers re-highlighting implicitly via ref content
  useEffect(() => {
    if (codeRef.current && codeInstances.length > 0) {
      Prism.highlightElement(codeRef.current);
    }
  }, [code, codeInstances.length]);

  const handleCopy = () => {
    if (codeInstances.length > 0) {
      navigator.clipboard
        .writeText(code)
        .then(() => {
          setCopyIcon("check");
          addToast({ variant: "success", message: "Code copied to clipboard." });

          setTimeout(() => {
            setCopyIcon("clipboard");
          }, 5000);
        })
        .catch((err) => {
          console.error("Failed to copy code: ", err);
          addToast({ variant: "danger", message: "Failed to copy code." });
        });
    }
  };

  const handleContent = (selectedLabel: string) => {
    const index = codeInstances.findIndex((instance) => instance.label === selectedLabel);
    if (index !== -1) {
      setSelectedInstance(index);
    }
  };

  return (
    <Spotlight className="fill-width">
      <Flex
        position="relative"
        zIndex={0}
        radius="l"
        overflow="hidden"
        border="neutral-medium"
        direction="column"
        vertical="center"
        fillWidth
        minHeight={3}
        className={className}
        style={{
          ...style,
          backdropFilter: "blur(10px)",
          background: "var(--neutral-alpha-weak)",
        }}
        {...rest}
      >
        {(codeInstances.length > 1 || (copyButton && !compact)) && (
          <Flex borderBottom="neutral-medium" zIndex={2} fillWidth horizontal="space-between">
            {codeInstances.length > 1 ? (
              <Flex borderRight="neutral-medium">
                <DropdownWrapper
                  isOpen={isDropdownOpen}
                  onOpenChange={setIsDropdownOpen}
                  trigger={
                    <Button
                      style={{
                        border: "1px solid var(--static-transparent)",
                        minWidth: "6rem",
                      }}
                      radius="none"
                      size="m"
                      label={label}
                      suffixIcon="chevronDown"
                      variant="secondary"
                    />
                  }
                  dropdown={
                    <Flex direction="column" gap="2" padding="4" minWidth={6} data-surface="filled">
                      {codeInstances.map((instance, index) => (
                        <Option
                          // biome-ignore lint/suspicious/noArrayIndexKey: static list of instances
                          key={index}
                          value={instance.label}
                          label={instance.label}
                          selected={selectedInstance === index}
                          onClick={() => {
                            handleContent(instance.label);
                            setIsDropdownOpen(false);
                          }}
                        />
                      ))}
                    </Flex>
                  }
                />
              </Flex>
            ) : (
              <div />
            )}
            {copyButton && !compact && (
              <Flex borderLeft="neutral-medium">
                <IconButton
                  style={{
                    border: "none",
                  }}
                  radius="none"
                  size="l"
                  tooltip={copyIcon === "check" ? "Copied!" : "Copy"}
                  tooltipPosition="left"
                  variant="secondary"
                  onClick={handleCopy}
                  icon={copyIcon}
                />
              </Flex>
            )}
          </Flex>
        )}
        {codePreview && (
          <Flex
            position="relative"
            zIndex={1}
            fillHeight
            padding="l"
            horizontal="center"
            vertical="center"
          >
            {Array.isArray(codePreview)
              ? codePreview.map((item, index) => (
                  // biome-ignore lint/suspicious/noArrayIndexKey: static preview items
                  <React.Fragment key={index}>{item}</React.Fragment>
                ))
              : codePreview}
          </Flex>
        )}
        {codeInstances.length > 0 && (
          <Flex
            borderTop={!compact && codePreview ? "neutral-medium" : undefined}
            fillWidth
            position="relative"
          >
            {compact && copyButton && (
              <Flex
                className={styles.compactCopy}
                overflow="hidden"
                zIndex={1}
                right="8"
                position="absolute"
              >
                <IconButton
                  aria-label={copyIcon === "check" ? "Copied!" : "Copy code"}
                  onClick={handleCopy}
                  icon={copyIcon}
                  size="m"
                  variant="secondary"
                />
              </Flex>
            )}
            <Flex overflowX="auto">
              <pre
                data-line={highlight}
                ref={preRef}
                className={classNames(styles.pre, `language-${language}`)}
                tabIndex={-1}
              >
                <code ref={codeRef} className={classNames(styles.code, `language-${language}`)}>
                  {code}
                </code>
              </pre>
            </Flex>
          </Flex>
        )}
      </Flex>
    </Spotlight>
  );
};

CodeBlock.displayName = "CodeBlock";
export { CodeBlock };
