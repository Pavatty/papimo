"use client";

import { useEffect, useState, useTransition } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import {
  Columns2,
  LayoutGrid,
  Map as MapIcon,
  SlidersHorizontal,
} from "lucide-react";
import { useTranslations } from "next-intl";

import { createClient } from "@/lib/supabase/client";

import { SearchFilters } from "./SearchFilters";
import { SearchMap } from "./SearchMap";
import { SearchResults } from "./SearchResults";

export type SearchFiltersState = {
  transaction_type?: string;
  property_types: string[];
  country?: string;
  region?: string;
  city?: string;
  neighborhoods: string[];
  price_min?: number;
  price_max?: number;
  surface_min?: number;
  surface_max?: number;
  rooms_min?: number;
  bedrooms_min?: number;
  amenities: string[];
  sort: string;
  page: number;
};

export type SearchResult = {
  id: string;
  title: string;
  price: number;
  price_currency: string;
  surface_area: number;
  rooms_total: number;
  bedrooms: number;
  city: string;
  neighborhood: string;
  main_photo: string;
  photos: string[];
  latitude: number;
  longitude: number;
  property_type: string;
  transaction_type: string;
  amenities?: string[];
};

export function SearchPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const t = useTranslations("search");

  const [view, setView] = useState<"list" | "map" | "split">("split");
  const [filtersOpen, setFiltersOpen] = useState(true);
  const [results, setResults] = useState<SearchResult[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [, startTransition] = useTransition();

  const parseFilters = (): SearchFiltersState => ({
    transaction_type: searchParams.get("transaction") ?? undefined,
    property_types:
      searchParams.get("property_types")?.split(",").filter(Boolean) ?? [],
    country: searchParams.get("country") ?? "TN",
    region: searchParams.get("region") ?? undefined,
    city: searchParams.get("city") ?? undefined,
    neighborhoods:
      searchParams.get("neighborhoods")?.split(",").filter(Boolean) ?? [],
    price_min: searchParams.get("price_min")
      ? Number(searchParams.get("price_min"))
      : undefined,
    price_max: searchParams.get("price_max")
      ? Number(searchParams.get("price_max"))
      : undefined,
    surface_min: searchParams.get("surface_min")
      ? Number(searchParams.get("surface_min"))
      : undefined,
    surface_max: searchParams.get("surface_max")
      ? Number(searchParams.get("surface_max"))
      : undefined,
    rooms_min: searchParams.get("rooms_min")
      ? Number(searchParams.get("rooms_min"))
      : undefined,
    bedrooms_min: searchParams.get("bedrooms_min")
      ? Number(searchParams.get("bedrooms_min"))
      : undefined,
    amenities: searchParams.get("amenities")?.split(",").filter(Boolean) ?? [],
    sort: searchParams.get("sort") ?? "recent",
    page: Number(searchParams.get("page") ?? "1"),
  });

  const filters = parseFilters();
  const paramsKey = searchParams.toString();

  useEffect(() => {
    const currentFilters = parseFilters();
    let cancelled = false;
    const supabase = createClient();

    const rpcFilters: Record<string, unknown> = {
      transaction_type: currentFilters.transaction_type,
      property_types: currentFilters.property_types,
      country: currentFilters.country,
      region: currentFilters.region,
      city: currentFilters.city,
      neighborhoods: currentFilters.neighborhoods,
      price_min: currentFilters.price_min,
      price_max: currentFilters.price_max,
      surface_min: currentFilters.surface_min,
      surface_max: currentFilters.surface_max,
      rooms_min: currentFilters.rooms_min,
      bedrooms_min: currentFilters.bedrooms_min,
      amenities: currentFilters.amenities,
      sort: currentFilters.sort,
      page: currentFilters.page,
      page_size: 20,
    };

    Object.keys(rpcFilters).forEach((key) => {
      if (rpcFilters[key] === undefined) delete rpcFilters[key];
    });

    supabase
      .rpc("search_listings", { filters: rpcFilters })
      .then(({ data, error }) => {
        if (cancelled) return;
        if (error) {
          console.error("Search error", error);
          setResults([]);
          setTotalCount(0);
        } else {
          const rows = (data ?? []) as Array<
            SearchResult & { total_count: number }
          >;
          setResults(rows);
          setTotalCount(rows[0]?.total_count ?? 0);
        }
        setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [paramsKey]);

  const updateFilters = (updates: Partial<SearchFiltersState>) => {
    const params = new URLSearchParams(searchParams.toString());
    Object.entries(updates).forEach(([key, value]) => {
      const urlKey = key === "transaction_type" ? "transaction" : key;
      if (
        value === undefined ||
        value === null ||
        (Array.isArray(value) && value.length === 0)
      ) {
        params.delete(urlKey);
      } else if (Array.isArray(value)) {
        params.set(urlKey, value.join(","));
      } else {
        params.set(urlKey, String(value));
      }
    });
    if (!("page" in updates)) params.set("page", "1");

    setLoading(true);
    startTransition(() => {
      router.push(`${pathname}?${params.toString()}`);
    });
  };

  const resetFilters = () => {
    setLoading(true);
    startTransition(() => {
      router.push(pathname);
    });
  };

  return (
    <div className="bg-creme-pale min-h-screen">
      <div className="sticky top-16 z-30 border-b bg-white shadow-sm">
        <div className="mx-auto flex max-w-7xl items-center gap-4 px-4 py-4">
          <div className="flex-1">
            <h1 className="text-ink text-xl font-bold">{t("title")}</h1>
            <p className="text-sm text-gray-500">
              {totalCount} {t("results")}
            </p>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => setFiltersOpen(!filtersOpen)}
              className="rounded-lg border p-2 lg:hidden"
            >
              <SlidersHorizontal className="h-5 w-5" />
            </button>
            <div className="hidden gap-1 rounded-lg border p-1 md:flex">
              <button
                onClick={() => setView("list")}
                className={`rounded p-2 ${view === "list" ? "bg-bleu text-white" : ""}`}
              >
                <LayoutGrid className="h-4 w-4" />
              </button>
              <button
                onClick={() => setView("split")}
                className={`rounded p-2 ${view === "split" ? "bg-bleu text-white" : ""}`}
              >
                <Columns2 className="h-4 w-4" />
              </button>
              <button
                onClick={() => setView("map")}
                className={`rounded p-2 ${view === "map" ? "bg-bleu text-white" : ""}`}
              >
                <MapIcon className="h-4 w-4" />
              </button>
            </div>
            <select
              value={filters.sort}
              onChange={(event) => updateFilters({ sort: event.target.value })}
              className="rounded-lg border px-3 py-2 text-sm"
            >
              <option value="recent">{t("sort.recent")}</option>
              <option value="price_asc">{t("sort.priceAsc")}</option>
              <option value="price_desc">{t("sort.priceDesc")}</option>
              <option value="surface_desc">{t("sort.surfaceDesc")}</option>
              <option value="price_per_sqm_asc">
                {t("sort.pricePerSqmAsc")}
              </option>
            </select>
          </div>
        </div>
      </div>

      <div className="mx-auto grid max-w-7xl gap-6 px-4 py-6 lg:grid-cols-[280px_1fr]">
        <aside className={`${filtersOpen ? "block" : "hidden"} lg:block`}>
          <SearchFilters
            filters={filters}
            onChange={updateFilters}
            onReset={resetFilters}
          />
        </aside>

        <main>
          {view === "list" && (
            <SearchResults
              results={results}
              loading={loading}
              onReset={resetFilters}
            />
          )}
          {view === "map" && <SearchMap results={results} />}
          {view === "split" && (
            <div className="grid gap-4 md:grid-cols-2">
              <SearchResults
                results={results}
                loading={loading}
                onReset={resetFilters}
              />
              <div className="hidden h-[calc(100vh-9rem)] md:sticky md:top-32 md:block">
                <SearchMap results={results} />
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
