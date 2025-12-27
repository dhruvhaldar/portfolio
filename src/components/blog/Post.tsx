import { Avatar, Column, Flex, Heading, SmartImage, SmartLink, Spotlight, Tag, Text } from "@/once-ui/components";
import styles from "./Posts.module.scss";
import { formatDate } from "@/app/utils/formatDate";
import { person } from "@/app/resources";

interface PostProps {
  /** The post data object */
  post: any;
  /** Whether to show a thumbnail image */
  thumbnail: boolean;
  /** Direction of the layout */
  direction?: 'row' | 'column';
}

/**
 * Displays a single blog post card.
 */
export default function Post({ post, thumbnail, direction = 'row' }: PostProps) {
  return (
    <Spotlight className="fill-width" style={{ display: 'flex', flexDirection: 'column', width: '100%', marginBottom: 'var(--static-space-16)' }}>
      <SmartLink fillWidth className={styles.hover} unstyled key={post.slug} href={`/blog/${post.slug}`}
        style={{
          backdropFilter: 'blur(10px)',
          background: 'var(--neutral-alpha-weak)',
          borderRadius: 'var(--radius-l)',
          overflow: 'hidden'
        }}
      >
        <Flex
          position="relative"
          mobileDirection="column"
          fillWidth
          paddingY="12"
          paddingX="16"
          gap={direction === 'row' ? '64' : '32'}
          direction={direction}
        >
          {post.metadata.image && thumbnail && (
            <SmartImage
              preload={true}
              className={styles.image}
              sizes="640px"
              border="neutral-alpha-weak"
              cursor="interactive"
              radius="l"
              src={post.metadata.image}
              alt={"Thumbnail of " + post.metadata.title}
              aspectRatio="16 / 9"
              style={{
                width: direction === 'row' ? '50%' : '100%',
                height: direction === 'row' ? 'auto' : '200px',
                objectFit: 'cover'
              }}
            />
          )}
          <Column position="relative" fillWidth gap="8" vertical="center" align="start">
            <Flex gap="8" vertical="center">
              <Avatar size="s" src={person.avatar} />
              <Text variant="body-default-s" onBackground="neutral-strong">
                {person.name}
              </Text>
              <Text variant="body-default-s" onBackground="neutral-weak">
                •
              </Text>
              <Text variant="body-default-s" onBackground="neutral-weak">
                {formatDate(post.metadata.publishedAt, false)}
              </Text>
            </Flex>
            <Heading as="h1" variant="heading-strong-l" wrap="balance">
              {post.metadata.title}
            </Heading>
            {post.metadata.tag && (
              <Tag className="mt-8" label={post.metadata.tag} variant="neutral" />
            )}
          </Column>
        </Flex>
      </SmartLink>
    </Spotlight>
  );
}
