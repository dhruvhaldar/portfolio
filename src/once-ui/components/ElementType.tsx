import Link from "next/link";
import React, { ReactNode, forwardRef } from "react";

interface ElementTypeProps {
  /** Link URL. If present, renders an anchor or Link. */
  href?: string;
  /** Component to render if no href is provided. Defaults to "button". */
  as?: React.ElementType;
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
  ({ href, as: Component = "button", children, className, style, ...props }, ref) => {
    if (href) {
      const isExternal = isExternalLink(href);
      if (isExternal) {
        return (
          <a
            href={href}
            target="_blank"
            rel="noreferrer"
            ref={ref as React.Ref<HTMLAnchorElement>}
            className={className}
            style={style}
            {...(props as React.AnchorHTMLAttributes<HTMLAnchorElement>)}
          >
            {children}
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
      <Component
        ref={ref}
        className={className}
        style={style}
        {...props}
      >
        {children}
      </Component>
    );
  },
);

ElementType.displayName = "ElementType";
export { ElementType };
