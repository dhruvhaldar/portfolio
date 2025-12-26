import {
  Avatar,
  Column,
  Flex,
  Heading,
  Icon,
  Input,
  Row,
  Text,
} from "@/once-ui/components";
import { baseURL, blog, home, person, social } from "@/app/resources";
import { Posts } from "@/components/blog/Posts";
import { getPosts } from "@/app/utils/utils";

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
  const allPosts = getPosts(["src", "app", "blog", "posts"]);

  return (
    <Column fillWidth paddingY="l" paddingX="l" gap="l" horizontal="center">
      <Column maxWidth="m" fillWidth gap="l">
        <Column fillWidth gap="m" align="start">
          <Heading variant="display-strong-xs">
            {blog.title}
          </Heading>
          <Text variant="heading-default-m" onBackground="neutral-weak">
            {blog.description}
          </Text>
        </Column>

        <Column fillWidth>
           <Posts columns="2" thumbnail />
        </Column>
      </Column>
    </Column>
  );
}
