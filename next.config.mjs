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
  images: {
    formats: ['image/avif', 'image/webp'],
    minimumCacheTTL: 60,
  },
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production',
  },
};

export default bundleAnalyzer(withMDX(nextConfig));