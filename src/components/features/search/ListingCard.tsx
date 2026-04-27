"use client";

import { BedDouble, LandPlot, MapPin, PanelBottom, Tag } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { useLocale } from "next-intl";

import { AMENITY_LABELS, getLabel } from "@/lib/constants/listing-labels";

import type { SearchResult } from "./SearchPage";

type Props = {
  listing: SearchResult;
};

export function ListingCard({ listing }: Props) {
  const locale = useLocale() as "fr" | "en" | "ar";
  const topAmenities = (listing.amenities ?? []).slice(0, 3);
  const badgeClass =
    listing.transaction_type === "sale"
      ? "bg-corail/90 text-white"
      : "bg-bleu/90 text-white";

  return (
    <article className="border-line overflow-hidden rounded-xl border bg-white shadow-sm">
      <div className="relative aspect-video">
        <Image
          src={listing.main_photo || listing.photos?.[0] || "/placeholder.svg"}
          alt={listing.title ?? ""}
          fill
          sizes="(max-width: 768px) 100vw, 33vw"
          className="object-cover"
        />
        <span
          className={`absolute top-2 left-2 rounded-full px-2 py-1 text-xs font-semibold ${badgeClass}`}
        >
          {listing.transaction_type}
        </span>
      </div>
      <div className="space-y-2 p-3">
        <h3 className="text-ink line-clamp-2 text-sm font-semibold">
          {listing.title}
        </h3>
        <p className="text-corail text-lg font-bold">
          {Number(listing.price ?? 0).toLocaleString("fr-FR")}{" "}
          {listing.price_currency}
        </p>
        <div className="text-ink-soft flex flex-wrap gap-3 text-xs">
          <span className="inline-flex items-center gap-1">
            <LandPlot className="h-3.5 w-3.5" />
            {listing.surface_area ?? 0}m²
          </span>
          <span className="inline-flex items-center gap-1">
            <PanelBottom className="h-3.5 w-3.5" />
            {listing.rooms_total ?? 0}
          </span>
          <span className="inline-flex items-center gap-1">
            <BedDouble className="h-3.5 w-3.5" />
            {listing.bedrooms ?? 0}
          </span>
          <span className="inline-flex items-center gap-1">
            <MapPin className="h-3.5 w-3.5" />
            {listing.city}{" "}
            {listing.neighborhood ? `· ${listing.neighborhood}` : ""}
          </span>
        </div>
        <div className="flex flex-wrap gap-1">
          {topAmenities.map((key) => (
            <span
              key={key}
              className="bg-bleu-pale text-ink inline-flex items-center gap-1 rounded-full px-2 py-1 text-[11px]"
            >
              <Tag className="h-3 w-3" />
              {AMENITY_LABELS[key as keyof typeof AMENITY_LABELS]
                ? getLabel(
                    AMENITY_LABELS,
                    key as keyof typeof AMENITY_LABELS,
                    locale,
                  )
                : key}
            </span>
          ))}
        </div>
        <Link
          href={`/${locale}/annonce/${listing.slug ?? listing.id}`}
          className="text-bleu inline-flex text-sm font-medium hover:underline"
        >
          Voir l&apos;annonce
        </Link>
      </div>
    </article>
  );
}
