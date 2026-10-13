"use client";

import { THEME_SCRIPT } from "@/lib/theme";

// Runs THEME_SCRIPT during HTML parsing, before first paint. On the client
// the tag is rendered as text/plain, so React doesn't warn about a script
// tag and nothing runs twice (Next.js "Preventing flash" guide).
export function ThemeScript() {
  return (
    <script
      type={typeof window === "undefined" ? "text/javascript" : "text/plain"}
      suppressHydrationWarning
      dangerouslySetInnerHTML={{ __html: THEME_SCRIPT }}
    />
  );
}
