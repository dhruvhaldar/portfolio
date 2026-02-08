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
      const anchorProps = props as React.AnchorHTMLAttributes<HTMLAnchorElement>;
      let { target, rel, ...restProps } = anchorProps;
      let secureRel = rel;

      if (isExternal) {
        target = "_blank";
        secureRel = "noopener noreferrer";
      }

      // 🛡️ Sentinel: Ensure internal links opening in new tab have security attributes
      // Prevents Reverse Tabnabbing on internal resources (like PDFs or redirects)
      if (target === "_blank") {
        if (!secureRel) {
          secureRel = "noopener noreferrer";
        } else {
          // Append if missing
          if (!secureRel.includes("noopener")) secureRel += " noopener";
          if (!secureRel.includes("noreferrer")) secureRel += " noreferrer";
        }
      }

      const opensInNewTab = target === "_blank";
      let finalChildren = children;
      let finalAriaLabel = anchorProps["aria-label"];

      // 🎨 Palette: Accessibility improvement for links opening in a new tab
      if (opensInNewTab) {
        if (finalAriaLabel) {
          // If aria-label is present, append the announcement to it
          finalAriaLabel = `${finalAriaLabel} (opens in a new tab)`;
        } else {
          // If no aria-label, append a visually hidden span
          finalChildren = (
            <>
              {children}
              <span className="sr-only"> (opens in a new tab)</span>
            </>
          );
        }
      }

      if (isExternal) {
        return (
          <a
            href={href}
            target={target}
            rel={secureRel}
            ref={ref as React.Ref<HTMLAnchorElement>}
            className={className}
            style={style}
            {...restProps}
            aria-label={finalAriaLabel}
          >
            {finalChildren}
          </a>
        );
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
          aria-label={finalAriaLabel}
        >
          {finalChildren}
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
