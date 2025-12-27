"use client";

import { SmartLink, Text } from "@/once-ui/components";
import { useState } from "react";

interface CiteButtonProps {
    citationText: string;
}

export default function CiteButton({ citationText }: CiteButtonProps) {
    const [copied, setCopied] = useState(false);

    const handleCopy = (e: React.MouseEvent) => {
        e.preventDefault();
        // Robust cleaning: split by any newline sequence, trim parts, join with space
        const cleanText = citationText.split(/[\r\n]+/).map(part => part.trim()).join(" ").replace(/\s+/g, " ");
        navigator.clipboard.writeText(cleanText);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <SmartLink
            href="#"
            onClick={handleCopy}
            suffixIcon={copied ? "check" : "quote"}
            style={{ margin: "0", width: "fit-content", cursor: "pointer" }}
        >
            <Text variant="body-default-s">{copied ? "Copied" : "Cite"}</Text>
        </SmartLink>
    );
}
