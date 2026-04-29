import { getTranslations } from "next-intl/server";

import { ListingCard } from "@/components/listings/ListingCard";
import { Link } from "@/i18n/navigation";
import { createAnonClient } from "@/data/supabase/server";

export async function SejoursSection() {
  const t = await getTranslations("SejoursSection");
  const supabase = createAnonClient();

  const { data: listings } = await supabase
    .from("listings")
    .select(
      "id, slug, title, city, base_price_per_night, currency, main_photo, photos",
    )
    .eq("module_name", "sejours")
    .eq("status", "active")
    .not("base_price_per_night", "is", null)
    .order("created_at", { ascending: false })
    .limit(3);

  const ids = (listings ?? []).map((l) => l.id);
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

  return (
    <section>
      <div className="mb-5 flex items-baseline justify-between">
        <h2 className="text-ink text-xl font-medium">{t("title")}</h2>
        <Link
          href="/sejours"
          className="text-lodge text-sm font-medium hover:underline"
        >
          {t("decouvrir")} →
        </Link>
      </div>

      {!listings || listings.length === 0 ? (
        <p className="rounded-xl border border-dashed border-gray-200 px-6 py-10 text-center text-sm text-gray-500">
          {t("empty")}
        </p>
      ) : (
        <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
          {listings.map((listing) => {
            const r = ratingsByListing[listing.id];
            return (
              <ListingCard
                key={listing.id}
                id={listing.id}
                slug={listing.slug ?? listing.id}
                title={listing.title}
                location={listing.city}
                price={Number(listing.base_price_per_night ?? 0)}
                priceUnit={`${listing.currency ?? "TND"} / nuit`}
                module="sejours"
                {...(r ? { rating: r.avg, reviewsCount: r.count } : {})}
                imageUrl={listing.main_photo ?? listing.photos?.[0] ?? null}
              />
            );
          })}
        </div>
      )}
    </section>
  );
}
