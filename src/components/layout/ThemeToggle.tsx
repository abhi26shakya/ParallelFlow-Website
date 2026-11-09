"use client";

import { Moon, Sun } from "lucide-react";
import { useEffect, useSyncExternalStore } from "react";
import { THEME_STORAGE_KEY, type Theme } from "@/lib/theme";

// The theme lives on <html data-theme>, set before paint by THEME_SCRIPT.
// React reads it from there so the label always matches what is on screen.
function subscribe(onChange: () => void) {
  const observer = new MutationObserver(onChange);
  observer.observe(document.documentElement, {
    attributes: true,
    attributeFilter: ["data-theme"],
  });
  return () => observer.disconnect();
}

function getTheme(): Theme {
  return document.documentElement.dataset.theme === "light" ? "light" : "dark";
}

function setTheme(theme: Theme) {
  document.documentElement.dataset.theme = theme;
}

function readSavedTheme() {
  try {
    return localStorage.getItem(THEME_STORAGE_KEY);
  } catch {
    return null;
  }
}

// Footer icon button. It shows the mode it switches to: a sun in the dark
// theme, a moon in the light theme. Both icons are always rendered and the
// `light:` variant picks one, so the right icon shows before hydration.
export function ThemeToggle() {
  const theme = useSyncExternalStore(subscribe, getTheme, () => "dark");
  const next: Theme = theme === "dark" ? "light" : "dark";

  // Until the visitor picks a theme, follow system preference changes.
  useEffect(() => {
    const query = matchMedia("(prefers-color-scheme: light)");
    const follow = () => {
      if (!readSavedTheme()) setTheme(query.matches ? "light" : "dark");
    };
    query.addEventListener("change", follow);
    return () => query.removeEventListener("change", follow);
  }, []);

  const icon =
    "absolute size-4 motion-safe:transition-[opacity,rotate,scale] motion-safe:duration-300 motion-safe:ease-out";

  return (
    <button
      type="button"
      aria-label={`Switch to ${next} mode`}
      onClick={() => {
        setTheme(next);
        try {
          localStorage.setItem(THEME_STORAGE_KEY, next);
        } catch {
          // Storage blocked: the switch still applies for this page view.
        }
      }}
      className="relative -ml-2 inline-flex size-8 shrink-0 pointer-coarse:size-11 items-center justify-center rounded-pill text-muted transition-colors hover:text-foreground"
    >
      <Sun
        aria-hidden="true"
        className={`${icon} light:rotate-90 light:scale-50 light:opacity-0`}
      />
      <Moon
        aria-hidden="true"
        className={`${icon} -rotate-90 scale-50 opacity-0 light:rotate-0 light:scale-100 light:opacity-100`}
      />
    </button>
  );
}
