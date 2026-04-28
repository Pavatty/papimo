import { getTranslations } from "next-intl/server";
import { Users } from "lucide-react";
import Image from "next/image";
import { notFound } from "next/navigation";

import {
  SejourBookingPanel,
  type AvailabilityDay,
  type BookingPanelListing,
} from "@/components/features/sejours/SejourBookingPanel";
import { isFlagEnabled } from "@/data/repositories/feature-flags";
import { createAnonClient } from "@/data/supabase/server";

type Params = { id: string; locale: string };

export default async function SejourDetailPage({
  params,
}: {
  params: Promise<Params>;
}) {
  const { id } = await params;
  const sejoursOn = await isFlagEnabled("sejours_enabled");
  if (!sejoursOn) notFound();

  const t = await getTranslations("sejours");
  const supabase = createAnonClient();

  const { data: listing } = await supabase
    .from("listings")
    .select("*")
    .or(`id.eq.${id},slug.eq.${id}`)
    .eq("rental_type", "short_term")
    .maybeSingle();

  if (!listing) notFound();

  const today = new Date().toISOString().slice(0, 10);
  const { data: availabilityRaw } = await supabase
    .from("availability_calendars")
    .select("date, available")
    .eq("listing_id", listing.id)
    .gte("date", today)
    .order("date");

  const { data: imagesRaw } = await supabase
    .from("listing_images")
    .select("url, alt_text, position")
    .eq("listing_id", listing.id)
    .order("position", { ascending: true });

  const availability: AvailabilityDay[] = (availabilityRaw ?? []).map((d) => ({
    date: d.date,
    available: d.available,
  }));

  const images = imagesRaw ?? [];
  const cover = images[0]?.url ?? null;

  const panelListing: BookingPanelListing = {
    id: listing.id,
    base_price_per_night: listing.base_price_per_night,
    currency: listing.currency,
    min_nights: listing.min_nights,
    max_nights: listing.max_nights,
    max_guests: listing.max_guests,
    instant_booking: listing.instant_booking,
  };

  return (
    <main className="bg-creme min-h-screen">
      <div className="mx-auto max-w-6xl px-4 py-8 md:px-6">
        <header className="mb-6">
          <h1 className="text-encre dark:text-creme mb-2 text-3xl font-bold md:text-4xl">
            {listing.title}
          </h1>
          <p className="text-encre/60 dark:text-creme/60 inline-flex items-center gap-3 text-sm">
            <span>{listing.city}</span>
            {listing.max_guests ? (
              <span className="inline-flex items-center gap-1">
                <Users className="h-4 w-4" aria-hidden />
                {listing.max_guests}
              </span>
            ) : null}
          </p>
        </header>

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
          <div className="space-y-8 lg:col-span-2">
            <div className="bg-sejours-sky rounded-card relative aspect-video overflow-hidden">
              {cover ? (
                <Image
                  src={cover}
                  alt={listing.title ?? ""}
                  fill
                  sizes="(max-width: 1024px) 100vw, 66vw"
                  className="object-cover"
                  priority
                />
              ) : null}
            </div>

            {images.length > 1 ? (
              <div className="grid grid-cols-3 gap-3">
                {images.slice(1, 7).map((img, i) => (
                  <div
                    key={i}
                    className="bg-sejours-sky relative aspect-square overflow-hidden rounded-md"
                  >
                    <Image
                      src={img.url}
                      alt={img.alt_text ?? ""}
                      fill
                      sizes="33vw"
                      className="object-cover"
                    />
                  </div>
                ))}
              </div>
            ) : null}

            {listing.description ? (
              <section>
                <h2 className="text-encre dark:text-creme mb-3 text-xl font-semibold">
                  {t("description")}
                </h2>
                <p className="text-encre/80 dark:text-creme/80 leading-relaxed whitespace-pre-line">
                  {listing.description}
                </p>
              </section>
            ) : null}

            {listing.house_rules ? (
              <section className="border-bordurewarm-tertiary border-t pt-6">
                <h2 className="text-encre dark:text-creme mb-3 text-xl font-semibold">
                  {t("houseRules")}
                </h2>
                <p className="text-encre/80 dark:text-creme/80 leading-relaxed whitespace-pre-line">
                  {listing.house_rules}
                </p>
              </section>
            ) : null}
          </div>

          <div>
            <SejourBookingPanel
              listing={panelListing}
              availability={availability}
            />
          </div>
        </div>
      </div>
    </main>
  );
}
