import Link from "next/link";
import type React from "react";
import { type ReactNode, forwardRef } from "react";

import { isSafeUrl } from "@/app/utils/security";

interface ElementTypeProps {
  /** Link URL. If present, renders an anchor or Link. */
  href?: string;
  /** Content children */
  children: ReactNode;
  /** Custom class name */
  className?: string;
  /** Custom styles */
  style?: React.CSSProperties;
  /** Additional HTML attributes passed to the underlying element (anchor, Link, or button) */
  [key: string]: any;
}

// 🛡️ Sentinel: Fix Reverse Tabnabbing by catching protocol-relative URLs
const isExternalLink = (url: string) => /^(https?:)?\/\//.test(url);

/**
 * A polymorphic component that renders as a Link, anchor, or button based on props.
 * Handles external links automatically.
 * Supports ref forwarding to the underlying element.
 */
const ElementType = forwardRef<HTMLElement, ElementTypeProps>(
  ({ href, children, className, style, ...props }, ref) => {
    if (href) {
      // 🛡️ Sentinel: Validate href to prevent XSS via dangerous schemes
      // We strictly allow only specific protocols or relative paths.
      if (!isSafeUrl(href)) {
        console.error(`Security: Blocked dangerous URL scheme in ElementType: ${href}`);
        return (
          <button
            ref={ref as React.Ref<HTMLButtonElement>}
            className={className}
            style={style}
            disabled
            {...props}
          >
            {children}
          </button>
        );
      }

      const isExternal = isExternalLink(href);
      if (isExternal) {
        return (
          <a
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            ref={ref as React.Ref<HTMLAnchorElement>}
            className={className}
            style={style}
            {...(props as React.AnchorHTMLAttributes<HTMLAnchorElement>)}
          >
            {children}
            <span className="sr-only"> (opens in a new tab)</span>
          </a>
        );
      }
      // 🛡️ Sentinel: Enforce noopener noreferrer for all target="_blank" links (internal included)
      // to prevent reverse tabnabbing and improve performance.
      const target = (props as any).target;
      const rel = (props as any).rel || (target === "_blank" ? "noopener noreferrer" : undefined);

      return (
        <Link
          href={href}
          ref={ref as React.Ref<HTMLAnchorElement>}
          className={className}
          style={style}
          {...(props as React.AnchorHTMLAttributes<HTMLAnchorElement>)}
          rel={rel}
        >
          {children}
        </Link>
      );
    }
    return (
      <button
        ref={ref as React.Ref<HTMLButtonElement>}
        className={className}
        style={style}
        {...(props as React.ButtonHTMLAttributes<HTMLButtonElement>)}
      >
        {children}
      </button>
    );
  },
);

ElementType.displayName = "ElementType";
export { ElementType };
