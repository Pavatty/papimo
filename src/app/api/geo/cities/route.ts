import { unstable_cache } from "next/cache";
import { NextResponse } from "next/server";

import { createAnonClient } from "@/data/supabase/server";

export const revalidate = 3600;

const getCitiesForRegion = unstable_cache(
  async (countryCode: string, regionCode: string) => {
    const supabase = createAnonClient();
    const { data: country } = await supabase
      .from("geo_countries")
      .select("id")
      .eq("code", countryCode.toUpperCase())
      .maybeSingle();
    if (!country) return [];
    const { data: region } = await supabase
      .from("geo_regions")
      .select("id")
      .eq("country_id", country.id)
      .eq("code", regionCode)
      .maybeSingle();
    if (!region) return [];
    const { data } = await supabase
      .from("geo_cities")
      .select("code, label_fr, label_ar, label_en, sort_order")
      .eq("region_id", region.id)
      .eq("is_active", true)
      .order("sort_order", { ascending: true });
    return data ?? [];
  },
  ["geo-cities-by-region"],
  { tags: ["geo", "geo-cities"], revalidate: 3600 },
);

export async function GET(request: Request) {
  const url = new URL(request.url);
  const country = url.searchParams.get("country");
  const region = url.searchParams.get("region");
  if (!country || !region) {
    return NextResponse.json({ cities: [] });
  }
  const cities = await getCitiesForRegion(country, region);
  return NextResponse.json({ cities });
}
