import { notFound } from "next/navigation";
import { CustomMDX } from "@/components/mdx"; // Fixed import
import {
  Avatar,
  Column,
  Flex,
  Heading,
  Icon,
  Row,
  SmartImage,
  SmartLink,
  Text,
} from "@/once-ui/components";
import BlogTableOfContents from "@/components/blog/TableOfContents";
import { baseURL, about, blog, person } from "@/app/resources";
import { formatDate } from "@/app/utils/formatDate"; // Fixed import path
import { getPosts } from "@/app/utils/utils";
import { Metadata } from "next";
import React from "react";
import { Posts } from "@/components/blog/Posts";
import { ShareSection } from "@/components/blog/ShareSection";
import ScrollToHash from "@/components/ScrollToHash"; // Import from components

export async function generateStaticParams(): Promise<{ slug: string }[]> {
  const posts = getPosts(["src", "app", "blog", "posts"]);
  return posts.map((post) => ({
    slug: post.slug,
  }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>; // Updated type for Next.js 15+
}): Promise<Metadata> {
  const { slug } = await params;

  const posts = getPosts(["src", "app", "blog", "posts"]);
  let post = posts.find((post) => post.slug === slug);

  if (!post) return {};

  return {
    title: post.metadata.title,
    description: post.metadata.summary,
    openGraph: {
      title: post.metadata.title,
      description: post.metadata.summary,
      url: `${baseURL}${blog.path}/${post.slug}`,
      type: "article",
      publishedTime: post.metadata.publishedAt,
      authors: [person.name],
      images: [post.metadata.image || `/api/og/generate?title=${encodeURIComponent(post.metadata.title)}`]
    }
  };
}

export default async function Blog({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;

  let post = getPosts(["src", "app", "blog", "posts"]).find((post) => post.slug === slug);

  if (!post) {
    notFound();
  }

  return (
    <Column
      as="section"
      maxWidth="l"
      gap="l"
      horizontal="center"
      position="relative"
    >
      <script
        type="application/ld+json"
        suppressHydrationWarning
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "BlogPosting",
            headline: post.metadata.title,
            description: post.metadata.summary,
            datePublished: post.metadata.publishedAt,
            author: {
              "@type": "Person",
              name: person.name,
              url: `${baseURL}${about.path}`,
            },
          }),
        }}
      />

      <Row fillWidth gap="xl" horizontal="center">
        <Column flex={3} hide="m" />
        <Column flex={6} maxWidth="s" gap="l" horizontal="center">
          <Column
            maxWidth="s"
            marginTop="l"
            gap="16"
            horizontal="center"
            align="center"
          >
            <SmartLink href="/blog" prefixIcon="chevronLeft">
              Posts
            </SmartLink>
            <Heading variant="display-strong-s" align="center">
              {post.metadata.title}
            </Heading>
          </Column>

          <Row id="about" gap="12" vertical="center" horizontal="center">
            <Avatar size="s" src={person.avatar} />
            <Text variant="body-default-s" onBackground="neutral-weak">
              {person.name}
            </Text>
            <Text variant="body-default-s" onBackground="neutral-weak">
              {post.metadata.publishedAt &&
                formatDate(post.metadata.publishedAt)}
            </Text>
          </Row>

          {post.metadata.image && (
            <SmartImage
              src={post.metadata.image}
              alt={post.metadata.title}
              aspectRatio="16/9"
              priority
              sizes="(min-width: 768px) 100vw, 768px"
              radius="l"
              style={{
                marginTop: "12px",
                marginBottom: "8px",
              }}
            />
          )}
          <Column as="article" fillWidth maxWidth="s">
            <CustomMDX source={post.content} />
          </Column>

          <ShareSection
            title={post.metadata.title}
            url={`${baseURL}${blog.path}/${post.slug}`}
          />

          <Column fillWidth gap="40" marginTop="40" horizontal="center">
            <Text
              as="h2"
              id="recent-posts"
              variant="heading-strong-xl"
              marginBottom="24"
              align="center"
            >
              Recent posts
            </Text>
            <Posts
              exclude={[post.slug]}
              range={[1, 2]}
              columns="2"
              thumbnail
              direction="column"
            />
          </Column>
        </Column>

        <Column
          flex={3}
          position="relative"
          hide="m"
          maxWidth={20}
        >
          <Column
            position="sticky"
            top="128"
            gap="16"
          >
            <Flex gap="12" vertical="center" marginBottom="8">
              <svg
                style={{ marginLeft: "-8px" }}
                stroke="currentColor"
                fill="none"
                strokeWidth="1.5"
                viewBox="0 0 24 24"
                aria-hidden="true"
                height="20"
                width="20"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z"
                ></path>
              </svg>
              <Text variant="label-default-s" onBackground="neutral-medium">
                On this page
              </Text>
            </Flex>
            <BlogTableOfContents
              items={[
                ...post.content
                  .split("\n")
                  .filter((line) => line.startsWith("##"))
                  .map((line) => {
                    const level = line.startsWith("###") ? 3 : 2;
                    const text = line.replace(/^#+\s/, "");
                    const id = text
                      .toLowerCase()
                      .replace(/[^a-z0-9]+/g, "-")
                      .replace(/(^-|-$)+/g, "");
                    return { label: text, id };
                  }),
                { label: "Recent posts", id: "recent-posts" },
              ]}
            />
          </Column>
        </Column>
      </Row>
      <ScrollToHash />
    </Column>
  );
}
