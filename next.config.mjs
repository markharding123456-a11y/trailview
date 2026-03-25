/** @type {import('next').NextConfig} */

const isCloudflare = process.env.DEPLOY_TARGET === "cloudflare";

const nextConfig = {
  output: "export",
  // GitHub Pages needs /trailview prefix; Cloudflare Pages serves from root
  ...(isCloudflare
    ? {}
    : {
        basePath: "/trailview",
        assetPrefix: "/trailview/",
      }),
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
