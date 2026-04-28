"use client";

import { useCallback, useEffect, useState, useTransition } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import {
  Columns2,
  LayoutGrid,
  Map as MapIcon,
  SlidersHorizontal,
} from "lucide-react";
import { useTranslations } from "next-intl";

import { createClient } from "@/data/supabase/client";

import { SearchFilters, type DbTaxonomyItem } from "./SearchFilters";
import { SearchMap } from "./SearchMap";
import { SearchResults } from "./SearchResults";

type SearchPageProps = {
  transactionTypes?: DbTaxonomyItem[];
  propertyTypes?: DbTaxonomyItem[];
};

export type SearchFiltersState = {
  transaction_type?: string | undefined;
  property_types: string[];
  country?: string | undefined;
  region?: string | undefined;
  city?: string | undefined;
  neighborhoods: string[];
  price_min?: number | undefined;
  price_max?: number | undefined;
  surface_min?: number | undefined;
  surface_max?: number | undefined;
  rooms_min?: number | undefined;
  bedrooms_min?: number | undefined;
  amenities: string[];
  sort: string;
  page: number;
};

export type SearchResult = {
  id: string;
  slug: string | null;
  title: string | null;
  price: number | null;
  price_currency: string | null;
  surface_area: number | null;
  rooms_total: number | null;
  bedrooms: number | null;
  city: string | null;
  neighborhood: string | null;
  main_photo: string | null;
  photos: string[] | null;
  latitude: number | null;
  longitude: number | null;
  property_type: string | null;
  transaction_type: string | null;
  amenities?: string[] | null;
};

export function SearchPage({
  transactionTypes,
  propertyTypes,
}: SearchPageProps = {}) {
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

  const parseFilters = useCallback(
    (): SearchFiltersState => ({
      transaction_type: searchParams.get("transaction") ?? undefined,
      property_types:
        searchParams.get("property_types")?.split(",").filter(Boolean) ?? [],
      country: searchParams.get("country") ?? undefined,
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
      amenities:
        searchParams.get("amenities")?.split(",").filter(Boolean) ?? [],
      sort: searchParams.get("sort") ?? "recent",
      page: Number(searchParams.get("page") ?? "1"),
    }),
    [searchParams],
  );

  const filters = parseFilters();
  const paramsKey = searchParams.toString();

  useEffect(() => {
    const currentFilters = parseFilters();
    let cancelled = false;
    const supabase = createClient();
    const pageSize = 20;
    const offset = (currentFilters.page - 1) * pageSize;

    type AnyQuery = {
      eq: (column: string, value: unknown) => AnyQuery;
      in: (column: string, values: unknown[]) => AnyQuery;
      gte: (column: string, value: unknown) => AnyQuery;
      lte: (column: string, value: unknown) => AnyQuery;
      contains: (column: string, value: unknown) => AnyQuery;
      order: (
        column: string,
        opts: { ascending: boolean; nullsFirst?: boolean },
      ) => AnyQuery;
      range: (
        from: number,
        to: number,
      ) => Promise<{
        data: unknown[] | null;
        count: number | null;
        error: { message: string } | null;
      }>;
    };

    let query = (
      supabase
        .from("listings")
        .select(
          "id,slug,title,price,price_currency,surface_area,rooms_total,bedrooms,city,neighborhood,main_photo,photos,latitude,longitude,property_type,transaction_type,amenities,published_at",
          { count: "exact" },
        ) as unknown as AnyQuery
    ).eq("status", "active");

    if (currentFilters.transaction_type) {
      query = query.eq("transaction_type", currentFilters.transaction_type);
    }
    if (currentFilters.property_types.length > 0) {
      query = query.in("property_type", currentFilters.property_types);
    }
    if (currentFilters.country)
      query = query.eq("country", currentFilters.country);
    if (currentFilters.region)
      query = query.eq("region", currentFilters.region);
    if (currentFilters.city) query = query.eq("city", currentFilters.city);
    if (currentFilters.neighborhoods.length > 0) {
      query = query.in("neighborhood", currentFilters.neighborhoods);
    }
    if (currentFilters.price_min !== undefined) {
      query = query.gte("price", currentFilters.price_min);
    }
    if (currentFilters.price_max !== undefined) {
      query = query.lte("price", currentFilters.price_max);
    }
    if (currentFilters.surface_min !== undefined) {
      query = query.gte("surface_area", currentFilters.surface_min);
    }
    if (currentFilters.surface_max !== undefined) {
      query = query.lte("surface_area", currentFilters.surface_max);
    }
    if (currentFilters.rooms_min !== undefined) {
      query = query.gte("rooms_total", currentFilters.rooms_min);
    }
    if (currentFilters.bedrooms_min !== undefined) {
      query = query.gte("bedrooms", currentFilters.bedrooms_min);
    }
    if (currentFilters.amenities.length > 0) {
      query = query.contains("amenities", currentFilters.amenities);
    }

    if (currentFilters.sort === "price_asc") {
      query = query.order("price", { ascending: true, nullsFirst: false });
    } else if (currentFilters.sort === "price_desc") {
      query = query.order("price", { ascending: false, nullsFirst: false });
    } else if (currentFilters.sort === "surface_desc") {
      query = query.order("surface_area", {
        ascending: false,
        nullsFirst: false,
      });
    } else {
      query = query.order("published_at", {
        ascending: false,
        nullsFirst: false,
      });
    }

    query
      .range(offset, offset + pageSize - 1)
      .then(({ data, count, error }) => {
        if (cancelled) return;
        if (error) {
          console.error("Search error", error);
          setResults([]);
          setTotalCount(0);
        } else {
          setResults((data ?? []) as SearchResult[]);
          setTotalCount(count ?? 0);
        }
        setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [paramsKey, parseFilters]);

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
    if (!("page" in updates)) {
      params.delete("page");
    } else if ((updates.page ?? 1) <= 1) {
      params.delete("page");
    }

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
            {...(transactionTypes ? { transactionTypes } : {})}
            {...(propertyTypes ? { propertyTypes } : {})}
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
