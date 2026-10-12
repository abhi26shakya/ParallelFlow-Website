import { Logo } from "@/components/brand/Logo";
import { LinkButton } from "@/components/ui/Button";
import { NAV_GROUPS, NAV_PRICING } from "@/lib/nav";
import { WAITLIST_HREF } from "@/lib/site";
import { MobileMenu } from "./MobileMenu";
import { NavDropdown } from "./NavDropdown";
import { NavItemRow } from "./NavItemRow";

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
            {NAV_GROUPS.map((group) => (
              <NavDropdown key={group.label} group={group} />
            ))}
            <NavItemRow item={NAV_PRICING} />
          </div>
        </div>
        <div className="hidden md:block">
          <LinkButton href={WAITLIST_HREF}>Join Waitlist</LinkButton>
        </div>
        <MobileMenu />
      </nav>
    </header>
  );
}
