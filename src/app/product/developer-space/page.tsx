import type { Metadata } from "next";
import { ProductPage } from "@/components/sections/ProductPage";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "Developer Space | Build and Manage Agent Extensions",
  description:
    "Configure and manage reusable agent roles, skills, tools, and supported integrations for your development workflows.",
  path: "/product/developer-space",
});

export default function DeveloperSpacePage() {
  return <ProductPage slug="developer-space" />;
}
