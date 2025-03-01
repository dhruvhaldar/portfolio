import React from "react";import Script from 'next/script';
import { Heading, Flex, Text, Button, Avatar, RevealFx, Column } from "@/once-ui/components";import { Projects } from "@/components/work/Projects";
import { baseURL, routes } from "@/app/resources";
import { home, about, person, newsletter } from "@/app/resources/content";
import { Posts } from "@/components/blog/Posts";

export async function generateMetadata() {
  const title = home.title;const alt_title = 'Showcasing the Best Projects';const description = home.description;const ogImage = `https://${baseURL}/opengraph.jpg`;const pageUrl = `https://${baseURL}`;

  return {title,description,metadataBase: new URL(pageUrl),alternates: {canonical: pageUrl,},openGraph: {title,description,type: "website",url: pageUrl,siteName: `${person.firstName}'s Portfolio (With Projects & Publications)`,images: [{url: ogImage,width: 1200,height: 630,alt: alt_title,},],},twitter: {card: "summary_large_image",title,description,images: [ogImage],},};
}

export default function Home() {
  return (
    <Column maxWidth="m" gap="xl" horizontal="center">
      <Script defer src="https://cloud.umami.is/script.js" data-website-id="bdc0e551-96ce-4161-8e5b-3e9e89a304a2"></Script>
      <script
        type="application/ld+json"
        suppressHydrationWarning
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
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
          }),
        }}
      />
      <Column fillWidth paddingY="l" gap="m">
        <Column maxWidth="s">
        <h1 style={{ position: "absolute", width: "1px", height: "1px", overflow: "hidden", clip: "rect(1px, 1px, 1px, 1px)", whiteSpace: "nowrap" }}>{home.title}</h1>
          <RevealFx translateY="4" fillWidth horizontal="start" paddingBottom="m">
            <Heading wrap="balance" variant="display-strong-s">
              {home.headline}
            </Heading>
          </RevealFx>
          <RevealFx translateY="8" delay={0.2} fillWidth horizontal="start" paddingBottom="m">
            <Text wrap="balance" onBackground="neutral-medium" variant="heading-default-xl" >
              {home.subline}
            </Text>
          </RevealFx>
          <RevealFx translateY="12" delay={0.4} horizontal="start">
            <Button id="about" data-border="rounded" href="/about" variant="secondary" size="m"arrowIcon>
              <Flex gap="8" vertical="center">
                {about.avatar.display && (
                  <Avatar
                    style={{ marginLeft: "-0.75rem", marginRight: "0.25rem" }}
                    src={person.avatar}
                    size="m"
                  />
                )}
                {about.title}
              </Flex>
            </Button>
          </RevealFx>
        </Column>
      </Column>
      <RevealFx translateY="16" delay={0.6}>
        <Projects range={[1, 1]} />
      </RevealFx>
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
      <Projects range={[2]} />
      {newsletter.display>}
    </Column>
  );
}
