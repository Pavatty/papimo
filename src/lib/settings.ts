import { unstable_cache } from "next/cache";

import { createAnonClient } from "@/data/supabase/server";

type SettingValue = string | number | boolean | object | null;

function normalizeToString(value: SettingValue): string {
  if (value === null) return "";
  if (typeof value === "string") return value;
  if (typeof value === "number" || typeof value === "boolean") {
    return String(value);
  }
  return JSON.stringify(value);
}

export const getAppSettings = unstable_cache(
  async (): Promise<Record<string, string>> => {
    const supabase = createAnonClient();
    const { data, error } = await supabase
      .from("app_settings")
      .select("key, value");

    if (error || !data) {
      console.error("[settings] failed to fetch:", error?.message);
      return {};
    }

    const result: Record<string, string> = {};
    for (const row of data) {
      result[row.key] = normalizeToString(row.value as SettingValue);
    }
    return result;
  },
  ["app-settings-all"],
  { revalidate: 60, tags: ["app_settings"] },
);

export const getAppSettingsByCategory = unstable_cache(
  async (
    category: string,
  ): Promise<
    Array<{
      key: string;
      value: string;
      description: string | null;
      category: string | null;
    }>
  > => {
    const supabase = createAnonClient();
    const { data, error } = await supabase
      .from("app_settings")
      .select("key, value, description, category")
      .eq("category", category)
      .order("key");

    if (error || !data) return [];

    return data.map((row) => ({
      key: row.key,
      value: normalizeToString(row.value as SettingValue),
      description: row.description,
      category: row.category,
    }));
  },
  ["app-settings-by-category"],
  { revalidate: 60, tags: ["app_settings"] },
);

export async function getSetting(key: string): Promise<string | null> {
  const settings = await getAppSettings();
  return settings[key] ?? null;
}

export async function getSettingNumber(
  key: string,
  fallback = 0,
): Promise<number> {
  const value = await getSetting(key);
  if (value === null || value === "") return fallback;
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : fallback;
}

export async function getSettingBoolean(
  key: string,
  fallback = false,
): Promise<boolean> {
  const value = await getSetting(key);
  if (value === null) return fallback;
  return value === "true" || value === "1";
}
