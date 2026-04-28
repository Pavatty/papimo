import { requireAdmin } from "@/lib/admin/guards";

import { FeatureFlagsClient } from "./FeatureFlagsClient";

type Props = { params: Promise<{ locale: string }> };

export default async function AdminFeatureFlagsPage({ params }: Props) {
  const { locale } = await params;
  const { supabase } = await requireAdmin(locale);
  const { data } = await supabase
    .from("feature_flags")
    .select("key, enabled, description, rollout_pct, updated_at")
    .order("key", { ascending: true });

  return (
    <div className="space-y-4">
      <div>
        <h1 className="font-display text-ink text-2xl font-bold">
          Feature Flags
        </h1>
        <p className="text-ink-soft mt-1 text-sm">
          Activez ou désactivez les fonctionnalités sans redéployer.
        </p>
      </div>
      <FeatureFlagsClient initialFlags={data ?? []} locale={locale} />
    </div>
  );
}
