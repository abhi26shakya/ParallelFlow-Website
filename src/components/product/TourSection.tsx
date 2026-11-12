import type { ReactNode } from "react";
import { LoopingVideo } from "@/components/media/LoopingVideo";
import type { SectionMedia, TourSectionContent } from "@/content/product-page";
import "./product.css";

// One stop on the Product page tour: copy on one side and its screen on the
// other, about one screen tall from lg. `side` puts the copy left or right,
// so the sections alternate. Below lg the copy stacks above the screen.
// `large` gives the screen more of the width and the heading more size
// (Roles, the page's largest section, owner plan 2026-11-12). The section id
// is the anchor used by the sub-navigation (and, for Private and Arena, by
// the navbar and footer).
export function TourSection({
  section,
  side,
  large = false,
  children,
}: {
  section: Pick<TourSectionContent, "id" | "eyebrow" | "title" | "body" | "bullets">;
  side: "left" | "right";
  large?: boolean;
  children?: ReactNode;
}) {
  const titleId = `${section.id}-title`;
  return (
    <section
      id={section.id}
      aria-labelledby={titleId}
      className="border-t border-line"
    >
      <div
        className={`mx-auto grid max-w-7xl items-center gap-10 px-4 py-20 sm:px-6 sm:py-24 lg:min-h-[calc(100svh-var(--navbar-height)-var(--subnav-height))] lg:gap-16 lg:py-16 ${
          large
            ? "lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)]"
            : "lg:grid-cols-2"
        }`}
      >
        <div className={side === "right" ? "lg:order-2" : undefined}>
          <p className="font-mono text-xs uppercase tracking-widest text-muted">
            {section.eyebrow}
          </p>
          <h2
            id={titleId}
            className={`mt-3 font-light leading-[1.05] tracking-[-0.02em] text-balance ${
              large
                ? "text-[clamp(40px,5vw,72px)]"
                : "text-[clamp(36px,3.8vw,56px)]"
            }`}
          >
            {section.title}
          </h2>
          {section.body && (
            <p className="mt-5 max-w-[48ch] text-lg leading-relaxed text-pretty text-muted">
              {section.body}
            </p>
          )}
          {section.bullets && (
            <ul className="mt-8 divide-y divide-line border-y border-line">
              {section.bullets.map((item) => (
                <li key={item.title} className="py-4">
                  <p className="text-base font-medium">{item.title}</p>
                  <p className="mt-1 text-sm leading-relaxed text-pretty text-muted">
                    {item.body}
                  </p>
                </li>
              ))}
            </ul>
          )}
        </div>
        <div className={side === "right" ? "lg:order-1" : undefined}>
          {children}
        </div>
      </div>
    </section>
  );
}

// A section's 16:9 screen: the video, or an empty frame waiting for footage
// (owner choice, 2026-11-12). Never taller than the screen. Videos keep
// their aria-label and show no visible badge (owner decision, 2026-10-26).
export function TourScreen({ media }: { media: SectionMedia }) {
  return (
    <div className="pf-screen edge-light shadow-window">
      {media.kind === "video" ? (
        <LoopingVideo src={media.src} label={media.label} />
      ) : (
        <div aria-hidden="true" className="size-full" />
      )}
    </div>
  );
}
