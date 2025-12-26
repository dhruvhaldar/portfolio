"use client";

import { Row, Button, Text, Icon } from "@/once-ui/components";

interface ShareSectionProps {
  title: string;
  url: string;
}

export function ShareSection({ title, url }: ShareSectionProps) {
  const handleShare = async () => {
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
      // Fallback or clipboard copy
      navigator.clipboard.writeText(url);
      alert("Link copied to clipboard!");
    }
  };

  return (
    <Row gap="16" vertical="center" marginTop="32">
        <Button
            size="s"
            variant="secondary"
            onClick={handleShare}
            prefixIcon="share"
        >
            Share this post
        </Button>
    </Row>
  );
}
