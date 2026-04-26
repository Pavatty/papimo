import { toggleFeatureFlagAction } from "@/app/[locale]/(admin)/admin/actions";
import { requireAdmin } from "@/lib/admin/guards";

type Props = { params: Promise<{ locale: string }> };

export default async function AdminFeatureFlagsPage({ params }: Props) {
  const { locale } = await params;
  const { supabase } = await requireAdmin(locale);
  const { data } = await supabase
    .from("settings")
    .select("value")
    .eq("key", "feature_flags")
    .maybeSingle();
  const flags = (data?.value as Record<string, boolean> | null) ?? {};
  const keys = Object.keys(flags).length
    ? Object.keys(flags)
    : ["messaging", "payments", "tools", "ads"];

  return (
    <div className="space-y-4">
      <h1 className="font-display text-ink text-2xl font-bold">
        Feature flags
      </h1>
      <div className="grid gap-3 md:grid-cols-2">
        {keys.map((key) => {
          const enabled = flags[key] ?? false;
          return (
            <form
              key={key}
              action={async () => {
                "use server";
                await toggleFeatureFlagAction(locale, key, !enabled);
              }}
              className="border-line flex items-center justify-between rounded-xl border bg-white p-4"
            >
              <div>
                <p className="text-ink font-medium">{key}</p>
                <p className="text-ink-soft text-xs">
                  Module {enabled ? "actif" : "inactif"}
                </p>
              </div>
              <button
                className={`rounded px-3 py-1 text-xs text-white ${enabled ? "bg-danger" : "bg-green"}`}
              >
                {enabled ? "Désactiver" : "Activer"}
              </button>
            </form>
          );
        })}
      </div>
    </div>
  );
}
