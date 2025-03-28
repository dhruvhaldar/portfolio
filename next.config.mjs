import mdx from "@next/mdx";
import bundleAnalyzer from "@next/bundle-analyzer";

const withMDX = mdx({
  extension: /\.mdx?$/,
  options: {},
});

const withBundleAnalyzer = bundleAnalyzer({
  enabled: process.env.ANALYZE === "true",
});

/** @type {import('next').NextConfig} */
const nextConfig = {
  pageExtensions: ["ts", "tsx", "md", "mdx"],
  swcMinify: true, // Enable SWC minification
  compress: true, // Enable compression
  poweredByHeader: false, // Remove X-Powered-By header
  reactStrictMode: true,
  compiler: {
    removeConsole: process.env.NODE_ENV === "production", // Remove console.log in production
  },
};

export default withBundleAnalyzer(withMDX(nextConfig));