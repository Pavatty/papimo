import { getTranslations } from "next-intl/server";
import { MapPin, Sparkles } from "lucide-react";
import { notFound } from "next/navigation";

import { SejoursEmptyState } from "@/components/features/sejours/SejoursEmptyState";
import { SejoursFilters } from "@/components/features/sejours/SejoursFilters";
import {
  SejoursSearchResults,
  type SejoursListing,
} from "@/components/features/sejours/SejoursSearchResults";
import { isFlagEnabled } from "@/data/repositories/feature-flags";
import { createAnonClient } from "@/data/supabase/server";

type SearchParams = {
  city?: string;
  guests?: string;
  priceMin?: string;
  priceMax?: string;
};

export default async function SejoursPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const sejoursOn = await isFlagEnabled("sejours_enabled");
  if (!sejoursOn) notFound();

  const sp = await searchParams;
  const t = await getTranslations("sejours");
  const supabase = createAnonClient();

  let listingsQuery = supabase
    .from("listings")
    .select(
      "id, title, slug, city, governorate, base_price_per_night, currency, max_guests, instant_booking, main_photo, photos",
    )
    .eq("module_name", "sejours")
    .eq("status", "active")
    .not("base_price_per_night", "is", null);

  if (sp.city) listingsQuery = listingsQuery.eq("city", sp.city);
  const guestsNum = sp.guests ? parseInt(sp.guests, 10) : NaN;
  if (Number.isFinite(guestsNum) && guestsNum > 0) {
    listingsQuery = listingsQuery.gte("max_guests", guestsNum);
  }
  const priceMinNum = sp.priceMin ? parseFloat(sp.priceMin) : NaN;
  if (Number.isFinite(priceMinNum) && priceMinNum > 0) {
    listingsQuery = listingsQuery.gte("base_price_per_night", priceMinNum);
  }
  const priceMaxNum = sp.priceMax ? parseFloat(sp.priceMax) : NaN;
  if (Number.isFinite(priceMaxNum) && priceMaxNum > 0) {
    listingsQuery = listingsQuery.lte("base_price_per_night", priceMaxNum);
  }

  const { data: rawListings } = await listingsQuery
    .order("created_at", { ascending: false })
    .limit(60);

  const { data: cityRows } = await supabase
    .from("listings")
    .select("city")
    .eq("module_name", "sejours")
    .eq("status", "active")
    .order("city");
  const cities = Array.from(
    new Set((cityRows ?? []).map((r) => r.city).filter(Boolean)),
  );

  const ids = (rawListings ?? []).map((l) => l.id);
  const coverByListing: Record<string, string> = {};
  if (ids.length > 0) {
    const { data: covers } = await supabase
      .from("listing_images")
      .select("listing_id, url, position")
      .in("listing_id", ids)
      .order("position", { ascending: true });
    for (const row of covers ?? []) {
      if (!coverByListing[row.listing_id]) {
        coverByListing[row.listing_id] = row.url;
      }
    }
  }

  // Aggregat ratings + count par listing (via fetch puis reduce côté JS).
  const ratingsByListing: Record<string, { avg: number; count: number }> = {};
  if (ids.length > 0) {
    const { data: reviewRows } = await supabase
      .from("reviews")
      .select("listing_id, rating")
      .in("listing_id", ids)
      .eq("review_type", "guest_to_host");
    for (const row of reviewRows ?? []) {
      const slot = ratingsByListing[row.listing_id] ?? { avg: 0, count: 0 };
      slot.avg = (slot.avg * slot.count + row.rating) / (slot.count + 1);
      slot.count += 1;
      ratingsByListing[row.listing_id] = slot;
    }
  }

  const listings: SejoursListing[] = (rawListings ?? []).map((l) => ({
    id: l.id,
    title: l.title,
    slug: l.slug,
    city: l.city,
    governorate: l.governorate,
    base_price_per_night: l.base_price_per_night,
    currency: l.currency,
    max_guests: l.max_guests,
    instant_booking: l.instant_booking,
    cover: coverByListing[l.id] ?? l.main_photo ?? l.photos?.[0] ?? null,
    rating: ratingsByListing[l.id]?.avg ?? null,
    review_count: ratingsByListing[l.id]?.count ?? 0,
  }));

  const hasFilters =
    Boolean(sp.city) ||
    Boolean(sp.guests) ||
    Boolean(sp.priceMin) ||
    Boolean(sp.priceMax);

  return (
    <main className="bg-creme dark:bg-encre min-h-screen">
      {/* Hero header */}
      <section className="from-sejours-sky to-blanc-casse dark:from-sejours-sky/30 dark:to-encre relative overflow-hidden bg-gradient-to-b">
        <div className="mx-auto max-w-6xl px-4 pt-12 pb-10 text-center md:px-6 md:pt-16">
          <span className="bg-sejours-turquoise/10 text-sejours-turquoise animate-sejours-slideUp mb-4 inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-xs font-bold tracking-wide uppercase">
            <Sparkles className="h-3.5 w-3.5" aria-hidden />
            LODGE Séjours
          </span>
          <h1 className="text-encre dark:text-creme animate-sejours-fadeIn mb-3 text-4xl font-extrabold tracking-tight md:text-5xl">
            {t("title")}
          </h1>
          <p className="text-encre/70 dark:text-creme/70 animate-sejours-fadeIn mx-auto max-w-2xl text-base md:text-lg">
            {t("subtitle")}
          </p>
        </div>
      </section>

      {/* Body */}
      <section className="mx-auto max-w-7xl px-4 py-10 md:px-6">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-4">
          <aside className="lg:col-span-1">
            <SejoursFilters cities={cities} />
          </aside>

          <div className="lg:col-span-3">
            <div className="mb-5 flex items-center justify-between gap-3">
              <p className="text-encre dark:text-creme inline-flex items-center gap-2 text-base font-bold">
                <MapPin
                  className="text-sejours-turquoise h-5 w-5"
                  aria-hidden
                />
                {listings.length}{" "}
                {listings.length <= 1 ? "annonce" : "annonces"}
                {hasFilters ? (
                  <span className="text-encre/60 dark:text-creme/60 text-xs font-normal">
                    (filtres actifs)
                  </span>
                ) : null}
              </p>
            </div>

            {listings.length > 0 ? (
              <SejoursSearchResults listings={listings} />
            ) : (
              <SejoursEmptyState hasFilters={hasFilters} />
            )}
          </div>
        </div>
      </section>
    </main>
  );
}
