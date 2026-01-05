import { getPosts } from "@/app/utils/utils";
import { Column } from "@/once-ui/components";
import { ProjectCard } from "@/components";

interface ProjectsProps {
  /** Optional range of projects to display */
  range?: [number, number?];
  /** Optional pre-fetched posts data */
  posts?: ReturnType<typeof getPosts>;
}

/**
 * Fetches and displays a list of project cards.
 * Renders a column of ProjectCard components.
 */
export function Projects({ range, posts }: ProjectsProps) {
  // Use provided posts or fetch them if not provided
  const sourceProjects = posts || getPosts(["src", "app", "work", "projects"], false);

  // Optimization: Create a shallow copy to avoid mutating the source array (especially if passed as prop)
  // Optimization: Use localeCompare for string dates (YYYY-MM-DD) instead of new Date() for performance
  const sortedProjects = [...sourceProjects].sort((a, b) => {
    return b.metadata.publishedAt.localeCompare(a.metadata.publishedAt);
  });

  const displayedProjects = range
    ? sortedProjects.slice(Math.max(0, range[0] - 1), range[1] ?? sortedProjects.length)
    : sortedProjects;

  return (
    <Column fillWidth gap="xl" marginBottom="40" paddingX="l">
      {displayedProjects.map((post, index) => (
        <ProjectCard
          preload={index === 0 || post.slug === 'space-debris-project'}
          key={post.slug}
          href={`work/${post.slug}`}
          images={post.metadata.images}
          title={post.metadata.title}
          description={post.metadata.summary}
          content={post.content}
          hasContent={post.hasContent}
          avatars={post.metadata.team?.map((member) => ({ src: member.avatar })) || []}
          link={post.metadata.link || ""}
        />
      ))}
    </Column>
  );
}
