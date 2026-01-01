import { getPosts } from "@/app/utils/utils";
import { Column, Heading } from "@/once-ui/components";
import { Projects } from "@/components/work/Projects";
import { baseURL } from "@/app/resources";
import { person, work } from "@/app/resources/content";
import styles from './page.module.css';

export async function generateMetadata() {
  const title = work.title;
  const description = work.description;
  const ogImage = `https://${baseURL}/og?title=${encodeURIComponent(title)}`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: "website",
      url: `https://${baseURL}/work/`,
      alternates: {
        canonical: `https://${baseURL}/`,
      },
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

export default function Work() {
  const allProjects = getPosts(["src", "app", "work", "projects"], false);

  return (
    <Column fillWidth paddingY="l" paddingX="l" gap="l" horizontal="center">
      <Column maxWidth="m" fillWidth gap="l">
        <Column fillWidth gap="l" align="center">
          <Heading className={styles.headerTitle} variant="display-strong-xl">
            {work.title}
          </Heading>
        </Column>
        <script
          type="application/ld+json"
          suppressHydrationWarning
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "CollectionPage",
              headline: work.title,
              description: work.description,
              url: `https://${baseURL}/projects`,
              image: `${baseURL}/og?title=Design%20Projects`,
              author: {
                "@type": "Person",
                name: person.name,
              },
              hasPart: allProjects.map((project) => ({
                "@type": "CreativeWork",
                headline: project.metadata.title,
                description: project.metadata.summary,
                url: `https://${baseURL}/projects/${project.slug}`,
                image: `${baseURL}/${project.metadata.image}`,
              })),
            }),
          }}
        />
        <Projects posts={allProjects} />
      </Column>
    </Column>
  );
}
