import type { Metadata } from "next";
import { HomeBody } from "@/components/home/HomeBody";
import { Hero } from "@/components/home/Hero";
import { WaitlistForm } from "@/components/waitlist/WaitlistForm";
import { VALUE_PROPOSITION } from "@/content/home";
import { pageMetadata } from "@/lib/seo";
import { SITE_NAME, SITE_URL } from "@/lib/site";

export const metadata: Metadata = pageMetadata({
  title: "ParallelFlow | Collaborative AI Development Workspace",
  description:
    "Bring your team, AI agents, tasks, and project context together in one workspace to plan, build, and ship software.",
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
      <HomeBody />
      <div className="border-t border-line">
        <section
          id="waitlist"
          className="mx-auto max-w-xl scroll-mt-(--navbar-height) px-4 py-20 sm:px-6 sm:py-24"
        >
          <h2 className="text-center text-3xl font-bold tracking-tight sm:text-4xl">
            Join Waitlist
          </h2>
          <p className="mb-8 mt-3 text-center text-muted">
            Be among the first to explore ParallelFlow.
          </p>
          <WaitlistForm />
        </section>
      </div>
    </main>
  );
}
