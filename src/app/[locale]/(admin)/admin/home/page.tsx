import { requireAdmin } from "@/lib/admin/guards";

import { HomeSectionsClient } from "./HomeSectionsClient";

type Props = { params: Promise<{ locale: string }> };

type SupabaseCmsRead = {
  from: (table: "cms_home_sections") => {
    select: (cols: string) => {
      order: (
        col: string,
        opts: { ascending: boolean },
      ) => Promise<{
        data: Array<{
          id: string;
          section_key: string;
          section_type: string;
          sort_order: number;
          active: boolean;
          content_json: Record<string, unknown>;
        }> | null;
      }>;
    };
  };
};

export default async function AdminHomePage({ params }: Props) {
  const { locale } = await params;
  const { supabase } = await requireAdmin(locale);
  const cms = supabase as unknown as SupabaseCmsRead;
  const { data } = await cms
    .from("cms_home_sections")
    .select("id, section_key, section_type, sort_order, active, content_json")
    .order("sort_order", { ascending: true });

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-encre dark:text-creme font-display text-2xl font-bold">
          Pages d&apos;accueil
        </h1>
        <p className="text-encre/70 dark:text-creme/70 mt-1 text-sm">
          Édition CMS du contenu de la home : Hero, Trust signals, filtres
          rapides, Pourquoi LODGE, etc. Modifications visibles immédiatement sur
          le site (cache invalidé via revalidateTag).
        </p>
      </div>
      <HomeSectionsClient initialSections={data ?? []} locale={locale} />
    </div>
  );
}
