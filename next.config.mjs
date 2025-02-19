import mdx from "@next/mdx";

const withMDX = mdx({
extension: /.mdx?$/,
options: {},
});

/** @type {import('next').NextConfig} */
const nextConfig = {
pageExtensions: ["ts", "tsx", "md", "mdx"],
async redirects() {
    return [
      {
        source: "/:path*", // Match all paths
        has: [{ type: "host", value: "www.dhruvhaldar.vercel.app" }], // Check if the request is for www
        destination: "https://dhruvhaldar.vercel.app/:path*", // Redirect to non-www
        statusCode: 301, // 301 redirect for SEO
      },
    ];
  }
  
};

export default withMDX(nextConfig);
