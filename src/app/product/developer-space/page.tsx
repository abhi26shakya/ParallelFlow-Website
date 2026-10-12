import type { Metadata } from "next";
import { ProductPage } from "@/components/sections/ProductPage";

export const metadata: Metadata = {
  title: "Developer Space | Build and Manage Agent Extensions",
  description:
    "Configure and manage reusable agent roles, skills, tools, and supported integrations for your development workflows.",
};

export default function DeveloperSpacePage() {
  return <ProductPage slug="developer-space" />;
}
