import Link from "next/link";
import Image from "next/image";

import type { SellerProfile } from "./types";

type Props = {
  seller: SellerProfile;
};

export function ListingSeller({ seller }: Props) {
  const memberSince = new Date(seller.created_at).toLocaleDateString("fr-FR", {
    year: "numeric",
    month: "long",
  });

  return (
    <section className="border-line rounded-2xl border bg-white p-5">
      <h2 className="text-ink mb-4 text-lg font-semibold">Le vendeur</h2>
      <div className="flex items-center gap-3">
        <div className="border-line bg-creme h-12 w-12 overflow-hidden rounded-full border">
          {seller.avatar_url ? (
            <Image
              src={seller.avatar_url}
              alt={seller.full_name ?? "Vendeur"}
              width={48}
              height={48}
              className="h-full w-full object-cover"
            />
          ) : null}
        </div>
        <div>
          <p className="text-ink font-medium">
            {seller.full_name ?? "Membre Papimo"}
          </p>
          <div className="mt-1 flex flex-wrap gap-2 text-xs">
            {seller.is_verified ? (
              <span className="bg-green/10 text-green rounded-full px-2 py-0.5">
                Vérifié
              </span>
            ) : null}
            {seller.kyc_status === "verified" ? (
              <span className="bg-bleu-pale text-bleu rounded-full px-2 py-0.5">
                KYC OK
              </span>
            ) : null}
            <span className="bg-creme-pale text-ink-soft rounded-full px-2 py-0.5">
              Membre depuis {memberSince}
            </span>
          </div>
        </div>
      </div>
      <Link
        href={`/fr/search?owner=${seller.id}`}
        className="border-line text-ink hover:bg-creme-pale mt-4 inline-flex rounded-lg border px-3 py-2 text-sm"
      >
        Voir les autres annonces de ce vendeur
      </Link>
    </section>
  );
}
