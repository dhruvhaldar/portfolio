import {
  Column,
  Heading,
  Text,
} from "@/once-ui/components";
import { blog } from "@/app/resources";
import { Posts } from "@/components/blog/Posts";
import { Newsletter } from "@/components/blog/Newsletter";
import { baseURL, person } from "@/app/resources";
import { getPosts } from "@/app/utils/utils";
import styles from './page.module.css';

export async function generateMetadata() {
  const title = blog.title;
  const description = blog.description;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: "website",
      url: `https://${baseURL}/blog`,
      siteName: `${person.firstName}'s Portfolio`,
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
    },
  };
}

export default function Blog() {
  const postCount = getPosts(["src", "app", "blog", "posts"], false).length;

  return (
    <Column fillWidth paddingY="l" paddingX="l" gap="l" horizontal="center">
      <Column maxWidth="m" fillWidth gap="l">
        <Column fillWidth gap="m" align="center">
          <Heading className={styles.headerTitle} variant="display-strong-xl" wrap="balance">
            {blog.title}
          </Heading>
        </Column>

        <Column fillWidth gap="l">
          {/* Featured Post (Latest) */}
          <Posts range={[1, 1]} columns="1" thumbnail direction="row" />

          {/* Recent Posts (Next 2) */}
          {postCount > 1 && (
            <Posts range={[2, 3]} columns="2" thumbnail direction="column" />
          )}

          {/* Newsletter */}
          <Newsletter />

          {postCount > 3 && (
            <>
              <Heading variant="heading-strong-xl" marginLeft="l" marginBottom="xs">
                Earlier posts
              </Heading>
              {/* Earlier Posts (Rest) */}
              <Posts range={[4]} columns="2" thumbnail direction="column" />
            </>
          )}
        </Column>
      </Column>
    </Column>
  );
}
