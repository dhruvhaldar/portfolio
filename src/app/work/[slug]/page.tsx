import { notFound } from "next/navigation";
import { CustomMDX } from "@/components/mdx";
import { MDXRemote } from "next-mdx-remote/rsc";
import { getPosts, getPostBySlug } from "@/app/utils/utils";
import { AvatarGroup, Column, Flex, Heading, SmartImage, Text, SmartLink, Row } from "@/once-ui/components";
import { ShareButton } from "@/components/ShareButton";
import { baseURL } from "@/app/resources";
import { person } from "@/app/resources/content";
import { formatDate } from "@/app/utils/formatDate";
import ScrollToHash from "@/components/ScrollToHash";
import { sanitizeJsonLd } from "@/app/utils/security"; // 🛡️ Sentinel: Sanitize JSON-LD
import BlogTableOfContents from "@/components/blog/TableOfContents";


interface WorkParams {
  params: Promise<{ slug: string }>;
}


export async function generateStaticParams(): Promise<{ slug: string }[]> {
  const posts = getPosts(["src", "app", "work", "projects"]);
  return posts.map((post) => ({
    slug: post.slug,
  }));
}

export async function generateMetadata({ params }: WorkParams) {
  const { slug } = await params;
  let post = getPostBySlug(slug, ["src", "app", "work", "projects"]);

  if (!post) {
    return;
  }

  let {
    title,
    publishedAt: publishedTime,
    summary: description,
    images,
    image,
    team,
  } = post.metadata;

  let ogImage = image
    ? `https://${baseURL}${image}`
    : `https://${baseURL}/og?title=${encodeURIComponent(title)}`;

  return {
    title,
    description,
    images,
    team,
    openGraph: {
      title,
      description,
      type: "article",
      publishedTime,
      url: `https://${baseURL}/work/${post.slug}`,
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

export default async function Project({ params }: WorkParams) {
  const { slug } = await params;
  let post = getPostBySlug(slug, ["src", "app", "work", "projects"]);

  if (!post) {
    notFound();
  }

  const avatars = post.metadata.team?.map((person) => ({
    src: person.avatar,
  })) || [];

  const { link } = post.metadata;

  return (
    <Column as="section" maxWidth="l" horizontal="center" gap="l">
      <script
        type="application/ld+json"
        suppressHydrationWarning
        dangerouslySetInnerHTML={{
          __html: sanitizeJsonLd({
            "@context": "https://schema.org",
            "@type": "BlogPosting",
            headline: post.metadata.title,
            datePublished: post.metadata.publishedAt,
            dateModified: post.metadata.publishedAt,
            description: post.metadata.summary,
            image: post.metadata.image
              ? `https://${baseURL}${post.metadata.image}`
              : `https://${baseURL}/og?title=${encodeURIComponent(
                post.metadata.title
              )}`,
            url: `https://${baseURL}/work/${post.slug}`,
            author: {
              "@type": "Person",
              name: person.name,
            },
          }),
        }}
      />

      <Row fillWidth gap="xl" horizontal="center">
        <Column flex={9} maxWidth="m" gap="l" horizontal="center">
          <Column maxWidth="m" marginTop="l" gap="16">
            <SmartLink href="/work" prefixIcon="chevronLeft">
              Work
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
                  <Text variant="body-default-s">View more details</Text>
                </SmartLink>
              )}
              {avatars.length > 0 && (
                <AvatarGroup reverse avatars={avatars} size="m" />
              )}
              <Text variant="body-default-s" onBackground="neutral-weak">
                {formatDate(post.metadata.publishedAt)}
              </Text>
            </Row>
          </Column>

          {post.metadata.images?.length > 0 && (
            <SmartImage
              preload={true}
              aspectRatio="16 / 9"
              radius="m"
              alt={`${post.metadata.title} project image`}
              src={post.metadata.images[0]}
            />
          )}

          <Column style={{ margin: "auto" }} as="article" maxWidth="m">
            <CustomMDX source={post.content} />
            <Row gap="16" vertical="center" horizontal="center" marginTop="32">
              <ShareButton
                title={post.metadata.title}
                url={`https://${baseURL}/work/${post.slug}`}
                text="Share this Project"
              />
            </Row>
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
              ]}
            />
          </Column>
        </Column>
      </Row>
      <ScrollToHash />
    </Column>
  );
}