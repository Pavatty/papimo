"use client";

import { MessageCircle, Phone, ShieldCheck } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useTransition } from "react";

import { incrementContactCount } from "@/app/[locale]/(public)/listings/[slug]/actions";

import type { ListingDetails, SellerProfile } from "./types";

type Props = {
  locale: string;
  listing: ListingDetails;
  seller: SellerProfile;
  isAuthenticated: boolean;
  listingCreatedLabel: string;
};

export function ListingContactCard({
  locale,
  listing,
  seller,
  isAuthenticated,
  listingCreatedLabel,
}: Props) {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();
  const redirectTo = `/${locale}/annonce/${listing.slug ?? listing.id}`;

  const guardedNavigation = (url: string) => {
    if (!isAuthenticated) {
      router.push(
        `/${locale}/login?redirect_to=${encodeURIComponent(redirectTo)}`,
      );
      return;
    }
    router.push(url);
  };

  return (
    <aside className="border-line bg-paper rounded-2xl border p-4 lg:sticky lg:top-24">
      <div className="mb-3 flex items-center gap-3">
        <div className="border-line bg-creme h-11 w-11 overflow-hidden rounded-full border">
          {seller.avatar_url ? (
            <Image
              src={seller.avatar_url}
              alt={seller.full_name ?? "Vendeur"}
              width={44}
              height={44}
              loading="lazy"
              className="h-full w-full object-cover"
            />
          ) : null}
        </div>
        <div>
          <p className="text-ink text-sm font-semibold">
            {seller.full_name ?? "Membre LODGE"}
          </p>
          {seller.is_verified ? (
            <p className="text-green flex items-center gap-1 text-xs">
              <ShieldCheck className="h-3.5 w-3.5" /> Vérifié
            </p>
          ) : null}
        </div>
      </div>

      <div className="text-ink-soft mb-4 space-y-1 text-xs">
        <p>Annonce vue {listing.views_count} fois</p>
        <p>{listing.favorites_count} favoris</p>
        <p>Créée le {listingCreatedLabel}</p>
      </div>

      <div className="space-y-2">
        <button
          type="button"
          onClick={() =>
            guardedNavigation(
              `/${locale}/messages?listing_id=${listing.id}&seller_id=${listing.owner_id}`,
            )
          }
          className="bg-corail flex w-full items-center justify-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-white"
        >
          <MessageCircle className="h-4 w-4" /> Envoyer un message
        </button>
        <button
          type="button"
          onClick={() =>
            guardedNavigation(
              `/${locale}/messages?listing_id=${listing.id}&seller_id=${listing.owner_id}&source=whatsapp`,
            )
          }
          className="border-line text-ink flex w-full items-center justify-center gap-2 rounded-lg border bg-white px-3 py-2 text-sm"
        >
          WhatsApp
        </button>
        <button
          type="button"
          onClick={() => {
            if (!isAuthenticated) {
              guardedNavigation("");
              return;
            }
            startTransition(async () => {
              await incrementContactCount(listing.id);
              router.push(
                `/${locale}/messages?listing_id=${listing.id}&contact=phone_proxy`,
              );
            });
          }}
          className="border-line text-ink flex w-full items-center justify-center gap-2 rounded-lg border bg-white px-3 py-2 text-sm"
          disabled={isPending}
        >
          <Phone className="h-4 w-4" /> Téléphone masqué
        </button>
      </div>

      {!isAuthenticated ? (
        <p className="text-ink-soft mt-3 text-xs">
          Vous devez être connecté pour contacter le vendeur.
        </p>
      ) : null}
      <Link
        href={`/${locale}/login?redirect_to=${encodeURIComponent(redirectTo)}`}
        className="hidden"
      />
    </aside>
  );
}
