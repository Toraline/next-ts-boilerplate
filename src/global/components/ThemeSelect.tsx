"use client";

import { useTheme } from "global/hooks/useTheme";
import { Select } from "global/ui";
import type { Theme } from "global/theme/theme";

const OPTIONS: { value: Theme; label: string }[] = [
  { value: "light", label: "Light" },
  { value: "dark", label: "Dark" },
  { value: "system", label: "System" },
];

export function ThemeSelect() {
  const { theme, setTheme, resolved } = useTheme();

  return (
    <div className="inline-flex items-center gap-2">
      <Select
        label="Theme"
        selectedKey={theme}
        onSelectionChange={(key) => setTheme(key as Theme)}
        options={OPTIONS}
        description={`Applied: ${resolved}`}
      />
    </div>
  );
}
