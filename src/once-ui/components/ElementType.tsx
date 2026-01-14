import Link from "next/link";
import type React from "react";
import { type ReactNode, forwardRef } from "react";

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

const isExternalLink = (url: string) => /^https?:\/\//.test(url);

/**
 * A polymorphic component that renders as a Link, anchor, or button based on props.
 * Handles external links automatically.
 * Supports ref forwarding to the underlying element.
 */
const ElementType = forwardRef<HTMLElement, ElementTypeProps>(
  ({ href, children, className, style, ...props }, ref) => {
    if (href) {
      // 🛡️ Sentinel: Validate href to prevent XSS via javascript: URLs
      // React 19 blocks them, but we fail securely by not rendering the link at all or sanitizing.
      if (href.trim().toLowerCase().startsWith("javascript:")) {
        console.error("Security: Blocked javascript: URL in ElementType");
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
      return (
        <Link
          href={href}
          ref={ref as React.Ref<HTMLAnchorElement>}
          className={className}
          style={style}
          {...(props as React.AnchorHTMLAttributes<HTMLAnchorElement>)}
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
