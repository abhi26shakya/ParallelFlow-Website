import type { Metadata } from "next";
import { ProductPage } from "@/components/sections/ProductPage";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "Workspace | AI-Powered Development | ParallelFlow",
  description:
    "Execute development tasks with AI-assisted sessions, project context, tools, and connected workflows.",
  path: "/product/workspace",
});

export default function WorkspacePage() {
  return <ProductPage slug="workspace" />;
}
