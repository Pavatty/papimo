import type { Metadata } from "next";

import { ListingCardGrid } from "@/components/features/search/ListingCardGrid";
import { buildPageMetadata } from "@/lib/seo/metadata";
import { createClient } from "@/lib/supabase/server";

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  return buildPageMetadata({
    locale,
    pathnameWithoutLocale: "/location/villa-marsa",
    title: "Villa à louer à La Marsa | papimo",
    description: "Sélection de villas à louer à La Marsa entre particuliers.",
  });
}

export const revalidate = 900;

export default async function LocationVillaMarsaPage() {
  const supabase = await createClient();
  const { data } = await supabase
    .from("listings")
    .select("id,slug,title,price,currency,city,type,category")
    .eq("status", "active")
    .eq("type", "rent")
    .eq("category", "villa")
    .ilike("city", "%Marsa%")
    .order("created_at", { ascending: false })
    .limit(24);

  return (
    <main id="main-content" className="mx-auto max-w-6xl px-4 py-8 md:px-6">
      <h1 className="text-ink text-3xl font-bold">Villa à louer à La Marsa</h1>
      <p className="text-ink-soft mt-2 text-sm">
        Landing page SEO locale basée sur des filtres de recherche.
      </p>
      <ListingCardGrid listings={data ?? []} />
    </main>
  );
}
