import type { Metadata } from "next";
import { LinkButton } from "@/components/ui/Button";
import { SITE_NAME } from "@/lib/site";

export const metadata: Metadata = {
  title: `Page not found | ${SITE_NAME}`,
};

export default function NotFound() {
  return (
    <main className="mx-auto max-w-xl px-4 py-24 text-center sm:px-6 sm:py-32">
      <p className="font-mono text-xs tracking-widest text-muted">404</p>
      <h1 className="mt-4 text-4xl font-bold tracking-tight sm:text-5xl">
        Page not found
      </h1>
      <p className="mt-6 text-lg text-muted">
        The page you are looking for does not exist or has moved.
      </p>
      <div className="mt-10">
        <LinkButton href="/">Back to home</LinkButton>
      </div>
    </main>
  );
}
