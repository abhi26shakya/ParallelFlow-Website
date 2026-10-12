import type { Metadata } from "next";
import { ProductPage } from "@/components/sections/ProductPage";

export const metadata: Metadata = {
  title: "Arena | Team and AI Collaboration | ParallelFlow",
  description:
    "Coordinate engineering teams and AI around shared project goals, discussions, tasks, and progress.",
};

export default function ArenaPage() {
  return <ProductPage slug="arena" />;
}
