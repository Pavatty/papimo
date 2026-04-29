"use client";

import { Minus, Plus, Search, SlidersHorizontal, Users } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";

const PRICE_MAX_BOUND = 2000;

type Props = {
  cities: string[];
};

export function SejoursFilters({ cities }: Props) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [city, setCity] = useState(searchParams.get("city") ?? "");
  const [guests, setGuests] = useState(() => {
    const raw = parseInt(searchParams.get("guests") ?? "1", 10);
    return Number.isFinite(raw) && raw >= 1 ? raw : 1;
  });
  const [priceMin, setPriceMin] = useState(() => {
    const raw = parseInt(searchParams.get("priceMin") ?? "0", 10);
    return Number.isFinite(raw) && raw >= 0 ? raw : 0;
  });
  const [priceMax, setPriceMax] = useState(() => {
    const raw = parseInt(
      searchParams.get("priceMax") ?? `${PRICE_MAX_BOUND}`,
      10,
    );
    return Number.isFinite(raw) && raw > 0 ? raw : PRICE_MAX_BOUND;
  });

  const apply = () => {
    const params = new URLSearchParams();
    if (city) params.set("city", city);
    if (guests > 1) params.set("guests", guests.toString());
    if (priceMin > 0) params.set("priceMin", priceMin.toString());
    if (priceMax < PRICE_MAX_BOUND) params.set("priceMax", priceMax.toString());
    const qs = params.toString();
    router.push(qs ? `?${qs}` : "?");
  };

  const reset = () => {
    setCity("");
    setGuests(1);
    setPriceMin(0);
    setPriceMax(PRICE_MAX_BOUND);
    router.push("?");
  };

  const hasFilters =
    city !== "" || guests > 1 || priceMin > 0 || priceMax < PRICE_MAX_BOUND;

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        apply();
      }}
      className="bg-blanc-casse dark:bg-encre/95 sejours-shadow-sm sticky top-24 rounded-2xl p-5"
    >
      <div className="border-bordurewarm-tertiary mb-5 flex items-center gap-2 border-b pb-3">
        <SlidersHorizontal
          className="text-sejours-turquoise h-4 w-4"
          aria-hidden
        />
        <h3 className="text-encre dark:text-creme text-base font-bold">
          Filtres
        </h3>
      </div>

      <div className="space-y-5">
        {/* Ville */}
        <div>
          <label className="text-encre dark:text-creme mb-1.5 block text-xs font-semibold tracking-wide uppercase">
            Ville
          </label>
          <div className="relative">
            <Search
              className="text-encre/40 absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2"
              aria-hidden
            />
            <select
              value={city}
              onChange={(e) => setCity(e.target.value)}
              className="border-bordurewarm-tertiary text-encre dark:bg-encre/30 dark:text-creme focus:border-sejours-turquoise w-full appearance-none rounded-xl border-2 bg-white px-3 py-2.5 pl-9 text-sm transition-colors focus:outline-none"
            >
              <option value="">Toutes les villes</option>
              {cities.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Voyageurs */}
        <div>
          <label className="text-encre dark:text-creme mb-1.5 block text-xs font-semibold tracking-wide uppercase">
            Voyageurs
          </label>
          <div className="bg-creme-foncee/40 dark:bg-encre/40 flex items-center justify-between rounded-xl p-2">
            <button
              type="button"
              onClick={() => setGuests(Math.max(1, guests - 1))}
              disabled={guests <= 1}
              aria-label="Diminuer voyageurs"
              className="border-bordurewarm-tertiary hover:border-sejours-turquoise inline-flex h-9 w-9 items-center justify-center rounded-full border-2 bg-white transition-colors disabled:cursor-not-allowed disabled:opacity-40"
            >
              <Minus className="text-encre h-4 w-4" />
            </button>
            <div className="inline-flex items-center gap-2">
              <Users className="text-sejours-turquoise h-4 w-4" aria-hidden />
              <span className="text-encre dark:text-creme min-w-[1.5rem] text-center text-base font-bold">
                {guests}
              </span>
            </div>
            <button
              type="button"
              onClick={() => setGuests(Math.min(20, guests + 1))}
              disabled={guests >= 20}
              aria-label="Augmenter voyageurs"
              className="border-bordurewarm-tertiary hover:border-sejours-turquoise inline-flex h-9 w-9 items-center justify-center rounded-full border-2 bg-white transition-colors disabled:cursor-not-allowed disabled:opacity-40"
            >
              <Plus className="text-encre h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Prix */}
        <div>
          <label className="text-encre dark:text-creme mb-1.5 block text-xs font-semibold tracking-wide uppercase">
            Prix par nuit (TND)
          </label>
          <div className="space-y-3">
            <input
              type="range"
              min={0}
              max={PRICE_MAX_BOUND}
              step={50}
              value={priceMax}
              onChange={(e) => setPriceMax(parseInt(e.target.value, 10))}
              aria-label="Prix maximum"
              className="sejours-range w-full"
            />
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label
                  htmlFor="sejours-min"
                  className="text-encre/60 dark:text-creme/60 mb-0.5 block text-[10px]"
                >
                  Min
                </label>
                <input
                  id="sejours-min"
                  type="number"
                  min={0}
                  value={priceMin}
                  onChange={(e) =>
                    setPriceMin(parseInt(e.target.value, 10) || 0)
                  }
                  className="border-bordurewarm-tertiary text-encre dark:bg-encre/30 dark:text-creme focus:border-sejours-turquoise w-full rounded-lg border-2 bg-white px-2 py-1.5 text-sm focus:outline-none"
                />
              </div>
              <div>
                <label
                  htmlFor="sejours-max"
                  className="text-encre/60 dark:text-creme/60 mb-0.5 block text-[10px]"
                >
                  Max
                </label>
                <input
                  id="sejours-max"
                  type="number"
                  min={0}
                  value={priceMax}
                  onChange={(e) =>
                    setPriceMax(parseInt(e.target.value, 10) || PRICE_MAX_BOUND)
                  }
                  className="border-bordurewarm-tertiary text-encre dark:bg-encre/30 dark:text-creme focus:border-sejours-turquoise w-full rounded-lg border-2 bg-white px-2 py-1.5 text-sm focus:outline-none"
                />
              </div>
            </div>
            <p className="text-sejours-coral text-center text-xs font-bold">
              {priceMin.toLocaleString("fr-FR")} –{" "}
              {priceMax.toLocaleString("fr-FR")} TND
            </p>
          </div>
        </div>

        <div className="border-bordurewarm-tertiary space-y-2 border-t pt-4">
          <button
            type="submit"
            className="sejours-gradient-coral focus-visible:ring-sejours-coral w-full rounded-xl py-3 text-sm font-bold text-white transition-all hover:-translate-y-0.5 hover:shadow-lg focus-visible:ring-2 focus-visible:outline-none"
          >
            🔍 Rechercher
          </button>
          {hasFilters ? (
            <button
              type="button"
              onClick={reset}
              className="border-bordurewarm-tertiary text-encre/70 hover:text-encre hover:bg-creme-foncee dark:hover:bg-encre/40 dark:text-creme/70 dark:hover:text-creme w-full rounded-xl border-2 py-2.5 text-xs font-medium transition-colors"
            >
              Réinitialiser
            </button>
          ) : null}
        </div>
      </div>
    </form>
  );
}
