/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "export",
  basePath: "/trailview",
  assetPrefix: "/trailview/",
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
