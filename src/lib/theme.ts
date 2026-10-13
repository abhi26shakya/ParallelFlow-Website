export type Theme = "light" | "dark";

// localStorage key. Only the theme value is stored, never anything else.
export const THEME_STORAGE_KEY = "theme";

// Runs in <head> before first paint (layout.tsx): the saved choice wins,
// otherwise the system preference. Without JavaScript the site stays dark.
export const THEME_SCRIPT = `(function(){try{var t=localStorage.getItem("${THEME_STORAGE_KEY}");if(t!=="light"&&t!=="dark")t=matchMedia("(prefers-color-scheme: light)").matches?"light":"dark";document.documentElement.setAttribute("data-theme",t)}catch(e){}})()`;
