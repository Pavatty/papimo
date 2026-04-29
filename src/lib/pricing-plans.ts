import { unstable_cache } from "next/cache";

import { createAnonClient } from "@/data/supabase/server";

export type PricingPlanSegment = "pap" | "agency" | "developer" | "host";

export type PricingPlan = {
  id: string;
  code: string;
  segment: PricingPlanSegment;
  name: string;
  description: string | null;
  price_monthly: number | null;
  price_yearly: number | null;
  currency: string;
  billing_interval: "monthly" | "yearly" | "one_time" | "commission";
  listings_limit: number | null;
  features: Record<string, unknown>;
  is_active: boolean;
  is_visible_during_beta: boolean;
  display_order: number;
};

export const getPricingPlansForSegment = unstable_cache(
  async (segment: PricingPlanSegment): Promise<PricingPlan[]> => {
    const supabase = createAnonClient();
    const { data, error } = await supabase.rpc(
      "get_pricing_plans_for_segment",
      {
        p_segment: segment,
      },
    );
    if (error || !data) return [];
    return data as unknown as PricingPlan[];
  },
  ["pricing-plans-by-segment"],
  { revalidate: 60, tags: ["pricing_plans"] },
);

export const getAllActivePricingPlans = unstable_cache(
  async (): Promise<PricingPlan[]> => {
    const supabase = createAnonClient();
    const { data, error } = await supabase
      .from("pricing_plans")
      .select("*")
      .eq("is_active", true)
      .order("display_order", { ascending: true });
    if (error || !data) return [];
    return data as unknown as PricingPlan[];
  },
  ["pricing-plans-all"],
  { revalidate: 60, tags: ["pricing_plans"] },
);
