import { unstable_cache } from "next/cache";

import { createAnonClient } from "@/data/supabase/server";

export interface CmsHomeSection {
  id: string;
  section_key: string;
  section_type: string;
  sort_order: number;
  active: boolean;
  content_json: Record<string, unknown>;
}

// La table cms_home_sections n'est pas encore dans les types Supabase
// auto-générés (npm run db:types nécessite SUPABASE_ACCESS_TOKEN).
// On contourne via un cast minimal côté .from() pour ne pas perdre le
// reste du type-safety du client.
type SupabaseClientWithCms = {
  from: (table: "cms_home_sections") => {
    select: (cols: string) => {
      eq: (
        col: string,
        value: unknown,
      ) => {
        order: (
          col: string,
          opts: { ascending: boolean },
        ) => Promise<{
          data: CmsHomeSection[] | null;
          error: unknown;
        }>;
        maybeSingle: () => Promise<{
          data: CmsHomeSection | null;
          error: unknown;
        }>;
      };
    };
  };
};

export const getActiveHomeSections = unstable_cache(
  async (): Promise<CmsHomeSection[]> => {
    const supabase = createAnonClient() as unknown as SupabaseClientWithCms;
    const { data } = await supabase
      .from("cms_home_sections")
      .select("id, section_key, section_type, sort_order, active, content_json")
      .eq("active", true)
      .order("sort_order", { ascending: true });
    return data ?? [];
  },
  ["cms-home-sections"],
  { tags: ["cms_home"], revalidate: 3600 },
);

export const getHomeSectionByKey = unstable_cache(
  async (key: string): Promise<CmsHomeSection | null> => {
    const supabase = createAnonClient() as unknown as SupabaseClientWithCms;
    const { data } = await supabase
      .from("cms_home_sections")
      .select("id, section_key, section_type, sort_order, active, content_json")
      .eq("section_key", key)
      .maybeSingle();
    return data ?? null;
  },
  ["cms-home-section-by-key"],
  { tags: ["cms_home"], revalidate: 3600 },
);
