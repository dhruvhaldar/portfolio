import Script from 'next/script';
import { Heading, Flex, Text, Button, Avatar, RevealFx, Column, Row, Badge } from "@/once-ui/components";
import { Projects } from "@/components/work/Projects";
import { baseURL, routes } from "@/app/resources";
import { home, about, person } from "@/app/resources/content";
import { Posts } from "@/components/publications/Posts";
import styles from "@/components/about/about.module.scss";

// Generate metadata for SEO and social sharing
export async function generateMetadata() {
  const title = home.title;
  const alt_title = 'Showcasing the Best Projects';
  const description = home.description;
  const ogImage = `https://${baseURL}/opengraph.jpg`;
  const pageUrl = `https://${baseURL}`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: "website",
      url: pageUrl,
      siteName: `${person.firstName}'s Portfolio (With Projects & Publications)`,
      images: [{ 
        url: ogImage, 
        width: 1200, 
        height: 630, 
        alt: alt_title 
      }],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [ogImage],
    },
  };
}

// Schema.org structured data for better SEO
const structuredData = {
  "@context": "https://schema.org",
  "@type": "WebPage",
  name: home.title,
  description: home.description,
  url: `https://${baseURL}`,
  image: `${baseURL}/og?title=${encodeURIComponent(home.title)}`,
  publisher: {
    "@type": "Person",
    name: person.name,
    image: {
      "@type": "ImageObject",
      url: `${baseURL}${person.avatar}`,
    },
  },
};

export default function Home() {
  return (
    <Column maxWidth="m" gap="xl" horizontal="center">
      {/* Analytics Script */}
      <Script 
        defer 
        src="https://cloud.umami.is/script.js" 
        data-website-id="bdc0e551-96ce-4161-8e5b-3e9e89a304a2"
      />

      {/* Structured Data */}
      <script
        type="application/ld+json"
        suppressHydrationWarning
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(structuredData),
        }}
      />

      {/* Hero Section */}
      <Column fillWidth paddingY="xl" horizontal="center" gap="m">
        <Column maxWidth="s" horizontal="center" align="center">
          {home.featured.display && (
            <RevealFx
              fillWidth
              horizontal="center"
              paddingTop="xs"
              paddingBottom="m"
              paddingLeft="12"
            >
              <Badge
                background="brand-alpha-weak"
                paddingX="12"
                paddingY="4"
                onBackground="neutral-strong"
                textVariant="label-default-s"
                arrow={false}
                href={home.featured.href}
              >
                <Row paddingY="2">{home.featured.title}</Row>
              </Badge>
            </RevealFx>
          )}

          <RevealFx translateY="4" fillWidth horizontal="center" paddingBottom="xs">
            <Heading wrap="balance" variant="display-strong-s">
              {home.headline}
            </Heading>
          </RevealFx>

          <RevealFx translateY="8" delay={0.2} fillWidth horizontal="center" paddingBottom="m">
            <Text wrap="balance" onBackground="neutral-medium" variant="heading-default-l">
              {home.subline}
            </Text>
          </RevealFx>

          <RevealFx translateY="12" delay={0.4} horizontal="center" paddingBottom="0">
            <Button 
              id="about" 
              data-border="rounded"
              href="/about" 
              variant="secondary" 
              size="m"
              weight="default"
              arrowIcon
              className={styles.themeButton}
            >
              <Row gap="8" vertical="center" paddingRight="4">
                {about.avatar.display && (
                  <Avatar 
                    marginRight="8"
                    style={{ 
                      marginLeft: "-0.75rem",
                    }} 
                    src={person.avatar} 
                    size="m"
                  />
                )}
                {about.title}
              </Row>
            </Button>
          </RevealFx>
        </Column>
      </Column>

      {/* Featured Project */}
      <RevealFx translateY="0" delay={0.6}>
        <Projects range={[1, 1]} />
      </RevealFx>

      {/* Blog Section (Conditional) */}
      {routes["/blog"] && (
        <Flex fillWidth gap="24" mobileDirection="column">
          <Flex flex={1} paddingLeft="l">
            <Heading as="h1" variant="display-strong-xs" wrap="balance">
              Latest from the blog
            </Heading>
          </Flex>
          <Flex flex={3} paddingX="20">
            <Posts range={[1, 2]} columns="2" />
          </Flex>
        </Flex>
      )}

      {/* Additional Projects */}
      <Projects range={[2]} />
    </Column>
  );
}
