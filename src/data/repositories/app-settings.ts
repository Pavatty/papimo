import { unstable_cache } from "next/cache";

import { createAnonClient } from "@/data/supabase/server";

const fetchAppSetting = unstable_cache(
  async (key: string): Promise<unknown | null> => {
    const supabase = createAnonClient();
    const { data } = await supabase
      .from("app_settings")
      .select("value")
      .eq("key", key)
      .maybeSingle();
    return data?.value ?? null;
  },
  ["app-setting"],
  { revalidate: 300, tags: ["app-settings"] },
);

export async function getAppSetting<T = unknown>(
  key: string,
): Promise<T | null> {
  return (await fetchAppSetting(key)) as T | null;
}

export interface BrandSettings {
  name: string;
  tagline_fr: string;
  tagline_ar: string;
  tagline_en: string;
  logo_part1: string;
  logo_part2: string;
  contact_email: string;
}

export async function getBrandSettings(): Promise<BrandSettings | null> {
  return getAppSetting<BrandSettings>("brand");
}
