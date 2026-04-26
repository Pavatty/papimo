import { startBoostCheckoutAction } from "@/lib/payments/actions";
import { BOOST_CONFIG } from "@/lib/payments/pricing";
import { createClient } from "@/lib/supabase/server";
import type { Enums } from "@/types/database";

import { Link } from "@/i18n/navigation";

const boostTypes = Object.keys(BOOST_CONFIG) as Enums<"boost_type">[];

type Props = {
  searchParams: Promise<{ favorites?: string }>;
};

export default async function DashboardListingsPage({ searchParams }: Props) {
  const { favorites: favoritesParam } = await searchParams;
  const showFavorites = favoritesParam === "true" || favoritesParam === "1";

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;

  if (showFavorites) {
    const { data: rows } = await supabase
      .from("favorites")
      .select("listing_id, listings ( id, slug, title, status, pack )")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false })
      .limit(50);

    const favorites = (rows ?? [])
      .map((r) => {
        const l = r.listings;
        if (!l || Array.isArray(l)) return null;
        return {
          id: l.id,
          slug: l.slug,
          title: l.title,
          status: l.status,
          pack: l.pack,
        };
      })
      .filter((x): x is NonNullable<typeof x> => x !== null);

    return (
      <main className="bg-creme-pale min-h-screen px-6 py-8">
        <div className="mx-auto max-w-5xl">
          <h1 className="font-display text-ink text-3xl font-bold">
            Mes favoris
          </h1>
          <p className="text-ink-soft mt-2 text-sm">
            <Link href="/dashboard/listings" className="text-bleu font-medium">
              Voir mes annonces
            </Link>
          </p>
          <div className="mt-6 space-y-4">
            {favorites.length === 0 ? (
              <p className="text-ink-soft text-sm">
                Aucun favori pour le moment.{" "}
                <Link className="text-bleu font-medium" href="/search">
                  Parcourir les annonces
                </Link>
              </p>
            ) : (
              favorites.map((listing) => (
                <article
                  key={listing.id}
                  className="border-line rounded-2xl border bg-white p-5"
                >
                  <h2 className="text-ink text-lg font-semibold">
                    {listing.title}
                  </h2>
                  <p className="text-ink-soft text-sm">
                    {listing.status} • pack {listing.pack}
                  </p>
                  <Link
                    className="text-bleu mt-2 inline-block text-sm font-medium"
                    href={`/listings/${listing.slug}`}
                  >
                    Voir l’annonce →
                  </Link>
                </article>
              ))
            )}
          </div>
        </div>
      </main>
    );
  }

  const { data: listings } = await supabase
    .from("listings")
    .select("id, title, status, pack")
    .eq("owner_id", user.id)
    .order("created_at", { ascending: false })
    .limit(30);

  return (
    <main className="bg-creme-pale min-h-screen px-6 py-8">
      <div className="mx-auto max-w-5xl">
        <h1 className="font-display text-ink text-3xl font-bold">
          Mes annonces
        </h1>
        <p className="text-ink-soft mt-2 text-sm">
          <Link
            href="/dashboard/listings?favorites=true"
            className="text-bleu font-medium"
          >
            Voir mes favoris
          </Link>
        </p>
        <div className="mt-6 space-y-4">
          {(listings ?? []).map((listing) => (
            <article
              key={listing.id}
              className="border-line rounded-2xl border bg-white p-5"
            >
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <h2 className="text-ink text-lg font-semibold">
                    {listing.title}
                  </h2>
                  <p className="text-ink-soft text-sm">
                    {listing.status} • pack {listing.pack}
                  </p>
                </div>
                <form
                  action={startBoostCheckoutAction}
                  className="flex flex-wrap gap-2"
                >
                  <input type="hidden" name="listingId" value={listing.id} />
                  {boostTypes.map((type) => (
                    <button
                      key={type}
                      type="submit"
                      name="boostType"
                      value={type}
                      className="border-line bg-bleu-pale text-bleu rounded-full border px-3 py-1 text-xs"
                    >
                      {type} • {BOOST_CONFIG[type].priceTnd} DT /{" "}
                      {BOOST_CONFIG[type].durationDays}j
                    </button>
                  ))}
                </form>
              </div>
            </article>
          ))}
        </div>
      </div>
    </main>
  );
}
