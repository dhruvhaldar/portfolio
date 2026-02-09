import { ImageResponse } from "next/og";
import { baseURL } from "@/app/resources";
import { colors } from "@/once-ui/tokens/colors";
import { person } from "@/app/resources/content";
import { getPostBySlug, getPosts } from "@/app/utils/utils";

export const runtime = "nodejs";
export const dynamic = "force-static";
export const alt = "Blog Post OpenGraph Image";
export const size = {
  width: 1200,
  height: 630,
};

export const contentType = "image/png";

import fs from "fs";
import path from "path";

const font = fs.readFileSync(path.join(process.cwd(), "public/fonts/Geist-SemiBold.ttf"));

export async function generateStaticParams() {
  const posts = getPosts(["src", "app", "blog", "posts"]);
  return posts.map((post) => ({
    slug: post.slug,
  }));
}

export default async function Image({ params }: { params: { slug: string } }) {
  const fontData = font;
  const { slug } = params;
  const post = getPostBySlug(slug, ["src", "app", "blog", "posts"]);
  const title = post?.metadata.title || "Blog Post";
  const summary = post?.metadata.summary || person.role;

  const avatarBuffer = fs.readFileSync(path.join(process.cwd(), "public/images/my_profile.png"));
  const avatarSrc = `data:image/png;base64,${avatarBuffer.toString('base64')}`;

  return new ImageResponse(
    (
      <div
        style={{
          display: "flex",
          width: "100%",
          height: "100%",
          background: colors.slate[100],
          flexDirection: "column",
          alignItems: "flex-start",
          justifyContent: "space-between",
          padding: "80px",
          fontFamily: "Geist, sans-serif",
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* Background Elements */}
        <div
          style={{
            position: "absolute",
            top: "-20%",
            right: "-20%",
            width: "800px",
            height: "800px",
            background: "radial-gradient(circle, rgba(149, 133, 250, 0.15) 0%, rgba(4, 8, 22, 0) 70%)", // Indigo/Violet tint for blog
            borderRadius: "50%",
            zIndex: 0,
          }}
        />

        <div style={{ zIndex: 1, display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div
            style={{
              fontSize: "24px",
              color: colors.indigo[600], // Indigo 600 for blog
              textTransform: "uppercase",
              letterSpacing: "0.1em",
            }}
          >
            Blog
          </div>
          <h1
            style={{
              fontSize: "80px",
              fontWeight: 600,
              color: "white",
              margin: 0,
              lineHeight: 1.1,
              maxWidth: "900px",
              textWrap: "balance",
            }}
          >
            {title}
          </h1>
          <p
            style={{
              fontSize: "36px",
              color: colors.slate[600], // Slate 600
              margin: 0,
              maxWidth: "900px",
              lineHeight: 1.4,
            }}
          >
            {summary.length > 120 ? summary.slice(0, 120) + "..." : summary}
          </p>
        </div>

        <div style={{ zIndex: 1, display: "flex", alignItems: "center", gap: "20px" }}>
          <img
            src={avatarSrc}
            alt={person.name}
            style={{
              width: "64px",
              height: "64px",
              borderRadius: "50%",
              objectFit: "cover",
              border: "2px solid rgba(255, 255, 255, 0.1)",
            }}
          />
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <span style={{ fontSize: "24px", color: "white" }}>{person.name}</span>
            <span style={{ fontSize: "18px", color: colors.slate[600] }}>{person.role}</span>
          </div>
        </div>

      </div>
    ),
    {
      ...size,
      fonts: [
        {
          name: "Geist",
          data: fontData,
          style: "normal",
          weight: 600,
        },
      ],
    }
  );
}
