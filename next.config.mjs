import mdx from "@next/mdx";
import withBundleAnalyzer from '@next/bundle-analyzer';

const withMDX = mdx({
  extension: /\.mdx?$/,
  options: {},
});

const bundleAnalyzer = withBundleAnalyzer({
  enabled: process.env.ANALYZE === 'true',
});

/** @type {import('next').NextConfig} */
const nextConfig = {
  pageExtensions: ["ts", "tsx", "md", "mdx"],
  reactStrictMode: true,
  poweredByHeader: false, // 🛡️ Sentinel: Disable X-Powered-By header to prevent information leakage
  experimental: {
    optimizeCss: true,
  },
  images: {
    formats: ['image/avif', 'image/webp'],
    minimumCacheTTL: 60,
  },
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production',
  },
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin',
          },
          {
            key: 'Permissions-Policy',
            value: 'camera=(), microphone=(), geolocation=()',
          },
          {
            key: 'Content-Security-Policy',
            value: "default-src 'self'; script-src 'self' 'unsafe-eval' 'unsafe-inline' https://www.googletagmanager.com; style-src 'self' 'unsafe-inline'; img-src 'self' blob: data: https://www.google-analytics.com https://*.ytimg.com; font-src 'self'; object-src 'none'; base-uri 'self'; form-action 'self' https://app.kit.com; frame-ancestors 'none'; connect-src 'self' https://www.google-analytics.com https://*.googleapis.com https://*.youtube.com; media-src 'self' https://*.youtube.com https://*.youtube-nocookie.com; frame-src 'self' https://*.youtube.com https://*.youtube-nocookie.com; upgrade-insecure-requests;",
          },
          {
            key: 'Strict-Transport-Security',
            value: 'max-age=63072000; includeSubDomains; preload',
          }
        ],
      },
    ];
  },
};

export default bundleAnalyzer(withMDX(nextConfig));
