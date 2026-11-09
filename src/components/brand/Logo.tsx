import { useId } from "react";
import Link from "next/link";
import { SITE_NAME } from "@/lib/site";

// Logo traced from the owner's masters in assets/brand (1024px PNGs). The
// mark fills with currentColor, so it is white on the dark theme and black on
// the light theme with no per-theme files. src/app/icon.svg and the social
// image (assets/brand/logo-mark-white.png) use the same paths; update all
// three together.
const LOGO_VIEWBOX = "165 108 694 694";

// Faces of the box, plus the strip where the tape folds from the lid onto the
// front face.
const LOGO_FACES = [
  "M512 108L794 274L512 443L230 274Z",
  "M215 297L497 466V802L215 632Z",
  "M809 297L527 466V802L809 632Z",
  "M397.5 300L322.5 344.2V440H391V387.8L489.2 330Z",
];

// The two tape outlines, cut out of the faces as 36-unit round-capped lines.
const LOGO_TAPE_CUTS =
  "M737.3 100L366.4 318.3A90 90 0 0 0 322.5 395.1V541M795 150L432.5 363.4A85 85 0 0 0 391 435.9V584";

export function Logo({ className = "" }: { className?: string }) {
  return (
    <Link
      href="/"
      aria-label={`${SITE_NAME} home`}
      className={`inline-flex items-center gap-2 rounded-control text-xl font-semibold tracking-tight text-foreground pointer-coarse:min-h-11 ${className}`}
    >
      <LogoMark className="size-7 shrink-0" />
      {SITE_NAME}
    </Link>
  );
}

// The symbol on its own. Decorative; pair it with visible or accessible text.
export function LogoMark({ className = "" }: { className?: string }) {
  const maskId = useId();
  return (
    <svg
      aria-hidden="true"
      viewBox={LOGO_VIEWBOX}
      fill="currentColor"
      className={className}
    >
      <mask
        id={maskId}
        maskUnits="userSpaceOnUse"
        x="0"
        y="0"
        width="1024"
        height="1024"
      >
        <rect width="1024" height="1024" fill="#fff" />
        <path
          d={LOGO_TAPE_CUTS}
          fill="none"
          stroke="#000"
          strokeWidth="36"
          strokeLinecap="round"
        />
      </mask>
      <g mask={`url(#${maskId})`}>
        {LOGO_FACES.map((d) => (
          <path key={d} d={d} />
        ))}
      </g>
    </svg>
  );
}
