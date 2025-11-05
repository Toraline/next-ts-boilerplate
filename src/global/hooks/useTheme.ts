"use client";

import { useEffect, useMemo, useState } from "react";
import {
  Theme,
  THEME_KEY,
  readStoredTheme,
  storeTheme,
  applyTheme,
  getSystemTheme,
} from "global/theme/theme";

export function useTheme() {
  const [theme, setTheme] = useState<Theme>(() => readStoredTheme());
  const [systemTheme, setSystemTheme] = useState<Exclude<Theme, "system">>(() => getSystemTheme());

  // Derived value: what's actually applied ("light" | "dark")
  const resolved = useMemo(() => (theme === "system" ? systemTheme : theme), [theme, systemTheme]);

  useEffect(() => {
    // 1) Apply current preference immediately
    applyTheme(theme);

    // 2) Listen OS changes ONLY when on "system"
    let mql: MediaQueryList | null = null;
    const onOSChange = (e: MediaQueryListEvent) => {
      const newSystemTheme = e.matches ? "dark" : "light";
      setSystemTheme(newSystemTheme);
      if (theme === "system") {
        applyTheme("system");
      }
    };

    if (theme === "system") {
      mql = window.matchMedia("(prefers-color-scheme: dark)");
      // Update system theme on mount and when it changes
      setSystemTheme(getSystemTheme());
      mql.addEventListener("change", onOSChange);
    }

    // 3) Cross-tab sync
    const onStorage = (e: StorageEvent) => {
      if (e.key === THEME_KEY) {
        const next = (e.newValue as Theme | null) ?? "system";
        setTheme(next);
      }
    };
    window.addEventListener("storage", onStorage);

    // Cleanup
    return () => {
      if (mql) mql.removeEventListener("change", onOSChange);
      window.removeEventListener("storage", onStorage);
    };
  }, [theme]);

  // Persist when user changes preference
  function update(next: Theme) {
    setTheme(next);
    storeTheme(next);
    // applyTheme(next) is called by the effect on next render; we keep side-effects centralized
  }

  return { theme, setTheme: update, resolved };
}
