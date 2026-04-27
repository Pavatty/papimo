import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { getTranslations } from "next-intl/server";

import { createClient } from "@/data/supabase/server";
import { formatPrice, getTransactionBadge } from "@/lib/listing/format";

type Params = Promise<{ locale: string; slug: string }>;

export async function generateMetadata({ params }: { params: Params }) {
  const { slug } = await params;
  const supabase = await createClient();
  const { data } = await supabase
    .from("listings")
    .select("title, description, city, price, price_currency")
    .eq("slug", slug)
    .eq("status", "active")
    .maybeSingle();
  if (!data) return { title: "Annonce introuvable | papimo" };
  return {
    title: `${data.title} | papimo`,
    description:
      data.description?.slice(0, 160) ?? `Annonce à ${data.city} sur papimo`,
  };
}

export default async function ListingDetailPage({
  params,
}: {
  params: Params;
}) {
  const { locale, slug } = await params;
  await getTranslations({ locale });
  const supabase = await createClient();

  const { data: listing } = await supabase
    .from("listings")
    .select("*")
    .eq("slug", slug)
    .eq("status", "active")
    .maybeSingle();

  if (!listing) notFound();

  const photos: string[] = listing.photos ?? [];
  const mainPhoto = listing.main_photo ?? photos[0] ?? null;
  const gallery = photos.length > 0 ? photos : mainPhoto ? [mainPhoto] : [];

  return (
    <article className="max-w-container mx-auto px-4 py-8 md:px-6 md:py-12 lg:px-8">
      <nav aria-label="Fil d'Ariane" className="text-muted mb-6 text-sm">
        <Link href={`/${locale}`} className="hover:text-bleu">
          Accueil
        </Link>
        <span className="mx-2">›</span>
        <Link href={`/${locale}/search`} className="hover:text-bleu">
          Recherche
        </Link>
        <span className="mx-2">›</span>
        <span className="text-encre">{listing.title}</span>
      </nav>

      <header className="mb-8">
        {listing.transaction_type && (
          <span className="bg-corail mb-3 inline-block rounded-full px-3 py-1 text-xs font-medium tracking-wide text-white uppercase">
            {getTransactionBadge(listing.transaction_type)}
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
            listing.price_currency,
            listing.transaction_type,
          )}
        </p>
      </header>

      {gallery.length > 0 && (
        <section className="mb-10">
          <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
            <div className="rounded-card bg-creme-foncee relative aspect-[4/3] overflow-hidden md:col-span-2 md:aspect-[3/2]">
              <Image
                src={gallery[0] ?? ""}
                alt={listing.title}
                fill
                className="object-cover"
                priority
                sizes="(min-width: 1024px) 1200px, 100vw"
              />
            </div>
            {gallery.slice(1, 5).map((src, i) => (
              <div
                key={i}
                className="rounded-card bg-creme-foncee relative aspect-[4/3] overflow-hidden"
              >
                <Image
                  src={src}
                  alt={`${listing.title} - photo ${i + 2}`}
                  fill
                  className="object-cover"
                  sizes="(min-width: 1024px) 600px, 50vw"
                />
              </div>
            ))}
          </div>
        </section>
      )}

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-[1fr_320px] lg:gap-12">
        <div>
          <section className="mb-8">
            <h2 className="text-encre mb-4 font-serif text-xl">
              Caractéristiques
            </h2>
            <dl className="grid grid-cols-2 gap-4 md:grid-cols-3">
              {listing.surface_area && (
                <div>
                  <dt className="text-muted text-xs tracking-wide uppercase">
                    Surface
                  </dt>
                  <dd className="text-encre text-base font-medium">
                    {listing.surface_area} m²
                  </dd>
                </div>
              )}
              {listing.rooms_total != null && (
                <div>
                  <dt className="text-muted text-xs tracking-wide uppercase">
                    Pièces
                  </dt>
                  <dd className="text-encre text-base font-medium">
                    {listing.rooms_total}
                  </dd>
                </div>
              )}
              {listing.bedrooms != null && (
                <div>
                  <dt className="text-muted text-xs tracking-wide uppercase">
                    Chambres
                  </dt>
                  <dd className="text-encre text-base font-medium">
                    {listing.bedrooms}
                  </dd>
                </div>
              )}
              {listing.bathrooms != null && (
                <div>
                  <dt className="text-muted text-xs tracking-wide uppercase">
                    Salles de bain
                  </dt>
                  <dd className="text-encre text-base font-medium">
                    {listing.bathrooms}
                  </dd>
                </div>
              )}
              {listing.floor != null && (
                <div>
                  <dt className="text-muted text-xs tracking-wide uppercase">
                    Étage
                  </dt>
                  <dd className="text-encre text-base font-medium">
                    {listing.floor}
                  </dd>
                </div>
              )}
              {listing.property_type && (
                <div>
                  <dt className="text-muted text-xs tracking-wide uppercase">
                    Type de bien
                  </dt>
                  <dd className="text-encre text-base font-medium capitalize">
                    {listing.property_type.replace(/_/g, " ")}
                  </dd>
                </div>
              )}
            </dl>
          </section>

          {listing.description && (
            <section className="mb-8">
              <h2 className="text-encre mb-4 font-serif text-xl">
                Description
              </h2>
              <p className="text-encre/80 leading-relaxed whitespace-pre-line">
                {listing.description}
              </p>
            </section>
          )}

          {listing.amenities && listing.amenities.length > 0 && (
            <section className="mb-8">
              <h2 className="text-encre mb-4 font-serif text-xl">
                Équipements
              </h2>
              <ul className="flex flex-wrap gap-2">
                {listing.amenities.map((a) => (
                  <li
                    key={a}
                    className="bg-creme-foncee text-encre/80 rounded-full px-3 py-1.5 text-sm"
                  >
                    {a}
                  </li>
                ))}
              </ul>
            </section>
          )}
        </div>

        <aside className="self-start lg:sticky lg:top-20">
          <div className="bg-blanc-casse border-bordurewarm-tertiary rounded-card shadow-card border p-6">
            <h2 className="text-encre mb-4 font-serif text-lg">
              Contacter le propriétaire
            </h2>
            <p className="text-muted mb-4 text-sm">
              Connectez-vous pour échanger directement avec le propriétaire.
            </p>
            <Link
              href={`/${locale}/login?redirect=/${locale}/annonce/${slug}`}
              className="bg-corail hover:bg-corail-hover rounded-control block w-full py-3 text-center font-medium text-white transition"
            >
              Connexion pour contacter
            </Link>
            <Link
              href={`/${locale}/search`}
              className="text-bleu hover:text-bleu-hover mt-3 block w-full text-center text-sm"
            >
              ← Retour à la recherche
            </Link>
          </div>
        </aside>
      </div>
    </article>
  );
}
