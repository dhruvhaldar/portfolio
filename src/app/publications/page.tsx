import { Column, Flex, Heading, SmartLink, Spotlight, Text } from "@/once-ui/components";
import { Posts } from "@/components/publications/Posts";
import { baseURL } from "@/app/resources";
import { publications, person } from "@/app/resources/content";
import styles from './page.module.css';

export async function generateMetadata() {
  const title = publications.title;
  const description = publications.description;
  const ogImage = `https://${baseURL}/og?title=${encodeURIComponent(title)}`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: "website",
      url: `https://${baseURL}/publications`,
      images: [
        {
          url: ogImage,
          alt: title,
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

export default function Publication() {
  return (
    <Column fillWidth paddingY="l" paddingX="l" gap="l" horizontal="center">
      <Column maxWidth="s" fillWidth gap="l">
        <Column fillWidth gap="m" align="center">
          <Heading className={styles.headerTitle} variant="display-strong-xl">
            {publications.title}
          </Heading>
          <Flex marginBottom="m" marginTop="xs" gap="16" wrap horizontal="center">
            <Spotlight style={{ borderRadius: 'var(--radius-l)' }}>
              <SmartLink
                href="https://scholar.google.com/citations?user=261XKxgAAAAJ&hl=en"
                target="_blank"
                className={styles.hover}
                unstyled
                style={{
                  display: 'flex',
                  padding: 'var(--static-space-16)',
                  background: 'var(--neutral-alpha-weak)',
                  backdropFilter: 'blur(10px)',
                  borderRadius: 'var(--radius-l)',
                  border: '1px solid var(--neutral-alpha-medium)',
                }}
              >
                <Flex gap="12" vertical="center">
                  <img
                    src="/images/icons/g_scholar.avif"
                    alt="Scholar icon"
                    style={{ width: "24px", height: "24px" }}
                  />
                  <Text variant="body-default-m" onBackground="neutral-strong">
                    Google Scholar profile
                  </Text>
                </Flex>
              </SmartLink>
            </Spotlight>

            <Spotlight style={{ borderRadius: 'var(--radius-l)' }}>
              <SmartLink
                href="https://orcid.org/0000-0002-2734-313X"
                target="_blank"
                className={styles.hover}
                unstyled
                style={{
                  display: 'flex',
                  padding: 'var(--static-space-16)',
                  background: 'var(--neutral-alpha-weak)',
                  backdropFilter: 'blur(10px)',
                  borderRadius: 'var(--radius-l)',
                  border: '1px solid var(--neutral-alpha-medium)',
                }}
              >
                <Flex gap="12" vertical="center">
                  <img
                    src="/images/icons/orcid.avif"
                    alt="ORCID icon"
                    style={{ width: "24px", height: "24px" }}
                  />
                  <Text variant="body-default-m" onBackground="neutral-strong">
                    ORCID profile
                  </Text>
                </Flex>
              </SmartLink>
            </Spotlight>
          </Flex>
        </Column>
        <Column fillWidth flex={1}>
          <Posts range={[1, 3]} thumbnail />
          <Posts range={[4]} columns="2" />
        </Column>
      </Column>
    </Column>
  );
}
