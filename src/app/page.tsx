import type { Metadata } from "next";
import { HomeBody } from "@/components/home/HomeBody";
import { Hero, ProductPreview } from "@/components/home/Hero";
import { VALUE_PROPOSITION } from "@/content/home";
import { pageMetadata } from "@/lib/seo";
import { SITE_NAME, SITE_URL } from "@/lib/site";

export const metadata: Metadata = pageMetadata({
  title: "ParallelFlow | You imagine. Agents execute.",
  description:
    "A shared workspace where humans and AI turn ideas into finished work.",
  path: "/",
});

// Only facts that are true today: name, address and the value proposition.
// No logo, social profiles, ratings or offers until they exist.
const structuredData = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Organization",
      "@id": new URL("/#organization", SITE_URL).href,
      name: SITE_NAME,
      url: SITE_URL.href,
      description: VALUE_PROPOSITION,
    },
    {
      "@type": "WebSite",
      "@id": new URL("/#website", SITE_URL).href,
      name: SITE_NAME,
      url: SITE_URL.href,
      description: VALUE_PROPOSITION,
      publisher: { "@id": new URL("/#organization", SITE_URL).href },
    },
  ],
};

export default function Home() {
  return (
    <main>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(structuredData).replace(/</g, "\\u003c"),
        }}
      />
      <Hero />
      <ProductPreview />
      <HomeBody />
    </main>
  );
}
