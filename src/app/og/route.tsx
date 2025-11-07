import { ImageResponse } from "next/og";
import { baseURL } from "@/app/resources";
import { person } from "@/app/resources/content";
// import { Geist } from "next/font/google";
import localFont from "next/font/local";

export const runtime = "edge";

const route_font = localFont({
  src: [
    {
      path: 'src/assets/fonts/Geist-Medium.woff2',
      // weight: '400',
      // style: 'normal',
    },
  ],
  variable: '--font-primary',
  display: 'swap',
});

export async function GET(request: Request) {
  let url = new URL(request.url);
  let title = url.searchParams.get("title") || "Portfolio";

  return new ImageResponse(
    <div
      style={{
        display: "flex",
        width: "100%",
        height: "100%",
        padding: "8rem",
        background: "#151515",
        fontFamily: route_font.style.fontFamily,
      }}
    >
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          gap: "4rem",
          color: "white",
        }}
      >
        <span
          style={{
            fontSize: "8rem",
            lineHeight: "8rem",
            letterSpacing: "-0.05em",
            whiteSpace: "pre-wrap",
            textWrap: "balance",
          }}
        >
          {title}
        </span>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "5rem",
          }}
        >
          <img
            src={`https://${baseURL}${person.avatar}`}
            alt={`${person.name} profile picture`}
            style={{
              width: "12rem",
              height: "12rem",
              objectFit: "cover",
              borderRadius: "100%",
            }}
          />
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "0.75rem",
            }}
          >
            <span
              style={{
                fontSize: "4.5rem",
                lineHeight: "4.5rem",
                whiteSpace: "pre-wrap",
                textWrap: "balance",
              }}
            >
              {person.name}
            </span>
            <span
              style={{
                fontSize: "2.5rem",
                lineHeight: "2.5rem",
                whiteSpace: "pre-wrap",
                textWrap: "balance",
                opacity: "0.6",
              }}
            >
              {person.role}
            </span>
          </div>
        </div>
      </div>
    </div>,
    {
      width: 1920,
      height: 1080,
    }
  );
}
