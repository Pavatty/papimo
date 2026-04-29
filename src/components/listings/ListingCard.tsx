"use client";

import { Heart } from "lucide-react";
import Image from "next/image";
import { useState } from "react";

import { Link } from "@/i18n/navigation";
import { cn } from "@/lib/utils";

interface ListingCardProps {
  id: string;
  slug: string;
  title: string;
  location: string;
  meta?: string; // ex: "250 m² · 5 pièces"
  price: number;
  priceUnit?: string; // "TND" ou "TND / nuit"
  publisherType?: "pap" | "agency" | "developer" | "host" | null;
  module: "immobilier" | "sejours";
  rating?: number; // 0-5 pour Séjours
  reviewsCount?: number; // pour Séjours
  imageUrl?: string | null;
}

const BADGE_STYLES = {
  pap: "bg-pap text-white",
  // Agences : jaune taxi, texte noir obligatoire (WCAG AA)
  agency: "bg-agency text-ink",
  developer: "bg-developer text-white",
  host: "bg-sej text-white",
  sej: "bg-sej text-white",
} as const;

const BADGE_LABELS = {
  pap: "Particulier",
  agency: "Agence",
  developer: "Promoteur",
  host: "Hôte",
  sej: "Séjour",
} as const;

export function ListingCard({
  slug,
  title,
  location,
  meta,
  price,
  priceUnit = "TND",
  publisherType,
  module,
  rating,
  reviewsCount,
  imageUrl,
}: ListingCardProps) {
  const [favorited, setFavorited] = useState(false);

  const badgeKey: keyof typeof BADGE_LABELS | null =
    module === "sejours"
      ? "sej"
      : publisherType === "pap"
        ? "pap"
        : publisherType === "agency"
          ? "agency"
          : publisherType === "developer"
            ? "developer"
            : publisherType === "host"
              ? "host"
              : null;

  const detailHref =
    module === "sejours" ? `/sejours/${slug}` : `/annonce/${slug}`;

  return (
    <Link
      href={detailHref}
      className="group focus-visible:ring-lodge block overflow-hidden rounded-xl border border-gray-200 bg-white transition-all hover:-translate-y-0.5 hover:shadow-lg focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none"
    >
      <div className="relative h-44 bg-gray-100">
        {imageUrl ? (
          <Image
            src={imageUrl}
            alt={title}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            className="object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="h-full w-full bg-gradient-to-br from-stone-200 to-stone-300" />
        )}

        {badgeKey ? (
          <span
            className={cn(
              "absolute top-3 left-3 rounded-full px-3 py-1 text-[11px] font-medium shadow-sm",
              BADGE_STYLES[badgeKey],
            )}
          >
            {BADGE_LABELS[badgeKey]}
          </span>
        ) : null}

        <button
          type="button"
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            setFavorited((v) => !v);
          }}
          aria-label={favorited ? "Retirer des favoris" : "Ajouter aux favoris"}
          aria-pressed={favorited}
          className="absolute top-3 right-3 inline-flex h-8 w-8 items-center justify-center rounded-full bg-white/95 text-base transition-transform hover:scale-110"
        >
          <Heart
            className={cn(
              "h-4 w-4 transition-colors",
              favorited ? "fill-sej text-sej" : "text-gray-500",
            )}
          />
        </button>
      </div>

      <div className="p-4">
        <p className="mb-1 text-[10px] font-medium tracking-wider text-gray-400 uppercase">
          {location}
        </p>
        <h3 className="text-ink mb-1.5 line-clamp-1 text-sm leading-snug font-medium">
          {title}
        </h3>

        {meta ? <p className="mb-2 text-xs text-gray-500">{meta}</p> : null}

        {module === "sejours" && rating !== undefined ? (
          <div className="mb-2 flex items-center gap-1 text-xs text-gray-500">
            <span className="text-sej-mimosa text-sm tracking-wide">
              {"★".repeat(Math.floor(rating))}
              {"☆".repeat(5 - Math.floor(rating))}
            </span>
            <span>
              {rating.toFixed(1)}
              {reviewsCount ? ` (${reviewsCount} avis)` : ""}
            </span>
          </div>
        ) : null}

        <div className="flex items-baseline justify-between">
          <span className="text-ink text-base font-semibold">
            {price.toLocaleString("fr-FR")}
            <span className="ml-1 text-xs font-normal text-gray-500">
              {priceUnit}
            </span>
          </span>
          {module === "sejours" ? (
            <span className="bg-sej-coral hover:bg-sej-coral-hover rounded-full px-3 py-1.5 text-xs font-medium text-white">
              Réserver
            </span>
          ) : null}
        </div>
      </div>
    </Link>
  );
}
