// Fixed 16:9 slot reserved for a product video or visual, so adding the
// asset later causes no layout shift. Replace the placeholder with the real
// asset (a <video> must be muted, no autoplay audio) once it exists.
export function PreviewSlot({
  description,
  placeholder,
}: {
  description: string;
  placeholder: string;
}) {
  return (
    <div
      role="img"
      aria-label={description}
      className="relative mt-16 aspect-video w-full overflow-hidden rounded-card border border-line bg-card"
    >
      <span className="absolute left-4 top-4 rounded-pill border border-line px-3 py-1 text-xs text-muted">
        Product preview
      </span>
      <div className="flex size-full items-center justify-center text-sm text-muted">
        {placeholder}
      </div>
    </div>
  );
}
