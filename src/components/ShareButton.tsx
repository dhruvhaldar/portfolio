"use client";

import { Button } from "@/once-ui/components";

interface ShareButtonProps {
    url: string;
    title?: string;
    text?: string;
    style?: React.CSSProperties;
}

export function ShareButton({ url, title, text = "Share", style }: ShareButtonProps) {
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
            // Fallback to clipboard
            navigator.clipboard.writeText(url);
            alert("Link copied to clipboard!");
        }
    };

    return (
        <Button
            size="s"
            variant="secondary"
            onClick={handleShare}
            prefixIcon="share"
            style={style}
        >
            {text}
        </Button>
    );
}
