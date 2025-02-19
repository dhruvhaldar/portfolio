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
        source: "https://www.dhruvhaldar.vercel.app/:path*",
        destination: "https://dhruvhaldar.vercel.app/:path*", // Redirect WWW to non-WWW
        statusCode: 301,
      },
    ];
  },
};

export default withMDX(nextConfig);
