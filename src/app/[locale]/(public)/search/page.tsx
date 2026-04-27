import type { Metadata } from "next";

import { ListingCardGrid } from "@/components/features/search/ListingCardGrid";
import { captureServerEvent } from "@/lib/analytics/events";
import { buildPageMetadata } from "@/lib/seo/metadata";
import { createClient } from "@/lib/supabase/server";
import type { Database } from "@/types/database";

type ListingRow = Database["public"]["Tables"]["listings"]["Row"];

type Props = {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{
    q?: string;
    type?: string;
    category?: string;
    city?: string;
  }>;
};

export async function generateMetadata({
  params,
  searchParams,
}: Props): Promise<Metadata> {
  const [{ locale }, query] = await Promise.all([params, searchParams]);
  const title = query.q
    ? `Recherche "${query.q}" | papimo`
    : "Recherche immobilière | papimo";
  const description =
    "Trouvez rapidement un bien immobilier par ville, catégorie ou type de transaction.";
  return buildPageMetadata({
    locale,
    pathnameWithoutLocale: "/search",
    title,
    description,
  });
}

export default async function SearchPage({ searchParams }: Props) {
  const query = await searchParams;
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  let req = supabase
    .from("listings")
    .select("id,slug,title,price,currency,city,type,category")
    .eq("status", "active")
    .order("created_at", { ascending: false })
    .limit(30);

  if (query.type) req = req.eq("type", query.type as ListingRow["type"]);
  if (query.category)
    req = req.eq("category", query.category as ListingRow["category"]);
  if (query.city) req = req.ilike("city", `%${query.city}%`);
  if (query.q) req = req.or(`title.ilike.%${query.q}%,city.ilike.%${query.q}%`);

  const { data } = await req;
  await captureServerEvent("search_performed", user?.id ?? "anon", {
    q: query.q ?? null,
    type: query.type ?? null,
    category: query.category ?? null,
    city: query.city ?? null,
    results: data?.length ?? 0,
  });

  return (
    <main id="main-content" className="mx-auto max-w-6xl px-4 py-8 md:px-6">
      <h1 className="text-ink text-3xl font-bold">Recherche immobilière</h1>
      <ListingCardGrid listings={data ?? []} />
    </main>
  );
}
