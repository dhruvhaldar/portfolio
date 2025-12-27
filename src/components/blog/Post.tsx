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
  /** Whether to prioritize loading the image */
  priority?: boolean;
}

/**
 * Displays a single blog post card.
 */
export default function Post({ post, thumbnail, direction = 'row', priority = false }: PostProps) {
  return (
    <Spotlight className="fill-width" style={{ display: 'flex', flexDirection: 'column', width: '100%', height: '100%' }}>
      <SmartLink fillWidth className={styles.hover} unstyled key={post.slug} href={`/blog/${post.slug}`}
        style={{
          display: 'flex',
          flexDirection: 'column',
          height: '100%',
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
          paddingY="4"
          paddingX="16"
          gap={direction === 'row' ? '48' : '32'}
          direction={direction}
        >
          {post.metadata.image && thumbnail && (
            <SmartImage
              priority={priority}
              className={`${styles.image} ${direction === 'row' ? styles.featured : ''}`}
              sizes="640px"
              border="neutral-alpha-weak"
              cursor="interactive"
              radius="l"
              src={post.metadata.image}
              aspectRatio="16 / 9"
              height={direction === 'row' ? undefined : '200px'}
            />
          )}
          <Column position="relative" fillWidth gap="8" vertical="center" align="start">
            <Flex gap="8" vertical="center">
              <Avatar size="s" src={person.avatar} />
              <Text variant="body-default-s" onBackground="neutral-weak">
                {formatDate(post.metadata.publishedAt, false)}
              </Text>
            </Flex>
            <Heading as="h1" variant="heading-strong-l" wrap="balance">
              {post.metadata.title}
            </Heading>
            {post.metadata.tag && (
              <Flex gap="8" className="mt-8" wrap>
                {post.metadata.tag.split(',').map((tag: string) => (
                  <Tag key={tag} label={tag.trim()} variant="neutral" />
                ))}
              </Flex>
            )}
          </Column>
        </Flex>
      </SmartLink>
    </Spotlight>
  );
}
