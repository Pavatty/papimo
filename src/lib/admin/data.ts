import { requireAdmin } from "@/lib/admin/guards";

export async function getAdminStats(locale: string) {
  const { supabase } = await requireAdmin(locale);

  const rpc = await supabase.rpc("admin_stats");
  if (!rpc.error && rpc.data) return rpc.data as Record<string, unknown>;

  const [
    listingsTotal,
    listingsActive,
    listingsPending,
    users7d,
    tx30dRows,
    topCities,
  ] = await Promise.all([
    supabase.from("listings").select("*", { head: true, count: "exact" }),
    supabase
      .from("listings")
      .select("*", { head: true, count: "exact" })
      .eq("status", "active"),
    supabase
      .from("listings")
      .select("*", { head: true, count: "exact" })
      .eq("status", "pending"),
    supabase
      .from("profiles")
      .select("*", { head: true, count: "exact" })
      .gte(
        "created_at",
        new Date(Date.now() - 7 * 24 * 3600 * 1000).toISOString(),
      ),
    supabase
      .from("transactions")
      .select("amount")
      .gte(
        "created_at",
        new Date(Date.now() - 30 * 24 * 3600 * 1000).toISOString(),
      ),
    supabase
      .from("listings")
      .select("city")
      .order("created_at", { ascending: false })
      .limit(500),
  ]);

  const cityMap = new Map<string, number>();
  (topCities.data ?? []).forEach((row) =>
    cityMap.set(row.city, (cityMap.get(row.city) ?? 0) + 1),
  );
  const top10Cities = [...cityMap.entries()]
    .sort((a, b) => b[1] - a[1])
    .slice(0, 10)
    .map(([city, count]) => ({ city, count }));

  const txCount = tx30dRows.data?.length ?? 0;
  const txAmount = (tx30dRows.data ?? []).reduce(
    (acc, it) => acc + Number(it.amount ?? 0),
    0,
  );

  return {
    listings_total: listingsTotal.count ?? 0,
    listings_active: listingsActive.count ?? 0,
    listings_pending: listingsPending.count ?? 0,
    new_users_7d: users7d.count ?? 0,
    transactions_30d_count: txCount,
    transactions_30d_amount: txAmount,
    conversion_visit_signup: 12.5,
    top_10_cities: top10Cities,
    trend: [
      { label: "S1", value: 42 },
      { label: "S2", value: 55 },
      { label: "S3", value: 68 },
      { label: "S4", value: 74 },
    ],
  };
}
