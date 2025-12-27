"use client";

import { Flex, SmartLink, Spotlight, Text, IconButton, Icon } from "@/once-ui/components";
import React, { useState } from 'react';
import styles from "./Posts.module.scss";
import { formatAuthors, formatYear } from "@/app/utils/formatCitation";

interface PostProps {
  /** The post data object */
  post: any;
  /** Whether to show a thumbnail image */
  thumbnail: boolean;
}

/**
 * Displays a single publication as an APA citation inside a glass card with copy functionality.
 */
export default function Post({ post }: PostProps) {
  const [copied, setCopied] = useState(false);
  const authors = formatAuthors(post.metadata.team);
  const year = formatYear(post.metadata.publishedAt);
  const title = post.metadata.title;
  const publication = post.metadata.journal || "Publication";
  const citationText = `${authors} (${year}). ${title}. ${publication}.`;

  const handleCopy = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    navigator.clipboard.writeText(citationText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <Spotlight
      className={`fill-width ${styles.citationHover}`}
      style={{
        display: 'flex',
        flexDirection: 'column',
        width: '100%',
        marginBottom: 'var(--static-space-16)',
        padding: 'var(--static-space-24)',
        borderRadius: 'var(--radius-l)',
        backdropFilter: 'blur(10px)',
        background: 'var(--neutral-alpha-weak)',
        border: '1px solid var(--neutral-alpha-medium)',
        transition: 'background 0.2s ease-in-out',
        cursor: 'pointer'
      }}
    >
      <Flex fillWidth gap="16" vertical="start" horizontal="space-between">
        <SmartLink
          unstyled
          key={post.slug}
          href={`/publications/${post.slug}`}
          style={{ flex: 1 }}
        >
          <Text variant="body-default-m" onBackground="neutral-strong">
            {authors} ({year}). <span style={{ fontWeight: 'bold' }}>{title}</span>. <span style={{ fontStyle: 'italic' }}>{publication}</span>.
          </Text>
        </SmartLink>
        <IconButton
          icon={copied ? "check" : "clipboard"}
          variant="ghost"
          onClick={handleCopy}
          tooltip={copied ? "Copied!" : "Copy citation"}
        />
      </Flex>
    </Spotlight>
  );
}
