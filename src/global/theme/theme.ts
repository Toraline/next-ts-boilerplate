export type Theme = "light" | "dark" | "system";
export const THEME_KEY = "theme";

export function getSystemTheme(): Exclude<Theme, "system"> {
  if (typeof window === "undefined") return "light";
  return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
}

export function readStoredTheme(): Theme {
  if (typeof window === "undefined") return "system";
  const t = window.localStorage.getItem(THEME_KEY) as Theme | null;
  return t ?? "system";
}

export function storeTheme(next: Theme) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(THEME_KEY, next);
}

export function resolveTheme(t: Theme): Exclude<Theme, "system"> {
  return t === "system" ? getSystemTheme() : t;
}

export function applyTheme(preference: Theme) {
  if (typeof document === "undefined") return;
  document.documentElement.setAttribute("data-theme", resolveTheme(preference));
}
