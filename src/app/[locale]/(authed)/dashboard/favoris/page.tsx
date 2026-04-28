import { Heart } from "lucide-react";
import { redirect } from "next/navigation";
import Image from "next/image";
import { getTranslations } from "next-intl/server";

import { EmptyState } from "@/components/shared/EmptyState";
import { createClient } from "@/data/supabase/server";
import { Link } from "@/i18n/navigation";
import { formatPrice } from "@/lib/listing/format";

type Props = { params: Promise<{ locale: string }> };

export default async function FavorisPage({ params }: Props) {
  const { locale } = await params;
  const t = await getTranslations("common");
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    redirect(`/${locale}/login?redirect=/${locale}/dashboard/favoris`);
  }

  const { data: rows } = await supabase
    .from("favorites")
    .select(
      `
        listing_id,
        created_at,
        listings (
          id, slug, title, price, currency, transaction_type,
          surface_area:surface_m2, rooms_total:rooms, bedrooms,
          city, neighborhood, main_photo, photos, status, published_at
        )
      `,
    )
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  const listings = (rows ?? [])
    .map((r) => r.listings)
    .filter((l): l is NonNullable<typeof l> => l !== null && !Array.isArray(l));

  return (
    <main
      id="main-content"
      className="mx-auto max-w-7xl px-4 py-10 md:px-6 md:py-12"
    >
      <h1 className="text-encre dark:text-creme mb-8 font-serif text-3xl">
        {t("myFavorites")}
      </h1>

      {listings.length === 0 ? (
        <EmptyState
          icon={<Heart className="size-12" aria-hidden="true" />}
          title={t("noFavoritesTitle")}
          description={t("noFavoritesDesc")}
          action={
            <Link
              href="/search"
              className="bg-bleu hover:bg-bleu-hover rounded-control inline-flex items-center gap-2 px-5 py-2.5 text-sm font-medium text-white transition"
            >
              {t("exploreListings")}
            </Link>
          }
        />
      ) : (
        <ul className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {listings.map((listing) => {
            const cover =
              (listing.main_photo as string | null) ??
              (listing.photos as string[] | null)?.[0] ??
              null;
            const href = `/annonce/${listing.slug ?? listing.id}`;
            const priceLabel =
              listing.price == null
                ? null
                : formatPrice(
                    listing.price as number,
                    (listing.currency as string | null) ?? null,
                    (listing.transaction_type as string | null) ?? null,
                  );
            return (
              <li key={listing.id as string} className="flex">
                <Link
                  href={href}
                  className="border-bordurewarm-tertiary dark:border-encre/20 bg-blanc-casse dark:bg-encre/95 rounded-card shadow-card hover:shadow-card-hover focus-visible:ring-bleu group flex w-full flex-col overflow-hidden border transition focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none"
                >
                  <div className="bg-creme-foncee dark:bg-encre/40 relative aspect-[4/3] w-full overflow-hidden">
                    {cover ? (
                      <Image
                        src={cover}
                        alt={(listing.title as string | null) ?? ""}
                        fill
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                        className="object-cover transition-transform duration-500 group-hover:scale-[1.04]"
                      />
                    ) : null}
                  </div>
                  <div className="flex flex-1 flex-col gap-1 p-4">
                    <p className="text-encre dark:text-creme line-clamp-2 text-sm font-semibold">
                      {(listing.title as string | null) ?? ""}
                    </p>
                    {(listing.city as string | null) ? (
                      <p className="text-encre/60 dark:text-creme/60 text-xs">
                        {listing.neighborhood
                          ? `${listing.neighborhood} · ${listing.city ?? ""}`
                          : (listing.city as string)}
                      </p>
                    ) : null}
                    {priceLabel ? (
                      <p className="text-corail mt-2 font-serif text-lg">
                        {priceLabel}
                      </p>
                    ) : null}
                  </div>
                </Link>
              </li>
            );
          })}
        </ul>
      )}
    </main>
  );
}
