"use client";

import { useTransition } from "react";
import { usePathname } from "next/navigation";

import {
  submitForReview,
  submitListingDirectly,
} from "@/app/[locale]/(authed)/publish/actions";

import type { ListingPack } from "../types";

type Props = {
  value: ListingPack;
  listingId?: string;
  onChange: (pack: ListingPack) => void;
};

const packs: Array<{
  id: ListingPack;
  title: string;
  price: string;
  features: string[];
}> = [
  {
    id: "free",
    title: "Free",
    price: "0 DT",
    features: ["1 annonce", "5 photos", "30 jours"],
  },
  {
    id: "essential",
    title: "Essential",
    price: "29 DT",
    features: ["3 annonces", "12 photos", "60 jours", "stats vues"],
  },
  {
    id: "comfort",
    title: "Comfort",
    price: "69 DT",
    features: ["5 annonces", "20 photos", "vidéo", "top liste 7j"],
  },
  {
    id: "premium",
    title: "Premium",
    price: "149 DT",
    features: ["illimité", "30 photos", "top accueil", "support prioritaire"],
  },
];

export function Step7Pack({ value, listingId, onChange }: Props) {
  const [isPending, startTransition] = useTransition();
  const pathname = usePathname();
  const locale = pathname.split("/")[1] || "fr";
  const betaMode = (process.env.NEXT_PUBLIC_BETA_MODE ?? "true") === "true";

  return (
    <div className="space-y-5">
      {betaMode ? (
        <div className="rounded-xl border border-orange-300 bg-orange-50 px-3 py-2 text-sm text-orange-800">
          Mode beta - tous les packs sont gratuits actuellement
        </div>
      ) : null}
      <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
        {packs.map((pack) => {
          const selected = value === pack.id;
          const soonOverlay = betaMode && pack.id !== "free";
          return (
            <button
              key={pack.id}
              type="button"
              onClick={() => onChange(pack.id)}
              className={`relative rounded-2xl border p-4 text-left ${
                selected
                  ? "border-corail bg-corail-pale"
                  : "border-line bg-white"
              }`}
            >
              <div className="flex items-center justify-between">
                <h3 className="text-ink font-semibold">{pack.title}</h3>
                {selected ? (
                  <span className="bg-corail rounded-full px-2 py-0.5 text-xs text-white">
                    Sélectionné
                  </span>
                ) : null}
              </div>
              <p className="text-ink mt-1 text-xl font-bold">{pack.price}</p>
              <ul className="text-ink-soft mt-2 space-y-1 text-xs">
                {pack.features.map((feature) => (
                  <li key={feature}>• {feature}</li>
                ))}
              </ul>
              {soonOverlay ? (
                <div className="absolute inset-0 flex items-center justify-center rounded-2xl bg-white/70 p-3 text-center text-xs font-semibold text-orange-700">
                  Disponible bientot - actuellement gratuit en mode beta
                </div>
              ) : null}
            </button>
          );
        })}
      </div>

      <button
        type="button"
        disabled={!listingId || isPending}
        onClick={() =>
          startTransition(async () => {
            if (!listingId) return;
            if (betaMode && value === "free") {
              const result = await submitListingDirectly(listingId, locale);
              if (result.success) {
                window.alert("Annonce publiee avec succes");
                window.location.href = `/${locale}/listings/${result.slug}?welcome=true`;
              }
              return;
            }
            if (value === "free") {
              const result = await submitForReview(listingId);
              if (result.ok) {
                window.location.href = `/${locale}/dashboard?published=${result.status}`;
              }
              return;
            }
            window.location.href = `/${locale}/checkout?type=listing-pack&listingId=${listingId}`;
          })
        }
        className="bg-corail w-full rounded-xl px-4 py-3 text-sm font-semibold text-white disabled:opacity-60"
      >
        Publier mon annonce
      </button>
      {value !== "free" ? (
        <p className="text-ink-soft text-xs">
          Checkout à venir avec le module paiements.
        </p>
      ) : null}
    </div>
  );
}
