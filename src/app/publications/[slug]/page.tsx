import { notFound } from "next/navigation";
import { CustomMDX } from "@/components/mdx";
import { getPosts, getPostBySlug } from "@/app/utils/utils";
import { AvatarGroup, Button, Column, Heading, Row, SmartLink, Text } from "@/once-ui/components";
import { baseURL } from "@/app/resources";
import { person } from "@/app/resources/content";
import { formatDate } from "@/app/utils/formatDate";
import ScrollToHash from "@/components/ScrollToHash";
import { Metadata } from 'next';

type PageProps = {
  params: Promise<{ slug: string }>;
  searchParams?: Promise<{ [key: string]: string | string[] | undefined } | undefined>;
};

export async function generateStaticParams(): Promise<{ slug: string }[]> {
  const posts = getPosts(["src", "app", "publications", "posts"]);
  return posts.map((post) => ({
    slug: post.slug,
  }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  let post = getPostBySlug(slug, ["src", "app", "publications", "posts"]);

  if (!post) {
    return {
      title: 'Publication Not Found',
      description: 'The requested publication could not be found.',
    };
  }

  let {
    title,
    publishedAt: publishedTime,
    summary: description,
    images,
    image,
    team,
  } = post.metadata;
  let ogImage = image ? `https://${baseURL}${image}` : `https://${baseURL}/og?title=${title}`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: "article",
      publishedTime,
      url: `https://${baseURL}/publications/${post.slug}`,
      images: [
        {
          url: ogImage,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [ogImage],
    },
  };
}

import CiteButton from "@/components/publications/CiteButton";
import { formatAuthors, formatYear, cleanCitationText } from "@/app/utils/formatCitation";

export default async function Publication({ params }: PageProps) {
  const { slug } = await params;
  let post = getPostBySlug(slug, ["src", "app", "publications", "posts"]);

  if (!post) {
    notFound();
  }

  const avatars =
    post.metadata.team?.map((person) => ({
      src: person.avatar,
    })) || [];

  // Destructure the link from metadata
  const { link } = post.metadata;

  const authors = formatAuthors(post.metadata.team);
  const year = formatYear(post.metadata.publishedAt);
  const journal = cleanCitationText(post.metadata.journal || "Publication");
  const title = cleanCitationText(post.metadata.title);
  const citationText = `${authors} (${year}). ${title}. ${journal}.`;

  return (
    <Column as="section" maxWidth="s" gap="l">
      <script
        type="application/ld+json"
        suppressHydrationWarning
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "BlogPosting",
            headline: post.metadata.title,
            datePublished: post.metadata.publishedAt,
            dateModified: post.metadata.publishedAt,
            description: post.metadata.summary,
            image: post.metadata.image
              ? `https://${baseURL}${post.metadata.image}`
              : `https://${baseURL}/og?title=${post.metadata.title}`,
            url: `https://${baseURL}/publications/${post.slug}`,
            author: {
              "@type": "Person",
              name: person.name,
            },
          }),
        }}
      />
      <Column maxWidth="s" marginTop="l" gap="16">
        <SmartLink href="/publications" prefixIcon="chevronLeft">
          Posts
        </SmartLink>
        <Heading variant="display-strong-s">{post.metadata.title}</Heading>

        <Row gap="16" vertical="center">
          {link && (
            <SmartLink
              suffixIcon="arrowUpRightFromSquare"
              style={{ margin: "0", width: "fit-content" }}
              href={link}
              target="_blank"
              rel="noopener noreferrer"
            >
              <Text variant="body-default-s">View project</Text>
            </SmartLink>
          )}
          <CiteButton citationText={citationText} />
        </Row>
      </Column>
      <Row gap="12" vertical="center">
        {avatars.length > 0 && <AvatarGroup size="s" avatars={avatars} />}
        <Text variant="body-default-s" onBackground="neutral-weak">
          {formatDate(post.metadata.publishedAt)}
        </Text>
      </Row>
      <Column as="article" fillWidth>
        <CustomMDX source={post.content} />
      </Column>
      <ScrollToHash />
    </Column>
  );
}