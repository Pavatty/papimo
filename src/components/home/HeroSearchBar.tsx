"use client";

import { Search } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";

// Immobilier uniquement. Les locations courte durée passent par le module Séjours
// (page dédiée /sejours, pas via cette barre de recherche Immobilier).
const TABS = [
  { id: "buy", trans: "sale" },
  { id: "rent", trans: "rent" },
] as const;

type TabId = (typeof TABS)[number]["id"];

export function HeroSearchBar() {
  const router = useRouter();
  const locale = useLocale();
  const t = useTranslations("home.hero.search");
  const [tab, setTab] = useState<TabId>("buy");
  const [query, setQuery] = useState("");

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams();
    const trans = TABS.find((x) => x.id === tab)?.trans;
    if (trans) params.set("trans", trans);
    if (query.trim()) params.set("q", query.trim());
    router.push(`/${locale}/search?${params.toString()}`);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="mx-auto mt-8 w-full max-w-2xl"
      role="search"
    >
      <div className="mb-2 flex gap-1 px-1">
        {TABS.map(({ id }) => (
          <button
            key={id}
            type="button"
            onClick={() => setTab(id)}
            aria-pressed={tab === id}
            className={`rounded-t-control focus-visible:ring-bleu px-4 py-2 text-sm font-medium transition focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none ${
              tab === id
                ? "bg-blanc-casse dark:bg-encre/95 text-encre dark:text-creme"
                : "text-encre/70 dark:text-creme/70 hover:text-encre dark:hover:text-creme"
            }`}
          >
            {t(id)}
          </button>
        ))}
      </div>
      <div className="bg-blanc-casse dark:bg-encre/95 rounded-card shadow-card border-bordurewarm-tertiary dark:border-encre/20 flex items-center gap-2 border p-2">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={t("placeholder")}
          maxLength={120}
          className="text-encre dark:text-creme placeholder:text-encre/50 dark:placeholder:text-creme/50 flex-1 bg-transparent px-4 py-3 focus:outline-none"
          aria-label={t("placeholder")}
        />
        <button
          type="submit"
          className="bg-corail hover:bg-corail-hover rounded-control focus-visible:ring-corail inline-flex items-center gap-2 px-5 py-3 text-sm font-medium text-white transition focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none"
        >
          <Search className="size-4" aria-hidden="true" />
          {t("button")}
        </button>
      </div>
    </form>
  );
}
