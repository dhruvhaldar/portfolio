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

      // 🛡️ Sentinel: Ensure internal links opening in new tab have security attributes
      // Prevents Reverse Tabnabbing on internal resources (like PDFs or redirects)
      const { target, rel, ...restProps } = props as React.AnchorHTMLAttributes<HTMLAnchorElement>;
      let secureRel = rel;
      if (target === "_blank") {
        if (!secureRel) {
          secureRel = "noopener noreferrer";
        } else {
          // Append if missing
          if (!secureRel.includes("noopener")) secureRel += " noopener";
          if (!secureRel.includes("noreferrer")) secureRel += " noreferrer";
        }
      }

      return (
        <Link
          href={href}
          ref={ref as React.Ref<HTMLAnchorElement>}
          className={className}
          style={style}
          target={target}
          rel={secureRel?.trim()}
          {...restProps}
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
