import { LoopingVideo } from "@/components/media/LoopingVideo";
import type { ProductSlug } from "@/content/products";

// The "Product preview" card for a work mode: the same fixed 16:9 frame as the
// home page product video (components/home/Hero.tsx), playing the mode's video
// (muted, and paused under prefers-reduced-motion). The screen is keyed on the
// mode, so it fades in and the video restarts when the mode changes. No
// visible "Product preview" badge (owner decision, 2026-10-26); the video's
// aria-label keeps it.
export function PreviewWindow({ slug, name }: { slug: ProductSlug; name: string }) {
  return (
    <div className="relative aspect-video w-full overflow-hidden rounded-card border border-line bg-card shadow-window">
      <div key={slug} className="size-full motion-safe:animate-fade-in">
        <LoopingVideo
          src={`/videos/${slug}.mp4`}
          label={`${name} product preview video`}
        />
      </div>
    </div>
  );
}
