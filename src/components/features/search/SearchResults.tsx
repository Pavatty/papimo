"use client";

import { SearchX } from "lucide-react";
import { useTranslations } from "next-intl";

import type { SearchResult } from "./SearchPage";
import { ListingCard } from "./ListingCard";

type Props = {
  results: SearchResult[];
  loading: boolean;
  onReset?: () => void;
};

export function SearchResults({ results, loading, onReset }: Props) {
  const t = useTranslations("search");

  if (loading) {
    return (
      <div className="grid gap-3">
        {Array.from({ length: 6 }).map((_, index) => (
          <div
            key={index}
            className="border-line animate-pulse overflow-hidden rounded-xl border bg-white"
          >
            <div className="bg-line h-40 w-full" />
            <div className="space-y-2 p-3">
              <div className="bg-line h-4 w-2/3 rounded" />
              <div className="bg-line h-4 w-1/3 rounded" />
              <div className="bg-line h-3 w-5/6 rounded" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (results.length === 0) {
    return (
      <div className="border-line flex min-h-[420px] flex-col items-center justify-center rounded-xl border bg-white p-8 text-center">
        <SearchX className="text-ink-soft mb-3 h-10 w-10" />
        <h3 className="text-ink mb-1 text-lg font-semibold">
          {t("emptyState.title")}
        </h3>
        <p className="text-ink-soft mb-5 text-sm">{t("emptyState.message")}</p>
        {onReset ? (
          <button
            type="button"
            onClick={onReset}
            className="border-line rounded-lg border px-4 py-2 text-sm"
          >
            {t("emptyState.reset")}
          </button>
        ) : null}
      </div>
    );
  }

  return (
    <div className="grid gap-3">
      {results.map((listing) => (
        <ListingCard key={listing.id} listing={listing} />
      ))}
    </div>
  );
}
