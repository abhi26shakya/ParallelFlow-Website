import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  cacheComponents: true,
  partialPrefetching: true,
  // The three product pages became sections of /product. Developer Space
  // was later removed (2026-10-22), so its old URL goes to /product.
  async redirects() {
    return [
      ...["arena", "workspace"].map((slug) => ({
        source: `/product/${slug}`,
        destination: `/product#${slug}`,
        permanent: true,
      })),
      {
        source: "/product/developer-space",
        destination: "/product",
        permanent: true,
      },
    ];
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
