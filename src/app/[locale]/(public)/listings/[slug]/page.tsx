import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { cache } from "react";
import ReactMarkdown from "react-markdown";
import rehypeSanitize from "rehype-sanitize";
import remarkGfm from "remark-gfm";

import { ListingAmenities } from "@/components/features/listing/ListingAmenities";
import { ListingContactCard } from "@/components/features/listing/ListingContactCard";
import { ListingGallery } from "@/components/features/listing/ListingGallery";
import { ListingMap } from "@/components/features/listing/ListingMap";
import { ListingSeller } from "@/components/features/listing/ListingSeller";
import { ListingSimilar } from "@/components/features/listing/ListingSimilar";
import { ListingSpecs } from "@/components/features/listing/ListingSpecs";
import { ReportListingDialog } from "@/components/features/listing/ReportListingDialog";
import type { ListingDetails } from "@/components/features/listing/types";
import { formatPrice } from "@/lib/listing/format";
import { buildPageMetadata, buildRealEstateJsonLd } from "@/lib/seo/metadata";
import { createClient } from "@/lib/supabase/server";
import { captureServerEvent } from "@/lib/analytics/events";

type PageProps = {
  params: Promise<{ locale: string; slug: string }>;
};

const getListingBySlug = cache(async (slug: string) => {
  const supabase = await createClient();
  const { data: listing } = await supabase
    .from("listings")
    .select("*, listing_images(*), listing_amenities(*)")
    .eq("slug", slug)
    .eq("status", "active")
    .limit(1)
    .maybeSingle();

  return listing as ListingDetails | null;
});

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { slug, locale } = await params;
  const listing = await getListingBySlug(slug);
  if (!listing) {
    return buildPageMetadata({
      locale,
      pathnameWithoutLocale: `/listings/${slug}`,
      title: "Annonce introuvable | papimo",
      description: "Cette annonce n'est plus disponible.",
    });
  }

  const cover =
    listing.listing_images.find((image) => image.is_cover) ??
    listing.listing_images[0];
  const title = `${listing.title} | Papimo`;
  const description = (listing.description ?? "").slice(0, 155);
  return buildPageMetadata({
    locale,
    pathnameWithoutLocale: `/listings/${listing.slug}`,
    title,
    description,
    ...(cover?.url ? { ogImage: cover.url } : {}),
  });
}

