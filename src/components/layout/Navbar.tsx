import Link from "next/link";
import { Logo } from "@/components/brand/Logo";
import { WaitlistButton } from "@/components/waitlist/WaitlistButton";
import { NAV_GROUPS } from "@/lib/nav";
import { MobileMenu } from "./MobileMenu";
import { NavDropdown } from "./NavDropdown";
import { NAV_ITEM_CLASS } from "./NavItemRow";

export function Navbar() {
  return (
    <header className="sticky top-0 z-50 bg-background">
      <nav
        aria-label="Main"
        className="relative flex h-(--navbar-height) items-center justify-between px-4 sm:px-6 lg:px-8"
      >
        <div className="flex h-full items-center">
          <Logo />
          {/* While the pointer is over the items, the others dim and the
              hovered one (or an open dropdown's trigger) stays bright. */}
          <div className="group/nav ml-8 hidden h-full items-center gap-7 md:flex">
            {NAV_GROUPS.map((group) =>
              group.href && group.items.length === 0 ? (
                <Link
                  key={group.label}
                  href={group.href}
                  className={NAV_ITEM_CLASS}
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
          <WaitlistButton className="h-9 py-0 pointer-coarse:h-11" />
        </div>
        <MobileMenu />
      </nav>
    </header>
  );
}
