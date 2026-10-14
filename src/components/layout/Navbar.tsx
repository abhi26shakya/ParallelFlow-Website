import Link from "next/link";
import { Logo } from "@/components/brand/Logo";
import { WaitlistButton } from "@/components/waitlist/WaitlistButton";
import { NAV_GROUPS } from "@/lib/nav";
import { MobileMenu } from "./MobileMenu";
import { NavDropdown } from "./NavDropdown";

export function Navbar() {
  return (
    <header className="sticky top-0 z-50 border-b border-line bg-background">
      <nav
        aria-label="Main"
        className="relative mx-auto flex h-(--navbar-height) max-w-6xl items-center justify-between px-4 sm:px-6"
      >
        <div className="flex items-center gap-6">
          <Logo />
          <div className="hidden items-center gap-1 md:flex">
            {NAV_GROUPS.map((group) =>
              group.href ? (
                <Link
                  key={group.label}
                  href={group.href}
                  className="inline-flex items-center rounded-control px-3 py-2 text-sm font-medium text-foreground transition-colors hover:bg-hover"
                >
                  {group.label}
                </Link>
              ) : (
                <NavDropdown key={group.label} group={group} />
              ),
            )}
          </div>
        </div>
        <div className="hidden md:block">
          <WaitlistButton />
        </div>
        <MobileMenu />
      </nav>
    </header>
  );
}
