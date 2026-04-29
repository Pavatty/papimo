"use client";

import { Filter } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";

type Props = {
  cities: string[];
};

export function SejoursFilters({ cities }: Props) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [city, setCity] = useState(searchParams.get("city") ?? "");
  const [guests, setGuests] = useState(searchParams.get("guests") ?? "");
  const [priceMin, setPriceMin] = useState(searchParams.get("priceMin") ?? "");
  const [priceMax, setPriceMax] = useState(searchParams.get("priceMax") ?? "");

  const apply = () => {
    const params = new URLSearchParams();
    if (city) params.set("city", city);
    if (guests) params.set("guests", guests);
    if (priceMin) params.set("priceMin", priceMin);
    if (priceMax) params.set("priceMax", priceMax);
    const qs = params.toString();
    router.push(qs ? `?${qs}` : "?");
  };

  const reset = () => {
    setCity("");
    setGuests("");
    setPriceMin("");
    setPriceMax("");
    router.push("?");
  };

  const hasFilters =
    city !== "" || guests !== "" || priceMin !== "" || priceMax !== "";

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        apply();
      }}
      className="border-sejours-turquoise/40 bg-blanc-casse dark:bg-encre/95 rounded-card mb-6 grid grid-cols-1 gap-3 border p-4 md:grid-cols-5"
    >
      <div>
        <label className="text-encre/70 dark:text-creme/70 mb-1 block text-xs">
          Ville
        </label>
        <select
          value={city}
          onChange={(e) => setCity(e.target.value)}
          className="border-bordurewarm-tertiary text-encre dark:bg-encre/30 dark:text-creme focus:border-sejours-turquoise w-full rounded-md border bg-white px-3 py-2 text-sm focus:outline-none"
        >
          <option value="">Toutes les villes</option>
          {cities.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="text-encre/70 dark:text-creme/70 mb-1 block text-xs">
          Voyageurs (min)
        </label>
        <input
          type="number"
          min={1}
          value={guests}
          onChange={(e) => setGuests(e.target.value)}
          placeholder="2"
          className="border-bordurewarm-tertiary text-encre dark:bg-encre/30 dark:text-creme focus:border-sejours-turquoise w-full rounded-md border bg-white px-3 py-2 text-sm focus:outline-none"
        />
      </div>

      <div>
        <label className="text-encre/70 dark:text-creme/70 mb-1 block text-xs">
          Prix min (TND)
        </label>
        <input
          type="number"
          min={0}
          value={priceMin}
          onChange={(e) => setPriceMin(e.target.value)}
          placeholder="80"
          className="border-bordurewarm-tertiary text-encre dark:bg-encre/30 dark:text-creme focus:border-sejours-turquoise w-full rounded-md border bg-white px-3 py-2 text-sm focus:outline-none"
        />
      </div>

      <div>
        <label className="text-encre/70 dark:text-creme/70 mb-1 block text-xs">
          Prix max (TND)
        </label>
        <input
          type="number"
          min={0}
          value={priceMax}
          onChange={(e) => setPriceMax(e.target.value)}
          placeholder="500"
          className="border-bordurewarm-tertiary text-encre dark:bg-encre/30 dark:text-creme focus:border-sejours-turquoise w-full rounded-md border bg-white px-3 py-2 text-sm focus:outline-none"
        />
      </div>

      <div className="flex items-end gap-2">
        <button
          type="submit"
          className="bg-sejours-turquoise hover:bg-sejours-turquoise-hover focus-visible:ring-sejours-turquoise inline-flex flex-1 items-center justify-center gap-2 rounded-md px-3 py-2 text-sm font-semibold text-white transition focus-visible:ring-2 focus-visible:outline-none"
        >
          <Filter className="h-4 w-4" aria-hidden />
          Filtrer
        </button>
        {hasFilters ? (
          <button
            type="button"
            onClick={reset}
            className="text-encre/70 hover:text-encre dark:text-creme/70 dark:hover:text-creme border-bordurewarm-tertiary rounded-md border px-3 py-2 text-xs transition"
          >
            Réinit
          </button>
        ) : null}
      </div>
    </form>
  );
}
