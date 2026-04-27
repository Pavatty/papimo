import Link from "next/link";
import Image from "next/image";

import { formatPrice } from "@/lib/listing/format";
import type { Tables } from "@/types/database";

type SimilarListing = Pick<
  Tables<"listings">,
  "id" | "slug" | "title" | "price" | "currency" | "city" | "type" | "category"
> & {
  cover_url?: string | null;
};

type Props = {
  locale: string;
  listings: SimilarListing[];
};

export function ListingSimilar({ locale, listings }: Props) {
  if (listings.length === 0) return null;

  return (
    <section className="border-line rounded-2xl border bg-white p-5">
      <h2 className="text-ink mb-4 text-lg font-semibold">
        Annonces similaires
      </h2>
      <div className="grid gap-3 md:grid-cols-2">
        {listings.map((listing) => (
          <Link
            key={listing.id}
            href={`/${locale}/annonce/${listing.slug ?? listing.id}`}
            className="border-line bg-paper overflow-hidden rounded-xl border transition hover:shadow-sm"
          >
            {listing.cover_url ? (
              <Image
                src={listing.cover_url}
                alt={listing.title}
                width={800}
                height={600}
                loading="lazy"
                className="aspect-[4/3] w-full object-cover"
              />
            ) : null}
            <div className="p-3">
              <p className="text-ink line-clamp-1 text-sm font-medium">
                {listing.title}
              </p>
              <p className="text-bleu mt-1 text-sm font-semibold">
                {formatPrice(listing.price, listing.currency, listing.type)}
              </p>
              <p className="text-ink-soft mt-1 text-xs">{listing.city}</p>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
