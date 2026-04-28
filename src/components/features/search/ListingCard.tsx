"use client";

import { motion } from "framer-motion";
import { BedDouble, LandPlot, MapPin, PanelBottom } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { useLocale, useTranslations } from "next-intl";

import { FavoriteButton } from "@/components/features/listing/FavoriteButton";

import type { SearchResult } from "./SearchPage";

type Props = {
  listing: SearchResult;
  isAuthenticated?: boolean;
  initialFavorited?: boolean;
};

const SEVEN_DAYS_MS = 7 * 24 * 60 * 60 * 1000;

export function ListingCard({
  listing,
  isAuthenticated = false,
  initialFavorited = false,
}: Props) {
  const locale = useLocale() as "fr" | "en" | "ar";
  const t = useTranslations("home");
  const badgeClass =
    listing.transaction_type === "sale"
      ? "bg-vert text-white"
      : listing.transaction_type === "seasonal_rent"
        ? "bg-terracotta text-white"
        : "bg-vert-clair text-white";
  const cover = listing.main_photo || listing.photos?.[0] || null;
  const href = `/${locale}/annonce/${listing.slug ?? listing.id}`;
  const publishedAt = listing.published_at;
  // Date.now() in a client component is fine because the card only renders
  // when actually mounted; flagging it as impure is overly strict here.
  // eslint-disable-next-line react-hooks/purity
  const nowMs = Date.now();
  const isNew = Boolean(
    publishedAt && nowMs - new Date(publishedAt).getTime() < SEVEN_DAYS_MS,
  );

  return (
    <motion.article
      whileHover={{ y: -2 }}
      transition={{ type: "spring", stiffness: 300, damping: 24 }}
      className="border-bordurewarm-tertiary dark:border-encre/20 bg-blanc-casse dark:bg-encre/95 rounded-card shadow-card hover:shadow-card-hover hover:border-bleu/30 group overflow-hidden border transition-shadow"
    >
      <FavoriteButton
        listingId={listing.id}
        initialFavorited={initialFavorited}
        isAuthenticated={isAuthenticated}
      />
      <Link
        href={href}
        className="focus-visible:ring-bleu block focus-visible:ring-2 focus-visible:outline-none"
        aria-label={`Voir l'annonce ${listing.title ?? ""}`}
      >
        <div className="bg-creme-foncee dark:bg-encre/40 relative aspect-[4/3] overflow-hidden">
          {cover ? (
            <Image
              src={cover}
              alt={listing.title ?? ""}
              fill
              loading="lazy"
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
              className="object-cover transition-transform duration-500 group-hover:scale-[1.04]"
            />
          ) : null}
          {listing.transaction_type ? (
            <span
              className={`rounded-control absolute top-2 left-2 px-2 py-0.5 text-[10px] font-semibold tracking-wide uppercase ${badgeClass}`}
            >
              {listing.transaction_type}
            </span>
          ) : null}
          {isNew ? (
            <span className="bg-nouveaute absolute top-2 right-2 rounded-full px-2 py-1 text-[10px] font-semibold tracking-wider text-white uppercase shadow-md">
              {t("newBadge")}
            </span>
          ) : null}
        </div>
        <div className="space-y-2 p-4">
          <h3 className="text-encre dark:text-creme line-clamp-2 text-sm font-semibold">
            {listing.title}
          </h3>
          <p className="text-corail font-serif text-xl font-medium">
            {Number(listing.price ?? 0).toLocaleString("fr-FR")}{" "}
            <span className="text-encre/60 dark:text-creme/60 text-xs font-normal">
              {listing.price_currency}
            </span>
          </p>
          <div className="text-encre/70 dark:text-creme/70 flex flex-wrap items-center gap-3 text-xs">
            {listing.surface_area ? (
              <span className="inline-flex items-center gap-1">
                <LandPlot className="h-3.5 w-3.5" aria-hidden />
                {listing.surface_area}m²
              </span>
            ) : null}
            {listing.rooms_total ? (
              <span className="inline-flex items-center gap-1">
                <PanelBottom className="h-3.5 w-3.5" aria-hidden />
                {listing.rooms_total}
              </span>
            ) : null}
            {listing.bedrooms ? (
              <span className="inline-flex items-center gap-1">
                <BedDouble className="h-3.5 w-3.5" aria-hidden />
                {listing.bedrooms}
              </span>
            ) : null}
          </div>
          {(listing.city || listing.neighborhood) && (
            <p className="text-encre/60 dark:text-creme/60 inline-flex items-center gap-1 text-xs">
              <MapPin className="h-3.5 w-3.5" aria-hidden />
              {listing.neighborhood
                ? `${listing.neighborhood} · ${listing.city ?? ""}`
                : listing.city}
            </p>
          )}
        </div>
      </Link>
    </motion.article>
  );
}
