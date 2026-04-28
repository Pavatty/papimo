import { unstable_cache } from "next/cache";
import { NextResponse } from "next/server";

import { createAnonClient } from "@/data/supabase/server";

export const revalidate = 3600;

const getRegionsForCountry = unstable_cache(
  async (countryCode: string) => {
    const supabase = createAnonClient();
    const { data: country } = await supabase
      .from("geo_countries")
      .select("id")
      .eq("code", countryCode.toUpperCase())
      .maybeSingle();
    if (!country) return [];
    const { data } = await supabase
      .from("geo_regions")
      .select("code, label_fr, label_ar, label_en, sort_order")
      .eq("country_id", country.id)
      .eq("is_active", true)
      .order("sort_order", { ascending: true });
    return data ?? [];
  },
  ["geo-regions-by-country"],
  { tags: ["geo", "geo-regions"], revalidate: 3600 },
);

export async function GET(request: Request) {
  const url = new URL(request.url);
  const country = url.searchParams.get("country");
  if (!country) return NextResponse.json({ regions: [] });
  const regions = await getRegionsForCountry(country);
  return NextResponse.json({ regions });
}
