import "@/once-ui/styles/index.scss";
import { colors } from "@/once-ui/tokens/colors";
import "@/once-ui/tokens/index.scss";
import { baseURL, effects, style } from "@/app/resources";
import { Header, RouteGuard } from "@/components";
import classNames from "classnames";
import dynamic from "next/dynamic";
import { Geist } from "next/font/google";

import { home, person } from "@/app/resources/content";
import { themeScript } from "@/app/resources/theme-script";
import GoogleAnalytics from "@/components/GoogleAnalytics";
import { Background, Column, Flex, ToastProvider } from "@/once-ui/components";

const Footer = dynamic(() => import("@/components/Footer").then((mod) => mod.Footer), {
  loading: () => <div>Loading Footer...</div>,
});

export async function generateMetadata() {
  const title = home.title;
  const description = home.description;
  const pageUrl = `https://${baseURL}`;

  return {
    title,
    description,
    metadataBase: new URL(pageUrl),
    alternates: {
      canonical: "./",
    },
    icons: {
      icon: [
        { url: "/favicon.ico", sizes: "48x48", type: "image/x-icon" },
        { url: "/favicon-16x16.png", sizes: "16x16", type: "image/png" },
        { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
        { url: "/android-chrome-192x192.jpg", sizes: "192x192", type: "image/jpeg" },
        { url: "/android-chrome-512x512.jpg", sizes: "512x512", type: "image/jpeg" },
      ],
      shortcut: "/favicon.ico",
      apple: "/apple-icon.png",
      manifest: "/manifest.webmanifest",
      other: {
        rel: "apple-touch-icon",
        url: "/apple-touch-icon-precomposed.png",
        "theme-color": colors.cyan[800],
      },
    },
    openGraph: {
      title,
      description,
      type: "website",
      url: pageUrl,
      siteName: `${person.firstName} Portfolio (With Projects & Publications)`,
      locale: "en_US",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        "max-video-preview": -1,
        "max-image-preview": "large",
        "max-snippet": -1,
      },
    },
  };
}

// Font Settings
const geist = Geist({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-geist",
});

// Set up font variables
const fontVariables = {
  "--font-primary": "var(--font-geist, system-ui, sans-serif)",
  "--font-secondary": "var(--font-geist, system-ui, sans-serif)",
  "--font-tertiary": "var(--font-geist, system-ui, sans-serif)",
  "--font-code":
    'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace',
};

interface RootLayoutProps {
  children: React.ReactNode;
}

export default async function RootLayout({ children }: RootLayoutProps) {
  return (
    <Flex
      as="html"
      lang="en"
      suppressHydrationWarning
      background="page"
      data-neutral={style.neutral}
      data-brand={style.brand}
      data-accent={style.accent}
      data-solid={style.solid}
      data-solid-style={style.solidStyle}
      data-theme={style.theme}
      data-border={style.border}
      data-surface={style.surface}
      data-transition={style.transition}
      className={classNames(geist.variable, style.variables, effects.variables)}
      style={fontVariables as React.CSSProperties}
    >
      <head>
        {/* 🛡️ Sentinel: Enforce strict CSP to block tracking and require privacy-enhanced YouTube embeds */}
        <meta
          httpEquiv="Content-Security-Policy"
          content="default-src 'self'; script-src 'self' 'unsafe-inline' https://www.googletagmanager.com; style-src 'self' 'unsafe-inline'; img-src 'self' blob: data: https://www.google-analytics.com https://*.ytimg.com; font-src 'self'; object-src 'none'; base-uri 'self'; form-action 'self' https://app.kit.com; connect-src 'self' https://www.google-analytics.com https://*.googleapis.com https://*.youtube.com; media-src 'self' https://*.youtube-nocookie.com; frame-src 'self' https://*.youtube-nocookie.com; upgrade-insecure-requests;"
        />
        <meta name="referrer" content="strict-origin-when-cross-origin" />
      </head>
      <ToastProvider>
        <Column
          style={{ minHeight: "100vh" }}
          as="body"
          fillWidth
          margin="0"
          padding="0"
          className="font-sans antialiased"
        >
          <script
            id="anti-clickjack"
            // biome-ignore lint/security/noDangerouslySetInnerHtml: Frame buster to prevent clickjacking in static export
            dangerouslySetInnerHTML={{
              __html: `
                if (typeof window !== 'undefined' && window.top !== window.self) {
                  try {
                    window.top.location = window.self.location;
                  } catch (e) {
                    document.documentElement.style.display = 'none';
                  }
                }
              `,
            }}
          />
          <script
            // biome-ignore lint/security/noDangerouslySetInnerHtml: Theme script injection is safe and necessary for FOUC prevention
            dangerouslySetInnerHTML={{
              __html: themeScript,
            }}
          />
          <a href="#main-content" className="skip-to-content">
            Skip to main content
          </a>
          <GoogleAnalytics gaId="G-D5DG6N0RGV" />
          <Background
            mask={{
              cursor: effects.mask.cursor,
              x: effects.mask.x,
              y: effects.mask.y,
              radius: effects.mask.radius,
            }}
            gradient={{
              display: effects.gradient.display,
              x: effects.gradient.x,
              y: effects.gradient.y,
              width: effects.gradient.width,
              height: effects.gradient.height,
              tilt: effects.gradient.tilt,
              colorStart: effects.gradient.colorStart,
              colorEnd: effects.gradient.colorEnd,
              opacity: effects.gradient.opacity as
                | 0
                | 10
                | 20
                | 30
                | 40
                | 50
                | 60
                | 70
                | 80
                | 90
                | 100,
            }}
            dots={{
              display: effects.dots.display,
              color: effects.dots.color,
              size: effects.dots.size as any,
              opacity: effects.dots.opacity as any,
            }}
            grid={{
              display: effects.grid.display,
              color: effects.grid.color,
              width: effects.grid.width as any,
              height: effects.grid.height as any,
              opacity: effects.grid.opacity as any,
            }}
            lines={{
              display: effects.lines.display,
              opacity: effects.lines.opacity as any,
            }}
          />
          <Flex fillWidth minHeight="16" />
          <Header />
          <Flex
            id="main-content"
            tabIndex={-1}
            position="relative"
            zIndex={0}
            fillWidth
            paddingY="l"
            paddingX="l"
            horizontal="center"
            flex={1}
            style={{ outline: "none" }}
          >
            <Flex horizontal="center" fillWidth minHeight="0">
              <RouteGuard>{children}</RouteGuard>
            </Flex>
          </Flex>
          <Footer />
          <div id="portal-root" />
        </Column>
      </ToastProvider>
    </Flex>
  );
}
