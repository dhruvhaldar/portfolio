import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { notFound } from 'next/navigation';

type Team = {
  name: string;
  role: string;
  avatar: string;
  linkedIn: string;
};

type Metadata = {
  title: string;
  publishedAt: string;
  summary: string;
  image?: string;
  images: string[];
  tag?: string;
  team: Team[];
  link?: string;
  journal?: string;
};

/**
 * Reads all MDX files from a directory.
 * @param dir - The directory to read from.
 * @returns An array of filenames ending with .mdx.
 */
function getMDXFiles(dir: string) {
  if (!fs.existsSync(dir)) {
    notFound();
  }
  return fs.readdirSync(dir).filter((file) => path.extname(file) === ".mdx");
}

/**
 * Reads and parses a specific MDX file.
 * @param filePath - The absolute path to the MDX file.
 * @returns An object containing the metadata and content of the file.
 */
function readMDXFile(filePath: string, includeContent = true) {
  if (!fs.existsSync(filePath)) {
    notFound();
  }
  const rawContent = fs.readFileSync(filePath, "utf-8");
  const { data, content } = matter(rawContent);
  const metadata: Metadata = {
    title: data.title || "",
    publishedAt: data.publishedAt || "",
    summary: data.summary || "",
    image: data.image || "",
    images: data.images || [],
    tag: data.tag || [],
    team: data.team || [],
    link: data.link || "",
    journal: data.journal || "",
  };
  return {
    metadata,
    content: includeContent ? content : "",
    hasContent: content.trim().length > 0,
  };
}

/**
 * Retrieves metadata and content for all MDX files in a directory.
 * @param dir - The directory to process.
 * @param includeContent - Whether to include the full content string. Defaults to true.
 * @returns An array of objects containing metadata, slug, content (if requested), and hasContent.
 */
function getMDXData(dir: string, includeContent = true) {
  const mdxFiles = getMDXFiles(dir);
  return mdxFiles
    .map((file) => {
      const { metadata, content, hasContent } = readMDXFile(
        path.join(dir, file),
        includeContent
      );
      const slug = path.basename(file, path.extname(file));
      return { metadata, slug, content, hasContent };
    })
    .sort((a, b) => {
      return b.metadata.publishedAt.localeCompare(a.metadata.publishedAt);
    });
}

/**
 * Gets all posts from the specified directory path.
 * @param customPath - Optional path segments to the posts directory. Defaults to root.
 * @param includeContent - Whether to include the full content string. Defaults to true.
 * @returns List of all posts with their metadata and content.
 */
export function getPosts(customPath = ["", "", "", ""], includeContent = true) {
  const postsDir = path.join(process.cwd(), ...customPath);
  return getMDXData(postsDir, includeContent);
}

/**
 * Gets all post slugs from the specified directory path.
 * @param customPath - Optional path segments to the posts directory. Defaults to root.
 * @returns List of all post slugs.
 */
export function getPostSlugs(customPath = ["", "", "", ""]) {
  const postsDir = path.join(process.cwd(), ...customPath);
  return getMDXFiles(postsDir).map((file) => path.basename(file, path.extname(file)));
}

/**
 * Gets a specific post by its slug.
 * @param slug - The slug of the post to retrieve.
 * @param customPath - Optional path segments to the posts directory. Defaults to root.
 * @returns The post data including metadata and content, or undefined if not found.
 */
export function getPostBySlug(slug: string, customPath = ["", "", "", ""]) {
  // 🛡️ Sentinel: Prevent Path Traversal by validating the slug
  const slugPattern = /^[a-zA-Z0-9_-]+$/;
  if (!slugPattern.test(slug)) {
    console.warn(`Security Warning: Invalid slug format detected: ${slug}`);
    return undefined;
  }

  const postsDir = path.join(process.cwd(), ...customPath);
  const filePath = path.join(postsDir, `${slug}.mdx`);

  if (!fs.existsSync(filePath)) {
    return undefined;
  }

  const { metadata, content } = readMDXFile(filePath);
  return { metadata, slug, content };
}
