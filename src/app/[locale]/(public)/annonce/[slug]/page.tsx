import { notFound } from "next/navigation";
import Link from "next/link";
import { getTranslations } from "next-intl/server";

import { ListingAmenities } from "@/components/features/listing/ListingAmenities";
import { ListingContactCard } from "@/components/features/listing/ListingContactCard";
import { ListingGallery } from "@/components/features/listing/ListingGallery";
import { ListingMap } from "@/components/features/listing/ListingMap";
import { ListingSeller } from "@/components/features/listing/ListingSeller";
import { ListingSimilar } from "@/components/features/listing/ListingSimilar";
import { ListingSpecs } from "@/components/features/listing/ListingSpecs";
import type { SellerProfile } from "@/components/features/listing/types";
import {
  getListingDetailsBySlug,
  getSimilarActiveListings,
} from "@/data/repositories/listings";
import {
  getTransactionBadge,
  type LocaleKey,
} from "@/data/repositories/taxonomies";
import { createClient } from "@/data/supabase/server";
import { isWithinDays } from "@/lib/dates";
import { formatPrice } from "@/lib/listing/format";

type Params = Promise<{ locale: string; slug: string }>;

export async function generateMetadata({ params }: { params: Params }) {
  const { slug } = await params;
  const listing = await getListingDetailsBySlug(slug);
  if (!listing) return { title: "Annonce introuvable | papimo" };
  return {
    title: `${listing.title} | papimo`,
    description:
      listing.description?.slice(0, 160) ??
      `Annonce à ${listing.city} sur papimo`,
  };
}

export default async function ListingDetailPage({
  params,
}: {
  params: Params;
}) {
  const { locale, slug } = await params;
  const t = await getTranslations({ locale });
  const listing = await getListingDetailsBySlug(slug);
  if (!listing) notFound();

  const supabase = await createClient();
  const {
    data: { user: authUser },
  } = await supabase.auth.getUser();
  const isAuthenticated = Boolean(authUser);

  const { data: sellerData } = await supabase
    .from("profiles")
    .select("id, full_name, avatar_url, is_verified, kyc_status, created_at")
    .eq("id", listing.owner_id)
    .maybeSingle();
  const seller = (sellerData as SellerProfile | null) ?? {
    id: listing.owner_id,
    full_name: null,
    avatar_url: null,
    is_verified: false,
    kyc_status: "pending",
    created_at: new Date().toISOString(),
  };

  const galleryImages = (listing.listing_images ?? []).map((img) => ({
    id: img.id,
    url: img.url,
    alt_text: img.alt_text ?? null,
  }));

  const localeKey: LocaleKey =
    locale === "ar" || locale === "en" ? (locale as LocaleKey) : "fr";
  const badge = await getTransactionBadge(listing.transaction_type, localeKey);

  const isRecent = isWithinDays(listing.created_at, 7);
  const listingCreatedLabel = new Date(listing.created_at).toLocaleDateString(
    locale === "ar" ? "ar-TN" : locale === "en" ? "en-GB" : "fr-FR",
  );

  const similar = await getSimilarActiveListings({
    transactionType: listing.transaction_type,
    city: listing.city,
    excludeId: listing.id,
    limit: 4,
  });
  const similarForComponent = similar.map((dto) => ({
    id: dto.id,
    slug: dto.slug,
    title: dto.title,
    price: dto.price ?? 0,
    currency: (dto.priceCurrency ?? "TND") as
      | "TND"
      | "EUR"
      | "USD"
      | "MAD"
      | "DZD",
    city: dto.city ?? "",
    type:
      dto.transactionType === "rent" ? ("rent" as const) : ("sale" as const),
    category: listing.category,
    cover_url: dto.mainPhoto ?? dto.photos[0] ?? null,
  }));

  return (
    <article className="max-w-container mx-auto px-4 py-8 md:px-6 md:py-12 lg:px-8">
      <nav aria-label="Fil d'Ariane" className="text-muted mb-6 text-sm">
        <Link href={`/${locale}`} className="hover:text-bleu">
          {t("common.brandName")}
        </Link>
        <span className="mx-2">›</span>
        <Link href={`/${locale}/search`} className="hover:text-bleu">
          {t("navigation.search")}
        </Link>
        <span className="mx-2">›</span>
        <span className="text-encre">{listing.title}</span>
      </nav>

      <header className="mb-8">
        {badge && (
          <span className="bg-corail mb-3 inline-block rounded-full px-3 py-1 text-xs font-medium tracking-wide text-white uppercase">
            {badge}
          </span>
        )}
        <h1 className="text-encre mb-2 font-serif text-3xl leading-tight md:text-4xl">
          {listing.title}
        </h1>
        <p className="text-muted text-base">
          {listing.neighborhood ? `${listing.neighborhood} · ` : ""}
          {listing.city ?? ""}
        </p>
        <p className="text-corail mt-3 font-serif text-2xl md:text-3xl">
          {formatPrice(
            listing.price,
            listing.price_currency ?? listing.currency,
            listing.transaction_type ?? listing.type,
          )}
        </p>
      </header>

      <section className="mb-10">
        <ListingGallery images={galleryImages} />
      </section>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-[1fr_320px] lg:gap-12">
        <div className="space-y-8">
          <ListingSpecs listing={listing} />

          {listing.description && (
            <section>
              <h2 className="text-encre mb-4 font-serif text-xl">
                Description
              </h2>
              <p className="text-encre/80 leading-relaxed whitespace-pre-line">
                {listing.description}
              </p>
            </section>
          )}

          <ListingAmenities
            amenityKeys={(listing.listing_amenities ?? []).map(
              (a) => a.amenity_key,
            )}
          />

          <ListingMap
            latitude={listing.latitude}
            longitude={listing.longitude}
            isRecent={isRecent}
          />
        </div>

        <aside className="space-y-6">
          <ListingContactCard
            locale={locale}
            listing={listing}
            seller={seller}
            isAuthenticated={isAuthenticated}
            listingCreatedLabel={listingCreatedLabel}
          />
          <ListingSeller seller={seller} />
        </aside>
      </div>

      {similarForComponent.length > 0 && (
        <section className="mt-12">
          <ListingSimilar locale={locale} listings={similarForComponent} />
        </section>
      )}
    </article>
  );
}
