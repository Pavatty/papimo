"use client";

import { Heart, MapPin, Sparkles, Star, Users } from "lucide-react";
import Image from "next/image";
import { useState } from "react";
import { useLocale, useTranslations } from "next-intl";

import { Link } from "@/i18n/navigation";

export type SejoursListing = {
  id: string;
  title: string | null;
  slug: string | null;
  city: string;
  governorate: string | null;
  base_price_per_night: number | null;
  currency: string;
  max_guests: number | null;
  instant_booking: boolean | null;
  cover?: string | null;
  rating?: number | null;
  review_count?: number;
};

type Props = {
  listings: SejoursListing[];
};

function CardLink({
  listing,
  delay,
}: {
  listing: SejoursListing;
  delay: number;
}) {
  const t = useTranslations("sejours");
  const locale = useLocale();
  const [favorited, setFavorited] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);

  const path = listing.slug ?? listing.id;

  return (
    <article
      className="animate-sejours-fadeIn"
      style={{ animationDelay: `${delay}ms` }}
    >
      <Link
        href={`/sejours/${path}`}
        locale={locale}
        className="group focus-visible:ring-sejours-turquoise block rounded-2xl focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none"
      >
        <div className="bg-blanc-casse dark:bg-encre/95 sejours-shadow-sm hover:sejours-shadow-lg overflow-hidden rounded-2xl transition-all duration-300 ease-out hover:-translate-y-1">
          {/* Image */}
          <div className="bg-sejours-sky relative aspect-[4/3] overflow-hidden">
            {!imageLoaded ? (
              <div
                className="sejours-skeleton absolute inset-0"
                aria-hidden="true"
              />
            ) : null}
            {listing.cover ? (
              <Image
                src={listing.cover}
                alt={listing.title ?? ""}
                fill
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                className={`object-cover transition-all duration-500 group-hover:scale-105 ${
                  imageLoaded ? "opacity-100" : "opacity-0"
                }`}
                onLoad={() => setImageLoaded(true)}
              />
            ) : null}

            <div
              className="sejours-gradient-overlay pointer-events-none absolute inset-0 opacity-30 transition-opacity group-hover:opacity-60"
              aria-hidden="true"
            />

            {/* Badge instantané */}
            {listing.instant_booking ? (
              <span className="bg-sejours-sun text-sejours-sun-text absolute top-3 right-3 inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[10px] font-bold tracking-wide shadow-md">
                <Sparkles className="h-3 w-3" aria-hidden />
                {t("instantBooking")}
              </span>
            ) : null}

            {/* Bouton favori */}
            <button
              type="button"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                setFavorited((v) => !v);
              }}
              aria-label={
                favorited ? "Retirer des favoris" : "Ajouter aux favoris"
              }
              aria-pressed={favorited}
              className="focus-visible:ring-sejours-coral absolute top-3 left-3 inline-flex h-9 w-9 items-center justify-center rounded-full bg-white/90 shadow-md backdrop-blur-sm transition-all hover:scale-110 hover:bg-white focus-visible:ring-2 focus-visible:outline-none"
            >
              <Heart
                className={`h-4 w-4 transition-colors ${
                  favorited
                    ? "fill-sejours-coral text-sejours-coral"
                    : "text-encre/60"
                }`}
              />
            </button>

            {/* Note moyenne */}
            {listing.rating ? (
              <span className="text-encre absolute bottom-3 left-3 inline-flex items-center gap-1.5 rounded-full bg-white/95 px-2.5 py-1 text-xs font-bold shadow-md backdrop-blur-sm">
                <Star
                  className="fill-sejours-coral text-sejours-coral h-3.5 w-3.5"
                  aria-hidden
                />
                {listing.rating.toFixed(1)}
                {listing.review_count ? (
                  <span className="text-encre/60 font-normal">
                    ({listing.review_count})
                  </span>
                ) : null}
              </span>
            ) : null}
          </div>

          {/* Content */}
          <div className="space-y-2.5 p-4">
            <p className="text-encre/70 dark:text-creme/70 inline-flex items-center gap-1 text-xs">
              <MapPin
                className="text-sejours-turquoise h-3.5 w-3.5"
                aria-hidden
              />
              <span>
                {listing.city}
                {listing.governorate ? `, ${listing.governorate}` : ""}
              </span>
            </p>

            <h3 className="text-encre dark:text-creme group-hover:text-sejours-turquoise line-clamp-2 text-base font-bold transition-colors">
              {listing.title ?? "—"}
            </h3>

            <div className="border-bordurewarm-tertiary flex items-center justify-between border-t pt-3">
              <span className="text-encre/70 dark:text-creme/70 inline-flex items-center gap-1 text-xs">
                <Users className="h-3.5 w-3.5" aria-hidden />
                {listing.max_guests ?? 0} pers.
              </span>
              <p className="text-right">
                <span className="text-sejours-coral text-xl font-bold">
                  {Number(listing.base_price_per_night ?? 0).toLocaleString(
                    "fr-FR",
                  )}{" "}
                  {listing.currency}
                </span>
                <span className="text-encre/60 dark:text-creme/60 ml-1 block text-[10px] font-normal">
                  {t("perNight")}
                </span>
              </p>
            </div>
          </div>
        </div>
      </Link>
    </article>
  );
}

export function SejoursSearchResults({ listings }: Props) {
  if (listings.length === 0) {
    return null;
  }

  return (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
      {listings.map((listing, i) => (
        <CardLink key={listing.id} listing={listing} delay={i * 50} />
      ))}
    </div>
  );
}
