import { unstable_cache } from "next/cache";

import { createClient } from "@/data/supabase/server";
import type { Database } from "@/types/database";

type TransactionType = Database["public"]["Tables"]["transaction_types"]["Row"];
type PropertyType = Database["public"]["Tables"]["property_types"]["Row"];
type Amenity = Database["public"]["Tables"]["amenities"]["Row"];

export const getTransactionTypes = unstable_cache(
  async (): Promise<TransactionType[]> => {
    const supabase = await createClient();
    const { data } = await supabase
      .from("transaction_types")
      .select("*")
      .eq("is_active", true)
      .order("sort_order", { ascending: true });
    return data ?? [];
  },
  ["transaction-types"],
  { revalidate: 3600, tags: ["taxonomies", "transaction-types"] },
);

export const getPropertyTypes = unstable_cache(
  async (): Promise<PropertyType[]> => {
    const supabase = await createClient();
    const { data } = await supabase
      .from("property_types")
      .select("*")
      .eq("is_active", true)
      .order("sort_order", { ascending: true });
    return data ?? [];
  },
  ["property-types"],
  { revalidate: 3600, tags: ["taxonomies", "property-types"] },
);

export const getAmenities = unstable_cache(
  async (): Promise<Amenity[]> => {
    const supabase = await createClient();
    const { data } = await supabase
      .from("amenities")
      .select("*")
      .eq("is_active", true)
      .order("category", { ascending: true })
      .order("sort_order", { ascending: true });
    return data ?? [];
  },
  ["amenities"],
  { revalidate: 3600, tags: ["taxonomies", "amenities"] },
);

export type LocaleKey = "fr" | "ar" | "en";

export function getTaxonomyLabel<
  T extends { label_fr: string; label_ar: string; label_en: string },
>(item: T, locale: LocaleKey): string {
  switch (locale) {
    case "ar":
      return item.label_ar;
    case "en":
      return item.label_en;
    default:
      return item.label_fr;
  }
}

export async function getTransactionBadge(
  code: string | null | undefined,
  locale: LocaleKey = "fr",
): Promise<string | null> {
  if (!code) return null;
  const types = await getTransactionTypes();
  const item = types.find((t) => t.code === code);
  if (!item) return code;
  return getTaxonomyLabel(item, locale);
}
