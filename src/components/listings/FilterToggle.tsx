"use client";

import { useTranslations } from "next-intl";

import { cn } from "@/lib/utils";

export type PublisherFilter = "all" | "pap" | "agency" | "developer";

interface FilterToggleProps {
  activeFilter: PublisherFilter;
  onFilterChange: (filter: PublisherFilter) => void;
  counts: { all: number; pap: number; agency: number; developer: number };
}

const FILTERS: ReadonlyArray<{
  key: PublisherFilter;
  labelKey: "toutes" | "particuliers" | "agences" | "promoteurs";
}> = [
  { key: "all", labelKey: "toutes" },
  { key: "pap", labelKey: "particuliers" },
  { key: "agency", labelKey: "agences" },
  { key: "developer", labelKey: "promoteurs" },
];

export function FilterToggle({
  activeFilter,
  onFilterChange,
  counts,
}: FilterToggleProps) {
  const t = useTranslations("FilterToggle");

  const buttonBase =
    "px-4 py-2 text-xs font-medium rounded-full transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-lodge focus-visible:ring-offset-2";
  const activeStyle = "bg-lodge text-white";
  const inactiveStyle = "text-gray-500 hover:text-ink";

  return (
    <div className="inline-flex flex-wrap gap-1 rounded-full border border-gray-200 bg-white p-1">
      {FILTERS.map(({ key, labelKey }) => {
        const isActive = activeFilter === key;
        return (
          <button
            key={key}
            type="button"
            onClick={() => onFilterChange(key)}
            className={cn(buttonBase, isActive ? activeStyle : inactiveStyle)}
            aria-pressed={isActive}
          >
            {t(labelKey)}{" "}
            <span
              className={cn(
                "ml-1",
                isActive ? "text-white/70" : "text-gray-400",
              )}
            >
              {counts[key]}
            </span>
          </button>
        );
      })}
    </div>
  );
}
