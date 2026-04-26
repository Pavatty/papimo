import { createClient } from "@/lib/supabase/server";
import type { Database } from "@/types/database";

type ListingRow = Database["public"]["Tables"]["listings"]["Row"];

const defaultBlacklist = [
  "western union",
  "moneygram",
  "virement bancaire à l'étranger",
  "mandat cash",
  "payez en avance",
  "avant visite",
  "numéro téléphone",
];

export type ModerationResult =
  | { result: "active"; reasons: string[] }
  | { result: "pending"; reasons: string[] }
  | { result: "manual_review"; reasons: string[] };

export async function moderateListing(
  listing: ListingRow,
): Promise<ModerationResult> {
  const reasons: string[] = [];
  const supabase = await createClient();

  const { data: settingsRow } = await supabase
    .from("settings")
    .select("value")
    .eq("key", "blacklist_keywords")
    .maybeSingle();

  const blacklist = Array.isArray(settingsRow?.value)
    ? settingsRow?.value.map((v) => String(v).toLowerCase())
    : defaultBlacklist;

  const haystack =
    `${listing.title ?? ""} ${listing.description ?? ""}`.toLowerCase();
  if (blacklist.some((keyword) => haystack.includes(keyword))) {
    reasons.push("blacklist_keyword_detected");
  }

  const { data: images } = await supabase
    .from("listing_images")
    .select("id")
    .eq("listing_id", listing.id)
    .limit(1);
  if (!images || images.length === 0) {
    reasons.push("no_photo");
  }

  if (!listing.description || listing.description.length < 50) {
    reasons.push("description_too_short");
  }

  if (listing.city && listing.price && listing.type) {
    const { data: priceIndex } = await supabase
      .from("price_index")
      .select("avg_price_m2_sale, avg_price_m2_rent")
      .eq("country_code", listing.country_code)
      .eq("city", listing.city)
      .eq("neighborhood", listing.neighborhood)
      .order("period", { ascending: false })
      .limit(1)
      .maybeSingle();

    const median =
      listing.type === "sale"
        ? priceIndex?.avg_price_m2_sale
        : priceIndex?.avg_price_m2_rent;

    if (median && listing.surface_m2 && listing.surface_m2 > 0) {
      const pricePerM2 = listing.price / listing.surface_m2;
      if (pricePerM2 < median * 0.3 || pricePerM2 > median * 3) {
        reasons.push("price_out_of_range");
      }
    }
  }

  if (reasons.length > 0) {
    return { result: "manual_review", reasons };
  }

  const { count } = await supabase
    .from("listings")
    .select("*", { count: "exact", head: true })
    .eq("owner_id", listing.owner_id)
    .in("status", ["active", "sold", "rented"]);

  if ((count ?? 0) >= 3) {
    return { result: "active", reasons: [] };
  }

  return { result: "pending", reasons: [] };
}
