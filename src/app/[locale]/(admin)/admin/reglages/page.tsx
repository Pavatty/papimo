import { updateSettingAction } from "@/app/[locale]/(admin)/admin/actions";
import { requireAdmin } from "@/lib/admin/guards";

type Props = { params: Promise<{ locale: string }> };

export default async function AdminSettingsPage({ params }: Props) {
  const { locale } = await params;
  const { supabase } = await requireAdmin(locale);
  const { data: settings } = await supabase
    .from("settings")
    .select("key,value,description,updated_at")
    .order("key", { ascending: true })
    .limit(200);

  return (
    <div className="space-y-4">
      <h1 className="font-display text-encre text-2xl font-bold">Réglages</h1>
      <p className="text-encre/70 text-sm">
        Modifiez les valeurs JSON des clés critiques (`feature_flags`,
        `blacklist_keywords`, `pricing_packs`, etc.)
      </p>
      <div className="space-y-3">
        {(settings ?? []).map((setting) => (
          <form
            key={setting.key}
            action={async (formData) => {
              "use server";
              const raw = String(formData.get("value") ?? "");
              await updateSettingAction(locale, setting.key, raw);
            }}
            className="border-bordurewarm-tertiary rounded-xl border bg-white p-4"
          >
            <div className="mb-2 flex items-center justify-between">
              <p className="text-encre font-medium">{setting.key}</p>
              <button className="bg-bleu rounded px-3 py-1 text-xs text-white">
                Enregistrer
              </button>
            </div>
            <textarea
              name="value"
              defaultValue={JSON.stringify(setting.value, null, 2)}
              className="border-bordurewarm-tertiary min-h-32 w-full rounded border p-2 font-mono text-xs"
            />
          </form>
        ))}
      </div>
    </div>
  );
}
