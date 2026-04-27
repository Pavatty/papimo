import type { Metadata } from "next";

import type { SearchResult } from "@/components/features/search/SearchPage";
import { SearchResults } from "@/components/features/search/SearchResults";
import { buildPageMetadata } from "@/lib/seo/metadata";
import { createClient } from "@/data/supabase/server";

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  return buildPageMetadata({
    locale,
    pathnameWithoutLocale: "/achat/appartement-tunis",
    title: "Appartement à vendre à Tunis | papimo",
    description:
      "Sélection d'appartements à vendre à Tunis entre particuliers.",
  });
}

export const revalidate = 900;

export default async function AchatAppartementTunisPage() {
  const supabase = await createClient();
  const { data } = await supabase
    .from("listings")
    .select(
      "id,title,price,price_currency,surface_area,rooms_total,bedrooms,city,neighborhood,main_photo,photos,latitude,longitude,property_type,transaction_type,amenities",
    )
    .eq("status", "active")
    .eq("transaction_type", "sale")
    .eq("property_type", "apartment")
    .ilike("city", "Tunis")
    .order("published_at", { ascending: false, nullsFirst: false })
    .limit(24);

  return (
    <main id="main-content" className="mx-auto max-w-6xl px-4 py-8 md:px-6">
      <h1 className="text-ink text-3xl font-bold">
        Appartement à vendre à Tunis
      </h1>
      <p className="text-ink-soft mt-2 text-sm">
        Page de recherche préfiltrée avec contenu SEO local.
      </p>
      <SearchResults results={(data ?? []) as SearchResult[]} loading={false} />
    </main>
  );
}
