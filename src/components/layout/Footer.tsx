import { Logo } from "@/components/brand/Logo";
import { SITE_NAME, SITE_TAGLINE } from "@/lib/site";
import { CopyrightYear } from "./CopyrightYear";

// Link columns (Product, Solutions, Resources, Company) and the Privacy/
// Terms links are added only once their destination pages exist.
export function Footer() {
  return (
    <footer className="border-t border-line">
      <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
        <Logo />
        <p className="mt-3 max-w-sm text-sm text-muted">{SITE_TAGLINE}</p>
        <p className="mt-10 text-sm text-muted">
          &copy; <CopyrightYear /> {SITE_NAME}. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
