"use client";

import { Button, useToast } from "@/once-ui/components";

interface ShareButtonProps {
    url: string;
    title?: string;
    text?: string;
    style?: React.CSSProperties;
}

export function ShareButton({ url, title, text = "Share", style }: ShareButtonProps) {
    const { addToast } = useToast();

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
            navigator.clipboard.writeText(url).then(() => {
                addToast({
                    variant: "success",
                    message: "Link copied to clipboard",
                });
            }).catch((err) => {
                console.error("Failed to copy:", err);
                addToast({
                    variant: "danger",
                    message: "Failed to copy link",
                });
            });
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
