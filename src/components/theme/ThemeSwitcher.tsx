"use client";

import { Monitor, Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { useState, useSyncExternalStore } from "react";

const OPTIONS = [
  { value: "light", icon: Sun, label: "Clair" },
  { value: "dark", icon: Moon, label: "Sombre" },
  { value: "system", icon: Monitor, label: "Système" },
] as const;

const emptySubscribe = () => () => {};
const getIsClient = () => true;
const getIsClientServer = () => false;

export function ThemeSwitcher() {
  const { theme, setTheme } = useTheme();
  const [open, setOpen] = useState(false);
  const mounted = useSyncExternalStore(
    emptySubscribe,
    getIsClient,
    getIsClientServer,
  );

  if (!mounted) {
    return <div className="size-9" aria-hidden="true" />;
  }

  const active = theme === "dark" ? Moon : theme === "light" ? Sun : Monitor;
  const ActiveIcon = active;

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-label="Changer le thème"
        aria-expanded={open}
        aria-haspopup="menu"
        className="text-encre/80 hover:text-encre hover:bg-creme-foncee dark:text-creme/80 dark:hover:text-creme dark:hover:bg-encre/40 rounded-control focus-visible:ring-bleu inline-flex size-9 items-center justify-center transition focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none"
      >
        <ActiveIcon className="size-4" />
      </button>

      {open ? (
        <>
          <div
            className="fixed inset-0 z-40"
            onClick={() => setOpen(false)}
            aria-hidden="true"
          />
          <div
            role="menu"
            className="border-bordurewarm-tertiary bg-blanc-casse shadow-card dark:border-encre/20 dark:bg-encre rounded-card absolute top-full right-0 z-50 mt-2 min-w-[140px] border py-1"
          >
            {OPTIONS.map(({ value, icon: I, label }) => {
              const isActive = theme === value;
              return (
                <button
                  key={value}
                  role="menuitemradio"
                  aria-checked={isActive}
                  type="button"
                  onClick={() => {
                    setTheme(value);
                    setOpen(false);
                  }}
                  className={`hover:bg-creme-foncee dark:hover:bg-encre/40 flex w-full items-center gap-2 px-3 py-1.5 text-sm transition ${
                    isActive
                      ? "text-bleu font-semibold"
                      : "text-encre/80 dark:text-creme/80"
                  }`}
                >
                  <I className="size-3.5" aria-hidden="true" />
                  {label}
                </button>
              );
            })}
          </div>
        </>
      ) : null}
    </div>
  );
}
