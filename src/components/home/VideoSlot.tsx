// Fixed 16:9 slot reserved for the hero motion video, so adding the video
// later causes no layout shift. Replace the placeholder with a <video>
// (muted, no autoplay audio) once the asset exists.
export function VideoSlot() {
  return (
    <div
      role="img"
      aria-label="Product preview video placeholder"
      className="relative mt-16 aspect-video w-full overflow-hidden rounded-card border border-line bg-card"
    >
      <span className="absolute left-4 top-4 rounded-pill border border-line px-3 py-1 text-xs text-muted">
        Product preview
      </span>
      <div className="flex size-full items-center justify-center text-sm text-muted">
        Product video coming soon
      </div>
    </div>
  );
}
