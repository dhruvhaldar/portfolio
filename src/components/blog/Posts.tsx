import { getPosts } from "@/app/utils/utils";
import { Grid } from "@/once-ui/components";
import Post from "@/components/blog/Post";

interface PostsProps {
  /** Range of posts to display [start, end] */
  range?: [number] | [number, number];
  /** Number of columns for the grid layout */
  columns?: "1" | "2" | "3";
  /** Whether to show thumbnails */
  thumbnail?: boolean;
  /** Custom list of slugs to exclude */
  exclude?: string[];
  /** Direction of the layout */
  direction?: "column" | "row";
}

/**
 * Fetching and displaying a list of blog posts.
 * Supports filtering by range, exclusion, and custom grid layout.
 */
export function Posts({
  range,
  columns = "1",
  thumbnail = false,
  exclude = [],
  direction,
}: PostsProps) {
  let allPosts = getPosts(["src", "app", "blog", "posts"]);

  const sortedPosts = allPosts.sort((a, b) => {
    return (
      new Date(b.metadata.publishedAt).getTime() -
      new Date(a.metadata.publishedAt).getTime()
    );
  });

  const filteredPosts = sortedPosts.filter(
    (post) => !exclude.includes(post.slug)
  );

  const displayedPosts = range
    ? filteredPosts.slice(
      range[0] - 1,
      range.length === 2 ? range[1] : filteredPosts.length
    )
    : filteredPosts;

  return (
    <>
      {displayedPosts.length > 0 && (
        <Grid
          columns={columns}
          mobileColumns="1"
          fillWidth
          marginBottom="40"
          gap="m"
        >
          {displayedPosts.map((post) => (
            <Post
              key={post.slug}
              post={post}
              thumbnail={thumbnail}
              direction={direction}
            />
          ))}
        </Grid>
      )}
    </>
  );
}
