import type { Metadata } from "next";
import { ProductPage } from "@/components/sections/ProductPage";

export const metadata: Metadata = {
  title: "Workspace | AI-Powered Development | ParallelFlow",
  description:
    "Execute development tasks with AI-assisted sessions, project context, tools, and connected workflows.",
};

export default function WorkspacePage() {
  return <ProductPage slug="workspace" />;
}
