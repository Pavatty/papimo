import { unstable_cache } from "next/cache";

import { createAnonClient } from "@/data/supabase/server";
import type { Database } from "@/types/database";

export type PricingPackRow =
  Database["public"]["Tables"]["pricing_packs"]["Row"];

export const getPricingPacks = unstable_cache(
  async (): Promise<PricingPackRow[]> => {
    const supabase = createAnonClient();
    const { data } = await supabase
      .from("pricing_packs")
      .select("*")
      .eq("is_active", true)
      .order("sort_order", { ascending: true });
    return data ?? [];
  },
  ["pricing-packs"],
  { revalidate: 3600, tags: ["pricing-packs"] },
);
