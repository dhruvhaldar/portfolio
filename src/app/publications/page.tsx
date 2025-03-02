import { Column, Flex, Heading, SmartLink } from "@/once-ui/components";
import { Mailchimp } from "@/components";
import { Posts } from "@/components/publications/Posts";
import { baseURL } from "@/app/resources";
import { publications, person, newsletter } from "@/app/resources/content";

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
    <Column maxWidth="s">
      <script
        type="application/ld+json"
        suppressHydrationWarning
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Blog",
            headline: publications.title,
            description: publications.description,
            url: `https://${baseURL}/publications`,
            image: `${baseURL}/og?title=${encodeURIComponent(publications.title)}`,
            author: {
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
      <Heading marginBottom="s" variant="display-strong-s">
        {publications.title}
      </Heading>

      <Flex marginBottom="s">
      <SmartLink
       className="body-default-s" 
       suffixIcon="arrowUpRightFromSquare"
       style={{ margin: "0", width: "fit-content" }}
       href="https://scholar.google.com/citations?user=261XKxgAAAAJ&hl=en"
       target="_blank"
       rel="noopener noreferrer"
        >
          View my Google Scholar profile
        </SmartLink>
        </Flex>
        
      <Column fillWidth flex={1}>
        <Posts range={[1, 3]} thumbnail />
        <Posts range={[4]} columns="2" />
      </Column>
      {newsletter.display && <Mailchimp newsletter={newsletter} />}
    </Column>
  );
}