import { notFound } from "next/navigation";

import { requireAdmin } from "@/lib/admin/guards";

import { TaxonomyCrudClient, type TaxonomyKind } from "./TaxonomyCrudClient";

type Props = { params: Promise<{ locale: string; type: string }> };

const VALID_TYPES = [
  "transaction-types",
  "property-types",
  "amenities",
] as const;
type TaxRoute = (typeof VALID_TYPES)[number];

const TITLES: Record<TaxRoute, string> = {
  "transaction-types": "Types de transaction",
  "property-types": "Types de bien",
  amenities: "Équipements",
};

const ROUTE_TO_KIND: Record<TaxRoute, TaxonomyKind> = {
  "transaction-types": "transaction_types",
  "property-types": "property_types",
  amenities: "amenities",
};

function isValidRoute(t: string): t is TaxRoute {
  return (VALID_TYPES as readonly string[]).includes(t);
}

export default async function TaxonomyPage({ params }: Props) {
  const { locale, type } = await params;
  if (!isValidRoute(type)) notFound();
  const { supabase } = await requireAdmin(locale);

  const kind = ROUTE_TO_KIND[type];

  const rows =
    kind === "transaction_types"
      ? ((
          await supabase
            .from("transaction_types")
            .select(
              "id, code, label_fr, label_ar, label_en, sort_order, is_active",
            )
            .order("sort_order", { ascending: true })
        ).data ?? [])
      : kind === "property_types"
        ? ((
            await supabase
              .from("property_types")
              .select(
                "id, code, label_fr, label_ar, label_en, sort_order, is_active, category",
              )
              .order("sort_order", { ascending: true })
          ).data ?? [])
        : ((
            await supabase
              .from("amenities")
              .select(
                "id, code, label_fr, label_ar, label_en, sort_order, is_active, category",
              )
              .order("sort_order", { ascending: true })
          ).data ?? []);

  return (
    <div className="space-y-4">
      <div>
        <h1 className="font-display text-encre text-2xl font-bold">
          {TITLES[type]}
        </h1>
        <p className="text-encre/70 mt-1 text-sm">
          Modifications visibles immédiatement sur le site (cache invalidé).
        </p>
      </div>
      <TaxonomyCrudClient kind={kind} rows={rows} locale={locale} />
    </div>
  );
}
