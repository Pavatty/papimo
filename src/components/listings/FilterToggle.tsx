"use client";

import { useTranslations } from "next-intl";

import { cn } from "@/lib/utils";

export type PublisherFilter = "all" | "pap" | "pro";

interface FilterToggleProps {
  activeFilter: PublisherFilter;
  onFilterChange: (filter: PublisherFilter) => void;
  counts: { all: number; pap: number; pro: number };
}

export function FilterToggle({
  activeFilter,
  onFilterChange,
  counts,
}: FilterToggleProps) {
  const t = useTranslations("FilterToggle");

  const buttonBase =
    "px-5 py-2.5 text-xs font-medium rounded-full transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-lodge focus-visible:ring-offset-2";
  const activeStyle = "bg-lodge text-white";
  const inactiveStyle = "text-gray-500 hover:text-ink";

  return (
    <div className="inline-flex gap-1 rounded-full border border-gray-200 bg-white p-1">
      <button
        type="button"
        onClick={() => onFilterChange("all")}
        className={cn(
          buttonBase,
          activeFilter === "all" ? activeStyle : inactiveStyle,
        )}
        aria-pressed={activeFilter === "all"}
      >
        {t("toutes")}{" "}
        <span
          className={cn(
            activeFilter === "all" ? "text-white/70" : "text-gray-400",
          )}
        >
          {counts.all}
        </span>
      </button>
      <button
        type="button"
        onClick={() => onFilterChange("pap")}
        className={cn(
          buttonBase,
          activeFilter === "pap" ? activeStyle : inactiveStyle,
        )}
        aria-pressed={activeFilter === "pap"}
      >
        {t("particuliers")}{" "}
        <span
          className={cn(
            activeFilter === "pap" ? "text-white/70" : "text-gray-400",
          )}
        >
          {counts.pap}
        </span>
      </button>
      <button
        type="button"
        onClick={() => onFilterChange("pro")}
        className={cn(
          buttonBase,
          activeFilter === "pro" ? activeStyle : inactiveStyle,
        )}
        aria-pressed={activeFilter === "pro"}
      >
        {t("agences")}{" "}
        <span
          className={cn(
            activeFilter === "pro" ? "text-white/70" : "text-gray-400",
          )}
        >
          {counts.pro}
        </span>
      </button>
    </div>
  );
}
