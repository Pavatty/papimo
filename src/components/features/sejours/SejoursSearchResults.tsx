"use client";

import { Sparkles, Users } from "lucide-react";
import Image from "next/image";
import { useLocale, useTranslations } from "next-intl";

import { Link } from "@/i18n/navigation";

export type SejoursListing = {
  id: string;
  title: string | null;
  slug: string | null;
  city: string;
  base_price_per_night: number | null;
  currency: string;
  max_guests: number | null;
  instant_booking: boolean | null;
  cover?: string | null;
};

type Props = {
  listings: SejoursListing[];
};

export function SejoursSearchResults({ listings }: Props) {
  const t = useTranslations("sejours");
  const locale = useLocale();

  if (listings.length === 0) {
    return (
      <div className="border-bordurewarm-tertiary bg-sejours-sky/40 dark:bg-sejours-sky/10 rounded-card flex flex-col items-center gap-2 border border-dashed py-16 text-center">
        <Sparkles className="text-sejours-turquoise h-8 w-8" aria-hidden />
        <p className="text-encre/70 text-sm">{t("noResults")}</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
      {listings.map((listing) => {
        const path = listing.slug ?? listing.id;
        return (
          <Link
            key={listing.id}
            href={`/sejours/${path}`}
            locale={locale}
            className="group focus-visible:ring-sejours-turquoise rounded-card focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none"
          >
            <article className="border-sejours-turquoise/30 bg-blanc-casse rounded-card hover:border-sejours-turquoise dark:bg-encre/95 group-hover:shadow-card-hover overflow-hidden border-2 transition-all">
              <div className="bg-sejours-sky relative aspect-[4/3]">
                {listing.cover ? (
                  <Image
                    src={listing.cover}
                    alt={listing.title ?? ""}
                    fill
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    className="object-cover transition-transform duration-500 group-hover:scale-[1.04]"
                  />
                ) : null}
                {listing.instant_booking ? (
                  <span className="bg-sejours-sun text-sejours-sun-text absolute top-2 right-2 inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[10px] font-semibold tracking-wide uppercase">
                    <Sparkles className="h-3 w-3" aria-hidden />
                    {t("instantBooking")}
                  </span>
                ) : null}
              </div>

              <div className="space-y-2 p-4">
                <h3 className="text-encre dark:text-creme group-hover:text-sejours-turquoise line-clamp-2 text-sm font-semibold transition">
                  {listing.title ?? "—"}
                </h3>
                <div className="text-encre/60 dark:text-creme/60 inline-flex items-center gap-3 text-xs">
                  <span>{listing.city}</span>
                  {listing.max_guests ? (
                    <span className="inline-flex items-center gap-1">
                      <Users className="h-3.5 w-3.5" aria-hidden />
                      {listing.max_guests}
                    </span>
                  ) : null}
                </div>
                <p className="pt-1">
                  <span className="text-sejours-coral text-xl font-bold">
                    {Number(listing.base_price_per_night ?? 0).toLocaleString(
                      "fr-FR",
                    )}{" "}
                    {listing.currency}
                  </span>
                  <span className="text-encre/60 dark:text-creme/60 ml-1 text-xs font-normal">
                    {" / "}
                    {t("perNight")}
                  </span>
                </p>
              </div>
            </article>
          </Link>
        );
      })}
    </div>
  );
}
