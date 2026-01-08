import { MDXRemote, MDXRemoteProps } from "next-mdx-remote/rsc";
import React, { ReactNode } from "react";
import { slugify as transliterate } from "transliteration";

import {
  Heading,
  Text,
  InlineCode,
  Feedback,
  Button,
  Grid,
  Row,
  Column,
  Icon,
  SmartLink,
  SmartImage,
  Flex
} from "@/once-ui/components";

import {
  CodeBlock
} from "@/once-ui/modules";

import {
  HeadingLink,
  LazyframeVideo,
} from "@/components";

import { TextProps } from "@/once-ui/interfaces";
import { SmartImageProps } from "@/once-ui/components/SmartImage";

type CustomLinkProps = React.AnchorHTMLAttributes<HTMLAnchorElement> & {
  href: string;
  children: ReactNode;
};

export function CustomLink({ href, children, ...props }: CustomLinkProps) {
  if (href.startsWith("/")) {
    return (
      <SmartLink href={href} {...props}>
        {children}
      </SmartLink>
    );
  }

  if (href.startsWith("#")) {
    return (
      <a href={href} {...props}>
        {children}
      </a>
    );
  }

  // 🛡️ Sentinel: Block javascript: URLs to prevent XSS.
  // Although React 19 sanitizes them, we fail securely by not rendering the link at all.
  if (href.trim().toLowerCase().startsWith('javascript:')) {
    console.error("Security: Blocked javascript: URL in CustomLink");
    return (
      <span {...props}>
        {children}
      </span>
    );
  }

  return (
    <a href={href} target="_blank" rel="noopener noreferrer" {...props}>
      {children}
    </a>
  );
}

function createImage({ alt, src, ...props }: SmartImageProps & { src: string }) {
  if (!src) {
    console.error("Media requires a valid 'src' property.");
    return null;
  }

  const isSpaceDebrisAvif = src.includes('stuffinspace2.avif');

  return (
    <SmartImage
      className="my-20"
      preload={isSpaceDebrisAvif}
      loading={isSpaceDebrisAvif ? 'eager' : 'lazy'}
      radius="m-4"
      aspectRatio="16/9"
      responsive={{ mobile: '400px', tablet: '400px', desktop: '800px' }}
      alt={alt}
      src={src}
      {...props}
    />
  );
}

function slugify(str: string): string {
  const strWithAnd = str.replace(/&/g, " and "); // Replace & with 'and'
  return transliterate(strWithAnd, {
    lowercase: true,
    separator: "-", // Replace spaces with -
  }).replace(/\-\-+/g, "-"); // Replace multiple - with single -
}

function createHeading(as: "h1" | "h2" | "h3" | "h4" | "h5" | "h6") {
  const CustomHeading = ({
    children,
    ...props
  }: Omit<React.ComponentProps<typeof HeadingLink>, "as" | "id" | "level">) => {
    const slug = slugify(children as string);
    return (
      <HeadingLink marginTop="24" marginBottom="12" level={parseInt(as[1]) as any} id={slug} {...props}>
        {children}
      </HeadingLink>
    );
  };

  CustomHeading.displayName = `${as}`;

  return CustomHeading;
}

function createParagraph({ children }: any) {
  return (
    <Text
      style={{ lineHeight: "175%" }}
      variant="body-default-m"
      onBackground="neutral-medium"
      marginTop="8"
      marginBottom="12"
    >
      {children}
    </Text>
  );
}

function createInlineCode({ children }: { children: ReactNode }) {
  return <InlineCode>{children}</InlineCode>;
}

function createBlockquote({ children }: { children: ReactNode }) {
  return (
    <Flex
      direction="column"
      background="neutral-alpha-weak"
      border="neutral-alpha-medium"
      radius="l"
      padding="m"
      marginTop="24"
      marginBottom="24"
      style={{
        borderLeft: "4px solid var(--brand-solid-strong)",
        backdropFilter: "blur(var(--static-space-1))"
      }}
    >
      <Text
        variant="body-default-m"
        onBackground="neutral-strong"
      >
        {children}
      </Text>
    </Flex>
  );
}

function createCodeBlock(props: any) {
  // For pre tags that contain code blocks
  if (props.children && props.children.props && props.children.props.className) {
    const { className, children } = props.children.props;

    // Extract language from className (format: language-xxx)
    const language = className.replace("language-", "");
    const label = language.charAt(0).toUpperCase() + language.slice(1);

    return (
      <CodeBlock
        marginTop="8"
        marginBottom="16"
        codeInstances={[
          {
            code: children as string,
            language,
            label,
          },
        ]}
        copyButton={true}
      />
    );
  }

  // Fallback for other pre tags or empty code blocks
  return <pre {...props} />;
}


const components = {
  p: createParagraph as any,
  h1: createHeading("h1") as any,
  h2: createHeading("h2") as any,
  h3: createHeading("h3") as any,
  h4: createHeading("h4") as any,
  h5: createHeading("h5") as any,
  h6: createHeading("h6") as any,
  img: createImage as any,
  a: CustomLink as any,
  blockquote: createBlockquote as any,
  code: createInlineCode as any,
  pre: createCodeBlock as any,
  Heading,
  Text,
  CodeBlock,
  InlineCode,
  // Accordion,
  // AccordionGroup,
  // Table,
  Feedback,
  Button,
  // Card,
  Grid,
  Row,
  Column,
  Icon,
  // Media,
  SmartLink,
  Table: ({ data }: { data: { headers: string[], rows: string[][] } }) => (
    <div style={{ overflowX: 'auto', marginBottom: '1rem' }}>
      <table style={{ width: '100%', borderCollapse: 'collapse', border: '1px solid var(--neutral-border-medium)' }}>
        <thead>
          <tr style={{ background: 'var(--neutral-alpha-weak)' }}>
            {data.headers.map((header, index) => (
              <th key={index} style={{ padding: '0.75rem', textAlign: 'left', borderBottom: '1px solid var(--neutral-border-weak)' }}>
                <Text variant="body-strong-m">{header}</Text>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.rows.map((row, rowIndex) => (
            <tr key={rowIndex} style={{ borderBottom: '1px solid var(--neutral-border-weak)' }}>
              {row.map((cell, cellIndex) => (
                <td key={cellIndex} style={{ padding: '0.75rem' }}>
                  <Text variant="body-default-m">{cell}</Text>
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  ),
  iframe: (props: any) => <LazyframeVideo {...props} />,
  Video: LazyframeVideo,
};

type CustomMDXProps = MDXRemoteProps & {
  components?: typeof components;
};

import remarkMath from "remark-math";
import rehypeKatex from "rehype-katex";

export function CustomMDX(props: CustomMDXProps) {
  return (
    <MDXRemote
      {...props}
      components={{ ...components, ...(props.components || {}) }}
      options={{
        mdxOptions: {
          remarkPlugins: [remarkMath],
          rehypePlugins: [rehypeKatex],
        },
      }}
    />
  );
}
