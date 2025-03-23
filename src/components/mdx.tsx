import { MDXRemote, MDXRemoteProps } from "next-mdx-remote/rsc";
import React, { ReactNode } from "react";
import { SmartImage, SmartLink, Text } from "@/once-ui/components";
import { CodeBlock } from "@/once-ui/modules";
import { HeadingLink, LazyframeVideo } from "@/components";
import { TextProps } from "@/once-ui/interfaces";
import { SmartImageProps } from "@/once-ui/components/SmartImage";

type TableProps = { data: { headers: string[]; rows: string[][]; } };
function Table({ data }: TableProps) {
  const headers = data.headers.map((header, index) => <th key={index}>{header}</th>);
  const rows = data.rows.map((row, index) => (
    <tr key={index}>
      {row.map((cell, cellIndex) => (
        <td key={cellIndex}>{cell}</td>
      ))}
    </tr>
  ));
  return (<table><thead><tr>{headers}</tr></thead><tbody>{rows}</tbody></table>);
}

type CustomLinkProps = React.AnchorHTMLAttributes<HTMLAnchorElement> & { href: string; children: ReactNode; };
function CustomLink({ href, children, ...props }: CustomLinkProps) {
  const linkText = typeof children === "string" ? children.trim() : "";
  const ariaLabel = !linkText ? `Link to ${href}` : undefined;
  if (href.startsWith("/")) return <SmartLink href={href} aria-label={ariaLabel} {...props}>{children}</SmartLink>;
  if (href.startsWith("#")) return <a href={href} aria-label={ariaLabel} {...props}>{children}</a>;
  return <a href={href} target="_blank" rel="noopener noreferrer" aria-label={ariaLabel} {...props}>{children}</a>;
}

function createImage({ alt, src, ...props }: SmartImageProps & { src: string }) {
  if (!src) { console.error("SmartImage requires a valid 'src' property."); return null; }
  return <SmartImage className="my-20" isLoading loading="lazy" radius="m" aspectRatio="16/9" responsive={{ mobile: '200px', tablet: '300px', desktop: '400px' }} alt={alt} src={src} {...props} />;
}

function slugify(str: string) {
  return str.toString().toLowerCase().trim().replace(/\s+/g, "-").replace(/&/g, "-and-").replace(/[^\w\-]+/g, "").replace(/\-\-+/g, "-");
}

function createHeading(level: 1 | 2 | 3 | 4 | 5 | 6) {
  const CustomHeading = ({ children, ...props }: TextProps) => {
    const slug = slugify(children as string);
    return <HeadingLink style={{ marginTop: "var(--static-space-24)", marginBottom: "var(--static-space-12)" }} level={level} id={slug} {...props}>{children}</HeadingLink>;
  };
  CustomHeading.displayName = `Heading${level}`;
  return CustomHeading;
}

function createParagraph({ children }: TextProps) {
  return <Text style={{ lineHeight: "175%" }} variant="body-default-m" onBackground="neutral-strong" marginTop="8" marginBottom="12">{children}</Text>;
}

const components = {
  p: createParagraph,
  h1: createHeading(1),
  h2: createHeading(2),
  h3: createHeading(3),
  h4: createHeading(4),
  h5: createHeading(5),
  h6: createHeading(6),
  img: createImage,
  a: CustomLink,
  Table,
  CodeBlock,
  iframe: ({ src }: { src: string }) => <LazyframeVideo src={src} />,
};

type CustomMDXProps = MDXRemoteProps & { components?: typeof components; };

export function CustomMDX(props: CustomMDXProps) {
  return (
    // @ts-ignore
    <MDXRemote {...props} components={{ ...components, ...(props.components || {}) }} />
  );
}