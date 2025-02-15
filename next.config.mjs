import mdx from "@next/mdx";

const withMDX = mdx({
extension: /.mdx?$/,
options: {},
});

/** @type {import('next').NextConfig} */
const nextConfig = {
pageExtensions: ["ts", "tsx", "md", "mdx"],
output: "export", // Manually specify output so GitHub's action won't try to inject it
};

export default withMDX(nextConfig);
