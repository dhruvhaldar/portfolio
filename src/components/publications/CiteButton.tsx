"use client";

import { SmartLink, Text } from "@/once-ui/components";
import { useState } from "react";
import { cleanCitationText } from "@/app/utils/formatCitation";

interface CiteButtonProps {
    citationText: string;
}

export default function CiteButton({ citationText }: CiteButtonProps) {
    const [copied, setCopied] = useState(false);

    const handleCopy = (e: React.MouseEvent) => {
        e.preventDefault();
        navigator.clipboard.writeText(cleanCitationText(citationText));
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
