import type { SupabaseClient } from "@supabase/supabase-js";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { getTranslations } from "next-intl/server";
import { createClient } from "@/lib/supabase/server";

type Params = Promise<{ locale: string; slug: string }>;

type ListingRow = {
  title: string | null;
  description: string | null;
  city: string | null;
  neighborhood: string | null;
  price: number | null;
  price_currency: string | null;
  surface_area: number | null;
  rooms_total: number | null;
  bedrooms: number | null;
  bathrooms: number | null;
  floor: number | null;
  property_type: string | null;
  transaction_type: string | null;
  photos: string[] | null;
  main_photo: string | null;
  amenities: string[] | null;
};

export async function generateMetadata({ params }: { params: Params }) {
  const { slug } = await params;
  const supabase = (await createClient()) as unknown as SupabaseClient;
  const { data } = await supabase
    .from("listings")
    .select("title, description, city, price, price_currency")
    .eq("slug", slug)
    .eq("status", "active")
    .maybeSingle<ListingRow>();
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
  const supabase = (await createClient()) as unknown as SupabaseClient;

  const { data: listing } = await supabase
    .from("listings")
    .select("*")
    .eq("slug", slug)
    .eq("status", "active")
    .maybeSingle<ListingRow>();

  if (!listing) notFound();

  const photos: string[] = (listing.photos as string[] | null) ?? [];
  const mainPhoto = (listing.main_photo as string | null) ?? photos[0] ?? null;
  const gallery = photos.length > 0 ? photos : mainPhoto ? [mainPhoto] : [];

  const txBadge: Record<string, string> = {
    sale: "À vendre",
    rent: "À louer",
    seasonal_rent: "Location saisonnière",
    colocation: "Colocation",
  };

  const formatPrice = (
    price: number | null,
    currency: string | null,
    tx: string | null,
  ) => {
    if (!price) return "Prix sur demande";
    const formatted = new Intl.NumberFormat("fr-FR").format(price);
    const suffix = tx === "rent" || tx === "seasonal_rent" ? " / mois" : "";
    return `${formatted} ${currency ?? "TND"}${suffix}`;
  };

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
            {txBadge[listing.transaction_type as string] ??
              listing.transaction_type}
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
            listing.price as number | null,
            listing.price_currency as string | null,
            listing.transaction_type as string | null,
          )}
        </p>
      </header>

      {gallery.length > 0 && (
        <section className="mb-10">
          <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
            <div className="rounded-card bg-creme-foncee relative aspect-[4/3] overflow-hidden md:col-span-2 md:aspect-[3/2]">
              <Image
                src={gallery[0] as string}
                alt={listing.title as string}
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
                    {(listing.property_type as string).replace(/_/g, " ")}
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

          {Array.isArray(listing.amenities) &&
            (listing.amenities as string[]).length > 0 && (
              <section className="mb-8">
                <h2 className="text-encre mb-4 font-serif text-xl">
                  Équipements
                </h2>
                <ul className="flex flex-wrap gap-2">
                  {(listing.amenities as string[]).map((a) => (
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
