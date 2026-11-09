"use client";

import type { LucideIcon } from "lucide-react";
import { LoopingVideo } from "@/components/media/LoopingVideo";

// A Product page mode's video, full size: a 16:9 screen with no blurred
// background or frosted frame (owner request, 2026-11-09). Below it a caption
// shows the active row's icon and title and the row counter. The video plays
// only while on screen and stays paused under reduced motion (LoopingVideo).
// No visible "Product preview" badge (owner decision, 2026-10-26); the video's
// aria-label keeps it.

const pad = (n: number) => String(n).padStart(2, "0");

export function ModeCard({
  video,
  name,
  active,
  count,
  title,
  Icon,
}: {
  video: string;
  name: string;
  active: number;
  count: number;
  title: string;
  Icon: LucideIcon;
}) {
  return (
    <div>
      <div className="pf-mode-screen edge-light shadow-window">
        <LoopingVideo src={video} label={`${name} product preview video`} />
      </div>
      <div aria-hidden="true" className="pf-mode-caption">
        <span
          key={active}
          className="flex min-w-0 items-center gap-2 motion-safe:animate-fade-in"
        >
          <Icon strokeWidth={1.5} className="size-3.5 shrink-0" />
          <span className="truncate">{title}</span>
        </span>
        <span className="ml-auto flex shrink-0 items-center gap-1.5 rounded-pill border border-line px-2 py-0.5 font-mono text-[11px]">
          <span className="size-1.5 rounded-full bg-foreground" />
          <span>
            <span className="text-foreground">{pad(active + 1)}</span>
            {" / "}
            {pad(count)}
          </span>
        </span>
      </div>
      <p aria-live="polite" className="sr-only">
        {title}
      </p>
    </div>
  );
}
