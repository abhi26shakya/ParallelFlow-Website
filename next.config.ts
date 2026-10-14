import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  cacheComponents: true,
  partialPrefetching: true,
  // The three product pages became sections of /product.
  async redirects() {
    return ["arena", "workspace", "developer-space"].map((slug) => ({
      source: `/product/${slug}`,
      destination: `/product#${slug}`,
      permanent: true,
    }));
  },
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;
