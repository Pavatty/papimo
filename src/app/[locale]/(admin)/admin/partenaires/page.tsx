import { logAuditEvent } from "@/lib/audit/log";
import { requireAdmin } from "@/lib/admin/guards";
import type { Enums } from "@/types/database";

type Props = { params: Promise<{ locale: string }> };

export default async function AdminPartnersPage({ params }: Props) {
  const { locale } = await params;
  const { supabase } = await requireAdmin(locale);
  const { data: partners } = await supabase
    .from("partners")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(200);

  return (
    <div className="space-y-4">
      <h1 className="font-display text-encre dark:text-creme text-2xl font-bold">
        Partenaires
      </h1>
      <form
        action={async (formData) => {
          "use server";
          const { supabase } = await requireAdmin(locale);
          const name = String(formData.get("name") ?? "");
          const type = String(
            formData.get("type") ?? "bank",
          ) as Enums<"partner_type">;
          if (!name) return;
          await supabase.from("partners").insert({ name, type });
          await logAuditEvent({
            action: "admin_create_partner",
            targetType: "partner",
            afterData: { name, type },
          });
        }}
        className="border-bordurewarm-tertiary dark:border-encre/20 flex flex-wrap gap-2 rounded-xl border bg-white p-4"
      >
        <input
          name="name"
          placeholder="Nom partenaire"
          className="border-bordurewarm-tertiary dark:border-encre/20 rounded border px-2 py-1.5 text-sm"
        />
        <input
          name="type"
          placeholder="bank/notary/..."
          className="border-bordurewarm-tertiary dark:border-encre/20 rounded border px-2 py-1.5 text-sm"
        />
        <button className="bg-corail rounded px-3 py-1.5 text-sm text-white">
          Créer
        </button>
      </form>
      <div className="border-bordurewarm-tertiary dark:border-encre/20 overflow-auto rounded-xl border bg-white">
        <table className="w-full min-w-[900px] text-sm">
          <thead className="bg-creme-pale dark:bg-encre/60 text-encre/70 dark:text-creme/70 text-xs">
            <tr>
              <th className="px-3 py-2 text-left">Nom</th>
              <th className="px-3 py-2 text-left">Type</th>
              <th className="px-3 py-2 text-left">Leads</th>
              <th className="px-3 py-2 text-left">Balance</th>
              <th className="px-3 py-2 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {(partners ?? []).map((p) => (
              <tr
                key={p.id}
                className="border-bordurewarm-tertiary dark:border-encre/20 border-t"
              >
                <td className="px-3 py-2">{p.name}</td>
                <td className="px-3 py-2">{p.type}</td>
                <td className="px-3 py-2">{p.leads_count}</td>
                <td className="px-3 py-2">{p.balance}</td>
                <td className="px-3 py-2">
                  <form
                    action={async () => {
                      "use server";
                      const { supabase } = await requireAdmin(locale);
                      await supabase.from("partners").delete().eq("id", p.id);
                      await logAuditEvent({
                        action: "admin_delete_partner",
                        targetType: "partner",
                        targetId: p.id,
                      });
                    }}
                  >
                    <button className="rounded bg-red-600/15 px-2 py-1 text-xs text-red-600">
                      Supprimer
                    </button>
                  </form>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
