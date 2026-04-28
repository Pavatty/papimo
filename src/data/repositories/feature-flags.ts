import { unstable_cache } from "next/cache";

import { createAnonClient } from "@/data/supabase/server";

export const getFeatureFlags = unstable_cache(
  async (): Promise<Record<string, boolean>> => {
    const supabase = createAnonClient();
    const { data } = await supabase
      .from("feature_flags")
      .select("key, enabled");
    const map: Record<string, boolean> = {};
    for (const row of data ?? []) map[row.key] = row.enabled;
    return map;
  },
  ["feature-flags"],
  { revalidate: 60, tags: ["feature-flags"] },
);

export async function isFlagEnabled(key: string): Promise<boolean> {
  const flags = await getFeatureFlags();
  return flags[key] ?? false;
}

export async function getFeatureFlag(key: string): Promise<boolean> {
  return isFlagEnabled(key);
}
