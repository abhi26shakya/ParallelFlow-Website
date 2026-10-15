// The "Product preview" card for a work mode: a clean rounded card around a
// fixed 16:9 slot left blank for the mode's motion graphic video, so adding it
// later causes no layout shift. A <video> placed in the screen must be muted,
// with no autoplay audio, and should pause under prefers-reduced-motion.
// The screen is keyed on the mode, so it fades in when the mode changes.
//
// While the card is blank it has no visible label (owner decision,
// 2026-10-15). CLAUDE.md requires product visuals to be labelled "Product
// preview", so add a visible label back when the videos go in.
export function PreviewWindow({ name }: { name: string }) {
  return (
    <div
      role="img"
      aria-label={`${name} product preview, video coming soon`}
      className="overflow-hidden rounded-card border border-line shadow-window"
    >
      {/* Stays dark in both themes, like a device screen. */}
      <div
        key={name}
        className="aspect-video bg-[#0a0a0b] motion-safe:animate-fade-in"
      />
    </div>
  );
}
