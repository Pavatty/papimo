"use client";

import { useEffect, useMemo, useState } from "react";
import { useTranslations } from "next-intl";

import { Link } from "@/i18n/navigation";
import { ListingCard } from "@/components/listings/ListingCard";
import {
  FilterToggle,
  type PublisherFilter,
} from "@/components/listings/FilterToggle";
import { createClient } from "@/data/supabase/client";

type PublisherType = "pap" | "agency" | "developer" | "host";

type ImmobilierRow = {
  id: string;
  slug: string | null;
  title: string;
  city: string;
  price: number;
  currency: string;
  surface_m2: number | null;
  rooms: number | null;
  main_photo: string | null;
  photos: string[] | null;
  owner_id: string;
  publisher_type: PublisherType | null;
};

export function ImmobilierSection() {
  const t = useTranslations("ImmobilierSection");
  const [filter, setFilter] = useState<PublisherFilter>("all");
  const [listings, setListings] = useState<ImmobilierRow[]>([]);
  const [counts, setCounts] = useState({
    all: 0,
    pap: 0,
    agency: 0,
    developer: 0,
  });
  const [loading, setLoading] = useState(true);

  // Counts globaux (toute la DB) via RPC
  useEffect(() => {
    let cancelled = false;
    async function fetchCounts() {
      const supabase = createClient();
      const { data, error } = await supabase
        .rpc("get_immobilier_publisher_counts")
        .single();
      if (cancelled) return;
      if (data && !error) {
        setCounts({
          all: Number(data.all_count ?? 0),
          pap: Number(data.pap_count ?? 0),
          agency: Number(data.agency_count ?? 0),
          developer: Number(data.developer_count ?? 0),
        });
      }
    }
    void fetchCounts();
    return () => {
      cancelled = true;
    };
  }, []);

  // Listings (limit 12, filtre côté client sur 12) — quand filter='pap'/'pro',
  // on charge un peu plus large pour ne pas vider la grille.
  useEffect(() => {
    let cancelled = false;
    async function fetchListings() {
      setLoading(true);
      const supabase = createClient();
      const { data } = await supabase
        .from("listings")
        .select(
          "id, slug, title, city, price, currency, surface_m2, rooms, main_photo, photos, owner_id, profiles!owner_id(publisher_type)",
        )
        .eq("module_name", "immobilier")
        .eq("status", "active")
        .order("created_at", { ascending: false })
        .limit(filter === "all" ? 12 : 30);

      if (cancelled) return;
      const rows = (
        (data ?? []) as unknown as Array<
          Omit<ImmobilierRow, "publisher_type"> & {
            profiles?: { publisher_type: PublisherType | null } | null;
          }
        >
      ).map((row) => ({
        id: row.id,
        slug: row.slug,
        title: row.title,
        city: row.city,
        price: row.price,
        currency: row.currency,
        surface_m2: row.surface_m2,
        rooms: row.rooms,
        main_photo: row.main_photo,
        photos: row.photos,
        owner_id: row.owner_id,
        publisher_type: row.profiles?.publisher_type ?? null,
      }));
      setListings(rows);
      setLoading(false);
    }
    void fetchListings();
    return () => {
      cancelled = true;
    };
  }, [filter]);

  const filtered = useMemo(() => {
    const list =
      filter === "all"
        ? listings
        : listings.filter((l) => l.publisher_type === filter);
    return list.slice(0, 6);
  }, [filter, listings]);

  return (
    <section>
      <div className="mb-5 flex items-baseline justify-between">
        <h2 className="text-ink text-xl font-medium">{t("title")}</h2>
        <Link
          href="/search"
          className="text-lodge text-sm font-medium hover:underline"
        >
          {t("voirToutes")} →
        </Link>
      </div>

      <div className="mb-6">
        <FilterToggle
          activeFilter={filter}
          onFilterChange={setFilter}
          counts={counts}
        />
      </div>

      {filter === "pap" ? (
        <div className="bg-pap-50 border-pap text-pap-700 mb-5 rounded-md border-l-4 px-5 py-3 text-sm">
          <strong className="mb-0.5 block">{t("messagePapTitle")}</strong>
          {t("messagePapBody")}
        </div>
      ) : null}

      {filter === "agency" ? (
        <div className="bg-agency-50 border-agency-500 text-agency-800 mb-5 rounded-md border-l-4 px-5 py-3 text-sm">
          <strong className="mb-0.5 block">{t("messageAgencyTitle")}</strong>
          {t("messageAgencyBody")}
        </div>
      ) : null}

      {filter === "developer" ? (
        <div className="bg-developer-50 border-developer text-developer-800 mb-5 rounded-md border-l-4 px-5 py-3 text-sm">
          <strong className="mb-0.5 block">{t("messageDeveloperTitle")}</strong>
          {t("messageDeveloperBody")}
        </div>
      ) : null}

      {loading ? (
        <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="h-72 animate-pulse rounded-xl bg-gray-100"
            />
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <p className="rounded-xl border border-dashed border-gray-200 px-6 py-10 text-center text-sm text-gray-500">
          {t("empty")}
        </p>
      ) : (
        <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
          {filtered.map((listing) => (
            <ListingCard
              key={listing.id}
              id={listing.id}
              slug={listing.slug ?? listing.id}
              title={listing.title}
              location={listing.city}
              meta={`${listing.surface_m2 ?? "?"} m² · ${listing.rooms ?? "?"} pièces`}
              price={Number(listing.price)}
              priceUnit={listing.currency ?? "TND"}
              publisherType={listing.publisher_type}
              module="immobilier"
              imageUrl={listing.main_photo ?? listing.photos?.[0] ?? null}
            />
          ))}
        </div>
      )}
    </section>
  );
}
