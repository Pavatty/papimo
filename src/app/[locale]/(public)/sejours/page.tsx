import { getTranslations } from "next-intl/server";
import { Sparkles } from "lucide-react";

import {
  SejoursSearchResults,
  type SejoursListing,
} from "@/components/features/sejours/SejoursSearchResults";
import { isFlagEnabled } from "@/data/repositories/feature-flags";
import { createAnonClient } from "@/data/supabase/server";
import { notFound } from "next/navigation";

export default async function SejoursPage() {
  const sejoursOn = await isFlagEnabled("sejours_enabled");
  if (!sejoursOn) {
    notFound();
  }

  const t = await getTranslations("sejours");
  const supabase = createAnonClient();

  const { data: rawListings } = await supabase
    .from("listings")
    .select(
      "id, title, slug, city, base_price_per_night, currency, max_guests, instant_booking, main_photo, photos",
    )
    .eq("rental_type", "short_term")
    .eq("status", "active")
    .not("base_price_per_night", "is", null)
    .order("created_at", { ascending: false })
    .limit(60);

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

  const listings: SejoursListing[] = (rawListings ?? []).map((l) => ({
    id: l.id,
    title: l.title,
    slug: l.slug,
    city: l.city,
    base_price_per_night: l.base_price_per_night,
    currency: l.currency,
    max_guests: l.max_guests,
    instant_booking: l.instant_booking,
    cover: coverByListing[l.id] ?? l.main_photo ?? l.photos?.[0] ?? null,
  }));

  return (
    <main className="bg-creme min-h-screen">
      <section className="from-sejours-sky via-blanc-casse to-blanc-casse dark:from-sejours-sky/30 dark:via-encre dark:to-encre bg-gradient-to-b">
        <div className="mx-auto max-w-6xl px-4 pt-12 pb-8 text-center md:px-6 md:pt-16">
          <span className="bg-sejours-turquoise-light text-sejours-turquoise mb-4 inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-semibold tracking-wide uppercase">
            <Sparkles className="h-3.5 w-3.5" aria-hidden />
            LODGE Séjours
          </span>
          <h1 className="text-encre dark:text-creme mb-3 text-4xl font-extrabold tracking-tight md:text-5xl">
            {t("title")}
          </h1>
          <p className="text-encre/70 dark:text-creme/70 mx-auto max-w-2xl text-base md:text-lg">
            {t("subtitle")}
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-10 md:px-6">
        <SejoursSearchResults listings={listings} />
      </section>
    </main>
  );
}
