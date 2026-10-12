import type { MetadataRoute } from "next";
import { PUBLIC_ROUTES } from "@/lib/seo";
import { SITE_URL } from "@/lib/site";

export default function sitemap(): MetadataRoute.Sitemap {
  return PUBLIC_ROUTES.map((path) => ({ url: new URL(path, SITE_URL).href }));
}
