import { createClient } from "@/data/supabase/server";

const DEFAULT_MAX_FREE_LISTINGS = 3;

async function getMaxFreeListings(): Promise<number> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("app_settings")
    .select("value")
    .eq("key", "anti_agency_max_free_listings")
    .maybeSingle();
  const raw = data?.value;
  if (typeof raw === "number" && Number.isFinite(raw) && raw > 0) return raw;
  return DEFAULT_MAX_FREE_LISTINGS;
}

export type AntiAgencyCheck =
  | { allowed: true; activeCount: number; max: number }
  | { allowed: false; activeCount: number; max: number };

export async function checkAntiAgency(
  userId: string,
): Promise<AntiAgencyCheck> {
  const supabase = await createClient();
  const max = await getMaxFreeListings();

  const { count } = await supabase
    .from("listings")
    .select("*", { count: "exact", head: true })
    .eq("owner_id", userId)
    .eq("pack", "free")
    .in("status", ["active", "pending"]);

  const activeCount = count ?? 0;
  if (activeCount >= max) {
    return { allowed: false, activeCount, max };
  }
  return { allowed: true, activeCount, max };
}
