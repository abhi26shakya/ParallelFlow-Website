import createMDX from "@next/mdx";
import type { NextConfig } from "next";

// Content Security Policy without nonces, so pages stay static (nonces force
// every page to render per request). Next.js and the theme script use inline
// scripts, hence 'unsafe-inline'; dev also needs 'unsafe-eval' for fast
// refresh. Everything else, including fonts, images and videos, is
// same-origin. No upgrade-insecure-requests: it would break `next start` over
// http on localhost, and HSTS below covers https in production.
const isDev = process.env.NODE_ENV === "development";

const contentSecurityPolicy = [
  "default-src 'self'",
  `script-src 'self' 'unsafe-inline'${isDev ? " 'unsafe-eval'" : ""}`,
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' blob: data:",
  "font-src 'self'",
  "media-src 'self'",
  "connect-src 'self'",
  "object-src 'none'",
  "base-uri 'self'",
  "form-action 'self'",
  "frame-ancestors 'none'",
].join("; ");

const securityHeaders = [
  { key: "Content-Security-Policy", value: contentSecurityPolicy },
  // For older browsers that ignore frame-ancestors.
  { key: "X-Frame-Options", value: "DENY" },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  {
    key: "Permissions-Policy",
    value: "camera=(), microphone=(), geolocation=(), browsing-topics=()",
  },
  // Browsers ignore this over plain http, so localhost is unaffected. Not
  // "preload": joining the preload list is hard to undo.
  {
    key: "Strict-Transport-Security",
    value: "max-age=63072000; includeSubDomains",
  },
];

const nextConfig: NextConfig = {
  cacheComponents: true,
  partialPrefetching: true,
  poweredByHeader: false,
  async headers() {
    return [{ source: "/:path*", headers: securityHeaders }];
  },
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

// Blog posts are .mdx files in src/content/blog/posts. Plugins are named as
// strings because Turbopack cannot take JavaScript functions.
const withMDX = createMDX({
  options: {
    remarkPlugins: ["remark-gfm"],
    rehypePlugins: ["rehype-slug"],
  },
});

export default withMDX(nextConfig);
