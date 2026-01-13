import { ImageResponse } from "next/og";
import { baseURL } from "@/app/resources";
import { person, blog } from "@/app/resources/content";
import { Geist } from "next/font/google";

export const runtime = "nodejs";
export const dynamic = "force-static";
export const alt = "Blog OpenGraph Image";
export const size = {
  width: 1200,
  height: 630,
};

export const contentType = "image/png";

import fs from "fs";
import path from "path";

const font = fs.readFileSync(path.join(process.cwd(), "public/fonts/Geist-SemiBold.ttf"));

export default async function Image() {
  const fontData = font;
  const avatarBuffer = fs.readFileSync(path.join(process.cwd(), "public/images/my_profile.png"));
  const avatarSrc = `data:image/png;base64,${avatarBuffer.toString('base64')}`;

  return new ImageResponse(
    (
      <div
        style={{
          display: "flex",
          width: "100%",
          height: "100%",
          background: "#040816",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          fontFamily: "Geist, sans-serif",
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* Background Gradient */}
        <div
          style={{
            position: "absolute",
            top: "-50%",
            left: "50%",
            transform: "translateX(-50%)",
            width: "150%",
            height: "150%",
            background: "radial-gradient(circle, rgba(149, 133, 250, 0.2) 0%, rgba(4, 8, 22, 0) 70%)",
            zIndex: 0,
          }}
        />

        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 1,
            gap: "24px",
          }}
        >
          {/* Avatar */}
          <img
            src={avatarSrc}
            alt={person.name}
            style={{
              width: "140px",
              height: "140px",
              borderRadius: "50%",
              objectFit: "cover",
              border: "4px solid rgba(255, 255, 255, 0.1)",
              boxShadow: "0 8px 32px rgba(0, 0, 0, 0.2)",
            }}
          />

          {/* Text Content */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: "12px",
            }}
          >
             <div
                style={{
                  fontSize: "24px",
                  color: "#9585FA",
                  textTransform: "uppercase",
                  letterSpacing: "0.1em",
                }}
              >
                Journal
              </div>
            <h1
              style={{
                fontSize: "80px",
                fontWeight: 600,
                color: "white",
                margin: 0,
                lineHeight: 1.1,
                textAlign: "center",
                textShadow: "0 2px 10px rgba(0, 0, 0, 0.3)",
              }}
            >
              {blog.title}
            </h1>
            <p
              style={{
                fontSize: "32px",
                color: "#8E94AA",
                margin: 0,
                textAlign: "center",
                maxWidth: "800px",
              }}
            >
              {blog.description}
            </p>
          </div>
        </div>

        {/* Decorative elements */}
        <div style={{
            position: "absolute",
            bottom: "40px",
            display: "flex",
            gap: "12px",
            alignItems: "center"
        }}>
           <div style={{ width: "8px", height: "8px", borderRadius: "50%", background: "#9585FA" }}></div>
           <div style={{ fontSize: "24px", color: "#8E94AA" }}>{baseURL}</div>
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