export default async function ListingPage({ params }: PageProps) {
  const { locale, slug } = await params;
  const listing = await getListingBySlug(slug);
  if (!listing) notFound();

  const supabase = await createClient();
  await supabase.rpc("increment_listing_view", { listing_id: listing.id });

  const {
    data: { user },
  } = await supabase.auth.getUser();
  await captureServerEvent("listing_viewed", user?.id ?? `anon:${listing.id}`, {
    listingId: listing.id,
    slug: listing.slug,
  });

  const { data: seller } = await supabase
    .from("profiles")
    .select("id, full_name, avatar_url, is_verified, kyc_status, created_at")
    .eq("id", listing.owner_id)
    .single();

  const { data: similarBase } = await supabase
    .from("listings")
    .select("id, slug, title, price, currency, city, type, category")
    .eq("status", "active")
    .eq("type", listing.type)
    .eq("category", listing.category)
    .eq("city", listing.city)
    .neq("id", listing.id)
    .order("created_at", { ascending: false })
    .limit(4);

  const similarIds = (similarBase ?? []).map((item) => item.id);
  const { data: similarImages } = similarIds.length
    ? await supabase
        .from("listing_images")
        .select("listing_id, url, is_cover, position")
        .in("listing_id", similarIds)
        .order("position", { ascending: true })
    : {
        data: [] as Array<{
          listing_id: string;
          url: string;
          is_cover: boolean;
          position: number;
        }>,
      };

  const similarListings =
    similarBase?.map((item) => {
      const cover =
        similarImages?.find(
          (img) => img.listing_id === item.id && img.is_cover,
        ) ?? similarImages?.find((img) => img.listing_id === item.id);
      return { ...item, cover_url: cover?.url ?? null };
    }) ?? [];

  let medianQuery = supabase
    .from("price_index")
    .select("avg_price_m2_sale, avg_price_m2_rent")
    .eq("country_code", listing.country_code)
    .eq("city", listing.city);
  medianQuery =
    listing.neighborhood === null
      ? medianQuery.is("neighborhood", null)
      : medianQuery.eq("neighborhood", listing.neighborhood);
  const { data: medianRow } = await medianQuery
    .order("period", { ascending: false })
    .limit(1)
    .maybeSingle();

  const median =
    listing.type === "sale"
      ? medianRow?.avg_price_m2_sale
      : medianRow?.avg_price_m2_rent;
  const pricePerM2 = listing.surface_m2
    ? listing.price / listing.surface_m2
    : null;
  let marketLevel: "green" | "orange" | "red" | null = null;
  if (median && pricePerM2) {
    const ratio = pricePerM2 / median;
    if (ratio >= 0.8 && ratio <= 1.2) marketLevel = "green";
    else if (ratio >= 0.5 && ratio <= 1.5) marketLevel = "orange";
    else marketLevel = "red";
  }

  const isRecent = listing.views_count < 20;
  const listingCreatedLabel = new Date(listing.created_at).toLocaleDateString(
    "fr-FR",
  );

  const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";
  const jsonLd = buildRealEstateJsonLd({
    title: listing.title,
    description: listing.description,
    images: listing.listing_images.map((img) => img.url),
    datePosted: listing.created_at,
    price: listing.price,
    currency: listing.currency,
    countryCode: listing.country_code,
    city: listing.city,
    address: listing.address,
    latitude: listing.latitude,
    longitude: listing.longitude,
    url: `${appUrl}/${locale}/listings/${listing.slug}`,
  });

  return (
    <main className="bg-paper min-h-screen">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <div className="mx-auto max-w-7xl px-4 py-6 md:px-6">
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-[65%_35%]">
          <div className="space-y-5">
            <ListingGallery
              images={listing.listing_images.map((img) => ({
                id: img.id,
                url: img.url,
                alt_text: img.alt_text,
              }))}
            />

            <section className="border-line rounded-2xl border bg-white p-5">
              <p className="text-ink-soft mb-2 text-sm">
                Acheter &gt; Tunisie &gt; {listing.city} &gt; {listing.category}
              </p>
              <h1 className="font-display text-ink text-3xl font-bold">
                {listing.title}
              </h1>
              <p className="text-ink-soft mt-2 text-sm">
                {listing.type} • {listing.surface_m2 ?? "-"} m² •{" "}
                {listing.rooms ?? "-"} pièces • Étage {listing.floor ?? "-"} •{" "}
                {listing.city}
              </p>
            </section>

            <section className="border-line rounded-2xl border bg-white p-5">
              <div className="flex flex-wrap items-end justify-between gap-3">
                <div>
                  <p className="text-bleu text-3xl font-bold">
                    {formatPrice(listing.price, listing.currency)}
                  </p>
                  <p className="text-ink-soft font-mono text-sm">
                    {pricePerM2
                      ? `${Math.round(pricePerM2)} ${listing.currency}/m²`
                      : "-"}
                  </p>
                </div>
                {marketLevel ? (
                  <span
                    className={`rounded-full px-3 py-1 text-xs font-medium ${
                      marketLevel === "green"
                        ? "bg-green/10 text-green"
                        : marketLevel === "orange"
                          ? "bg-orange-100 text-orange-700"
                          : "bg-red-100 text-red-700"
                    }`}
                  >
                    {marketLevel === "green" && "Dans le marché du quartier"}
                    {marketLevel === "orange" && "Écart 20-50% du marché"}
                    {marketLevel === "red" && "Écart supérieur à 50% du marché"}
                  </span>
                ) : null}
              </div>
            </section>

            <section className="border-line rounded-2xl border bg-white p-5">
              <h2 className="text-ink mb-3 text-lg font-semibold">
                Description
              </h2>
              <article className="prose prose-sm text-ink max-w-none">
                <ReactMarkdown
                  remarkPlugins={[remarkGfm]}
                  rehypePlugins={[rehypeSanitize]}
                >
                  {listing.description ?? ""}
                </ReactMarkdown>
              </article>
            </section>

            <ListingSpecs listing={listing} />
            <ListingAmenities
              amenityKeys={listing.listing_amenities.map(
                (item) => item.amenity_key,
              )}
            />
            <ListingMap
              latitude={listing.latitude}
              longitude={listing.longitude}
              isRecent={isRecent}
            />
            {seller ? <ListingSeller seller={seller} /> : null}

            <section className="border-line rounded-2xl border bg-white p-5">
              <ReportListingDialog listingId={listing.id} />
            </section>

            <ListingSimilar locale={locale} listings={similarListings} />
          </div>

          <div className="lg:sticky lg:top-24 lg:h-fit">
            {seller ? (
              <ListingContactCard
                locale={locale}
                listing={listing}
                seller={seller}
                isAuthenticated={Boolean(user)}
                listingCreatedLabel={listingCreatedLabel}
              />
            ) : null}
          </div>
        </div>
      </div>

      <div className="border-line fixed right-0 bottom-0 left-0 z-40 border-t bg-white/95 p-3 lg:hidden">
        <Link
          href={
            user
              ? `/${locale}/messages?listing_id=${listing.id}&seller_id=${listing.owner_id}`
              : `/${locale}/login?redirect_to=/${locale}/listings/${listing.slug}`
          }
          className="bg-corail inline-flex w-full items-center justify-center rounded-lg px-4 py-3 text-sm font-semibold text-white"
        >
          Contacter le vendeur
        </Link>
      </div>
    </main>
  );
}
