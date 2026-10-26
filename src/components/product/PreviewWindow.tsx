import { LoopingVideo } from "@/components/media/LoopingVideo";
import type { ProductSlug } from "@/content/products";

// The "Product preview" card for a work mode: a clean rounded card around a
// fixed 16:9 screen playing the mode's video (muted, and paused under
// prefers-reduced-motion). The screen is keyed on the mode, so it fades in
// and the video restarts when the mode changes. No visible "Product preview"
// badge (owner decision, 2026-10-26); the video's aria-label keeps it.
export function PreviewWindow({ slug, name }: { slug: ProductSlug; name: string }) {
  return (
    <div className="overflow-hidden rounded-card border border-line shadow-window">
      {/* Stays dark in both themes, like a device screen. */}
      <div
        key={slug}
        className="aspect-video bg-[#0a0a0b] motion-safe:animate-fade-in"
      >
        <LoopingVideo
          src={`/videos/${slug}.mp4`}
          label={`${name} product preview video`}
        />
      </div>
    </div>
  );
}
