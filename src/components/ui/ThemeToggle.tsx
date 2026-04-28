"use client";

import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { useState, useSyncExternalStore } from "react";

const emptySubscribe = () => () => {};
const getIsClient = () => true;
const getIsClientServer = () => false;

export function ThemeToggle() {
  const { theme, resolvedTheme, setTheme } = useTheme();
  const mounted = useSyncExternalStore(
    emptySubscribe,
    getIsClient,
    getIsClientServer,
  );
  // Local optimistic state to keep the icon swap snappy without waiting
  // for next-themes to flush back through context.
  const [, force] = useState(0);

  if (!mounted) {
    return <div className="size-9" aria-hidden="true" />;
  }

  const current = (resolvedTheme ?? theme) === "dark" ? "dark" : "light";
  const next = current === "dark" ? "light" : "dark";

  return (
    <button
      type="button"
      onClick={() => {
        setTheme(next);
        force((n) => n + 1);
      }}
      className="border-bordurewarm-tertiary hover:bg-creme-foncee dark:hover:bg-blanc-casse/5 focus-visible:ring-vert text-encre inline-flex size-9 items-center justify-center rounded-md border transition-colors focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none"
      aria-label={
        current === "dark" ? "Passer en thème clair" : "Passer en thème sombre"
      }
    >
      {current === "dark" ? (
        <Sun className="size-4" />
      ) : (
        <Moon className="size-4" />
      )}
    </button>
  );
}
