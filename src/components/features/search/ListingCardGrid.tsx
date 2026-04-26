import { Link } from "@/i18n/navigation";
import { formatPrice } from "@/lib/listing/format";

type ListingItem = {
  id: string;
  slug: string | null;
  title: string;
  price: number;
  currency: string;
  city: string;
  type: string;
  category: string;
};

export function ListingCardGrid({ listings }: { listings: ListingItem[] }) {
  if (!listings.length) {
    return (
      <p className="text-ink-soft mt-6 text-sm">
        Aucun résultat pour le moment.
      </p>
    );
  }

  return (
    <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
      {listings.map((listing) => (
        <article
          key={listing.id}
          className="border-line rounded-2xl border bg-white p-4"
        >
          <h2 className="text-ink line-clamp-2 text-base font-semibold">
            {listing.title}
          </h2>
          <p className="text-bleu mt-1 text-sm font-medium">
            {formatPrice(listing.price, listing.currency)}
          </p>
          <p className="text-ink-soft mt-1 text-xs">
            {listing.city} • {listing.type} • {listing.category}
          </p>
          {listing.slug ? (
            <Link
              href={`/listings/${listing.slug}`}
              className="text-corail mt-3 inline-block text-sm"
            >
              Voir le détail
            </Link>
          ) : null}
        </article>
      ))}
    </div>
  );
}
