import { getPosts } from "@/app/utils/utils";
import { Grid } from "@/once-ui/components";
import Post from "./Post";

interface PostsProps {
  range?: [number] | [number, number];
  columns?: "1" | "2" | "3";
  thumbnail?: boolean;
}

export function Posts({ range, columns = "1", thumbnail = false }: PostsProps) {
  let allPublications = getPosts(["src", "app", "publications", "posts"]);

  const sortedPublications = allPublications.sort((a, b) => {
    return new Date(b.metadata.publishedAt).getTime() - new Date(a.metadata.publishedAt).getTime();
  });

  const displayedPublications = range
    ? sortedPublications.slice(range[0] - 1, range.length === 2 ? range[1] : sortedPublications.length)
    : sortedPublications;

  return (
    <>
      {displayedPublications.length > 0 && (
        <Grid columns={columns} mobileColumns="1" fillWidth marginBottom="40" gap="m">
          {displayedPublications.map((post) => (
            <Post key={post.slug} post={post} thumbnail={thumbnail} />
          ))}
        </Grid>
      )}
    </>
  );
}
