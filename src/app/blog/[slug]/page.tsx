import { notFound } from "next/navigation";
import { CustomMDX } from "@/components/mdx"; // Fixed import
import {
  Column,
  Heading,
  Row,
  Text,
  SmartLink,
  Avatar,
  SmartImage, // Use SmartImage directly or Media if available in core
} from "@/once-ui/components";
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
    <Row fillWidth>
      <Row maxWidth={12}/>
      <Row fillWidth horizontal="center">
        <Column as="section" maxWidth="m" horizontal="center" gap="l" paddingTop="24">
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
                url: `${baseURL}${about.path}` // Access path directly used in other resources if available, or construct
               }
             }),
           }}
          />
          <Column maxWidth="s" gap="16" horizontal="center" align="center">
            <SmartLink href="/blog">
              <Text variant="label-strong-m">Blog</Text>
            </SmartLink>
            <Text variant="body-default-xs" onBackground="neutral-weak" marginBottom="12">
              {post.metadata.publishedAt && formatDate(post.metadata.publishedAt)}
            </Text>
            <Heading variant="display-strong-m">{post.metadata.title}</Heading>
          </Column>
          <Row marginBottom="32" horizontal="center">
            <Row gap="16" vertical="center">
              <Avatar size="s" src={person.avatar} />
              <Text variant="label-default-m" onBackground="brand-weak">
                {person.name}
              </Text>
            </Row>
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
                marginBottom: "8px"
              }}
            />
          )}
          <Column as="article" maxWidth="s">
            <CustomMDX source={post.content} />
          </Column>
          
          <ShareSection 
            title={post.metadata.title} 
            url={`${baseURL}${blog.path}/${post.slug}`} 
          />

          <Column fillWidth gap="40" horizontal="center" marginTop="40">
            <Text as="h2" id="recent-posts" variant="heading-strong-xl" marginBottom="24">
              Recent posts
            </Text>
            <Posts exclude={[post.slug]} range={[1, 2]} columns="2" thumbnail direction="column" />
          </Column>
          <ScrollToHash />
        </Column>
      </Row>
    </Row>
  );
}
