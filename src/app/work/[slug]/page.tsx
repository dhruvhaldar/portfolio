import { notFound } from "next/navigation";
import { CustomMDX } from "@/components/mdx";
import { getPosts } from "@/app/utils/utils";
import { AvatarGroup, Column, Flex, Heading, SmartImage, Text, SmartLink,} from "@/once-ui/components";
import { baseURL } from "@/app/resources";
import { person } from "@/app/resources/content";
import { formatDate } from "@/app/utils/formatDate";
import ScrollToHash from "@/components/ScrollToHash";
import escapeHtml from 'escape-html';

interface WorkParams {
  params: {
    slug: string;
  };
}

export async function generateStaticParams(): Promise<{ slug: string }[]> {
  const posts = getPosts(["src", "app", "work", "projects"]);
  return posts.map((post) => ({
    slug: post.slug,
  }));
}

export function generateMetadata({ params: { slug } }: WorkParams) {
  let post = getPosts(["src", "app", "work", "projects"]).find(
    (post) => post.slug === slug
  );
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

export default function Project({ params }: WorkParams) {
  let post = getPosts(["src", "app", "work", "projects"]).find(
    (post) => post.slug === params.slug
  );
  if (!post) {
    notFound();
  }

  const avatars = post.metadata.team?.map((person) => ({
    src: person.avatar,
  })) || [];

  const { link } = post.metadata;

  return (
    <Column as="section" maxWidth="m" horizontal="center" gap="l">
      <script
        type="application/ld+json"
        suppressHydrationWarning
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "BlogPosting",
            headline: escapeHtml(post.metadata.title),
            datePublished: escapeHtml(post.metadata.publishedAt),
            dateModified: escapeHtml(post.metadata.publishedAt),
            description: escapeHtml(post.metadata.summary),
            image: post.metadata.image
              ? `https://${baseURL}${escapeHtml(post.metadata.image)}`
              : `https://${baseURL}/og?title=${encodeURIComponent(
                  escapeHtml(post.metadata.title)
                )}`,
            url: `https://${baseURL}/work/${escapeHtml(post.slug)}`,
            author: {
              "@type": "Person",
              name: escapeHtml(person.name),
            },
          }),
        }}
      />
      <Column maxWidth="s" marginTop="l" gap="16">
        <SmartLink href="/work" prefixIcon="chevronLeft">
          Projects
        </SmartLink>
        <Heading variant="display-strong-s">{post.metadata.title}</Heading>
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
      </Column>
      {post.metadata.images.length > 0 && (
        <SmartImage
          priority
          aspectRatio="16 / 9"
          radius="m"
          alt={`${post.metadata.title} project image`}
          src={post.metadata.images[0]}
        />
      )}
      <Column style={{ margin: "auto" }} as="article" maxWidth="xs">
        <Flex gap="12" marginBottom="24" vertical="center">
          {post.metadata.team && (
            <AvatarGroup reverse avatars={avatars} size="m" />
          )}
          <Text variant="body-default-s" onBackground="neutral-weak">
            {formatDate(post.metadata.publishedAt)}
          </Text>
        </Flex>
        <CustomMDX source={post.content} />
      </Column>
      <ScrollToHash />
    </Column>
  );
}