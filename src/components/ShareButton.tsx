"use client";

import { useState } from "react";
import styles from "@/components/ShareButton.module.scss";
import { Button, useToast } from "@/once-ui/components";

interface ShareButtonProps {
  url: string;
  title?: string;
  text?: string;
  style?: React.CSSProperties;
}

export function ShareButton({ url, title, text = "Share", style }: ShareButtonProps) {
  const { addToast } = useToast();
  const [isSharing, setIsSharing] = useState(false);

  const handleShare = async () => {
    setIsSharing(true);
    try {
      if (navigator.share) {
        try {
          await navigator.share({
            title,
            url,
          });
        } catch (err) {
          console.error("Error sharing:", err);
        }
      } else {
        // Fallback to clipboard
        await navigator.clipboard.writeText(url);
        addToast({
          variant: "success",
          message: "Link copied to clipboard",
        });
      }
    } catch (err) {
      console.error("Failed to copy:", err);
      addToast({
        variant: "danger",
        message: "Failed to copy link",
      });
    } finally {
      setIsSharing(false);
    }
  };

  return (
    <Button
      size="s"
      variant="secondary"
      onClick={handleShare}
      prefixIcon="share"
      style={style}
      className={styles.glassy}
      loading={isSharing}
      aria-label={title ? `Share ${title}` : "Share project"}
    >
      {text}
    </Button>
  );
}
