import type { Metadata } from "next";
import { ProductPage } from "@/components/sections/ProductPage";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "Arena | Team and AI Collaboration | ParallelFlow",
  description:
    "Coordinate engineering teams and AI around shared project goals, discussions, tasks, and progress.",
  path: "/product/arena",
});

export default function ArenaPage() {
  return <ProductPage slug="arena" />;
}
