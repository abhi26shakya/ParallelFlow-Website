"use client";

import { Play, X } from "lucide-react";
import { useRef } from "react";

// "Watch the full demo" on the Product page hero: opens the home page's
// product video in a native <dialog> (focus stays inside, Escape closes).
// The video loads only when opened (preload="none") and pauses on close.
// Clicking the backdrop closes it too.
export function DemoVideoButton({ label }: { label: string }) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  const open = () => {
    dialogRef.current?.showModal();
    videoRef.current?.play().catch(() => {});
  };
  const close = () => dialogRef.current?.close();

  return (
    <>
      <button
        type="button"
        aria-haspopup="dialog"
        onClick={open}
        className="inline-flex h-11 items-center gap-2 rounded-pill px-4 text-sm font-semibold text-foreground transition-colors hover:bg-hover"
      >
        {label}
        <Play aria-hidden="true" strokeWidth={1.5} className="size-4" />
      </button>
      <dialog
        ref={dialogRef}
        aria-label="ParallelFlow product demo"
        onClose={() => videoRef.current?.pause()}
        onClick={(e) => {
          if (e.target === e.currentTarget) close();
        }}
        className="m-auto w-[min(1200px,calc(100vw-2rem))] max-w-none bg-transparent p-0 backdrop:bg-black/80"
      >
        <div className="relative">
          <button
            type="button"
            onClick={close}
            aria-label="Close video"
            className="absolute -top-12 right-0 flex size-10 items-center justify-center rounded-pill text-white hover:bg-white/10"
          >
            <X aria-hidden="true" strokeWidth={1.5} className="size-5" />
          </button>
          <video
            ref={videoRef}
            src="/videos/product-preview.mp4"
            className="aspect-video w-full rounded-card border border-line bg-black"
            controls
            muted
            playsInline
            preload="none"
          />
        </div>
      </dialog>
    </>
  );
}
