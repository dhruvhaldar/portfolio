import {
  Column,
  Heading,
  Text,
} from "@/once-ui/components";
import { blog } from "@/app/resources";
import { Posts } from "@/components/blog/Posts";
import { Newsletter } from "@/components/blog/Newsletter";
import { baseURL, person } from "@/app/resources";

export async function generateMetadata() {
  const title = blog.title;
  const description = blog.description;
  const ogImage = `https://${baseURL}/og?title=${encodeURIComponent(title)}`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: "website",
      url: `https://${baseURL}/blog`,
      siteName: `${person.firstName}'s Portfolio`,
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

export default function Blog() {
  return (
    <Column fillWidth paddingY="l" paddingX="l" gap="l" horizontal="center">
      <Column maxWidth="m" fillWidth gap="l">
        <Column fillWidth gap="m" align="start">
          <Heading variant="display-strong-xl" marginBottom="l" wrap="balance">
            {blog.title}
          </Heading>
        </Column>

        <Column fillWidth gap="l">
          {/* Featured Post (Latest) */}
          <Posts range={[1, 1]} columns="1" thumbnail direction="row" />

          {/* Recent Posts (Next 2) */}
          <Posts range={[2, 3]} columns="2" thumbnail direction="column" />

          {/* Newsletter */}
          <Newsletter />

          <Heading variant="heading-strong-xl" marginLeft="l" marginBottom="xs">
            Earlier posts
          </Heading>
          {/* Earlier Posts (Rest) */}
          <Posts range={[4]} columns="2" thumbnail direction="column" />
        </Column>
      </Column>
    </Column>
  );
}
