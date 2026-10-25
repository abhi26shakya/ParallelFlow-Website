import type { MetadataRoute } from "next";
import { getAllPosts } from "@/lib/blog";
import { PUBLIC_ROUTES } from "@/lib/seo";
import { SITE_URL } from "@/lib/site";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const posts = await getAllPosts();
  return [
    ...PUBLIC_ROUTES.map((path) => ({ url: new URL(path, SITE_URL).href })),
    ...posts.map((post) => ({
      url: new URL(`/blog/${post.slug}`, SITE_URL).href,
      lastModified: post.date,
    })),
  ];
}
