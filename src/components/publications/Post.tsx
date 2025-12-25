import { Column, Flex, Heading, SmartImage, SmartLink, Spotlight, Tag, Text } from "@/once-ui/components"; import styles from "./Posts.module.scss"; import { formatDate } from "@/app/utils/formatDate";

interface PostProps {
  /** The post data object */
  post: any;
  /** Whether to show a thumbnail image */
  thumbnail: boolean;
}

/**
 * Displays a single publication post card.
 */
export default function Post({ post, thumbnail }: PostProps) {
  return (
    <Spotlight className="fill-width" style={{ display: 'flex', flexDirection: 'column', width: '100%', marginBottom: 'var(--static-space-16)' }}>
      <SmartLink fillWidth className={styles.hover} unstyled key={post.slug} href={`/publications/${post.slug}`}
        style={{
          backdropFilter: 'blur(10px)',
          background: 'var(--neutral-alpha-weak)',
          borderRadius: 'var(--radius-l)',
          overflow: 'hidden'
        }}
      >
        <Flex position="relative" mobileDirection="column" fillWidth paddingY="12" paddingX="16" gap="64">
          {post.metadata.image && thumbnail && (
            <SmartImage
              preload={true}
              maxWidth={20}
              className={styles.image}
              sizes="640px"
              border="neutral-alpha-weak"
              cursor="interactive"
              radius="l"
              src={post.metadata.image}
              alt={"Thumbnail of " + post.metadata.title}
              aspectRatio="16 / 9"
            />
          )}
          <Column position="relative" fillWidth gap="8" vertical="center">
            <Heading as="h1" variant="heading-strong-l" wrap="balance">
              {post.metadata.title}
            </Heading>
            <Text variant="label-default-s" onBackground="neutral-weak">
              {formatDate(post.metadata.publishedAt, false)}
            </Text>
            {post.metadata.tag && (
              <Tag className="mt-8" label={post.metadata.tag} variant="neutral" />
            )}
          </Column>
        </Flex>
      </SmartLink>
    </Spotlight>
  );
}
