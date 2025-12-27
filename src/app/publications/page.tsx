import { Column, Flex, Heading, SmartLink } from "@/once-ui/components";
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
          <Heading marginTop="l" marginBottom="s" variant="display-strong-xl">
            {publications.title}
          </Heading>
          <Flex marginBottom="m" marginTop="xs" direction="column" gap="8" horizontal="center">
            <SmartLink
              className="body-default-s"
              suffixIcon="arrowUpRightFromSquare"
              style={{ margin: "0", width: "fit-content" }}
              href="https://scholar.google.com/citations?user=261XKxgAAAAJ&hl=en"
              target="_blank"
              rel="me noopener noreferrer"
            >
              <img
                src="/images/icons/g_scholar.avif"
                alt="Scholar icon"
                style={{ width: "1em", marginInlineStart: "0.5em" }}
              />
              Google Scholar profile
            </SmartLink>
            <SmartLink
              id="cy-effective-orcid-url"
              className="body-default-s"
              href="https://orcid.org/0000-0002-2734-313X"
              target="orcid.widget"
              rel="me noopener noreferrer"
              style={{ verticalAlign: "top" }}
              suffixIcon="arrowUpRightFromSquare"
            >
              <img
                src="/images/icons/orcid.avif"
                style={{ width: "1em", marginInlineStart: "0.5em" }}
                alt="ORCID iD icon"
              />
              ORCiD profile
            </SmartLink>
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
