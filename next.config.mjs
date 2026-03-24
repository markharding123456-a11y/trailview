/** @type {import('next').NextConfig} */
const isProd = process.env.NEXT_PUBLIC_BASE_PATH === "/trailview";

const nextConfig = {
  output: "export",
  basePath: isProd ? "/trailview" : "",
  assetPrefix: isProd ? "/trailview/" : "",
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
