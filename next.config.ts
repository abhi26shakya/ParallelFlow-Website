import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  cacheComponents: true,
  partialPrefetching: true,
  // The three product pages became sections of /product. Developer Space
  // was later removed (2026-10-22), so its old URL goes to /product.
  // Workspace was renamed Private (2026-10-24), so its old URL goes to
  // #private.
  async redirects() {
    return [
      ...[
        ["arena", "arena"],
        ["workspace", "private"],
      ].map(([slug, anchor]) => ({
        source: `/product/${slug}`,
        destination: `/product#${anchor}`,
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
