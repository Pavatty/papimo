import { logAuditEvent } from "@/lib/audit/log";
import { requireAdmin } from "@/lib/admin/guards";

type Props = { params: Promise<{ locale: string }> };

export default async function AdminLeadsPage({ params }: Props) {
  const { locale } = await params;
  const { supabase } = await requireAdmin(locale);
  const { data: leads } = await supabase
    .from("leads")
    .select("id,type,status,price,partner_id,created_at")
    .order("created_at", { ascending: false })
    .limit(200);

  return (
    <div className="space-y-4">
      <h1 className="font-display text-ink text-2xl font-bold">Leads</h1>
      <div className="border-line overflow-auto rounded-xl border bg-white">
        <table className="w-full min-w-[850px] text-sm">
          <thead className="bg-creme-pale text-ink-soft text-xs">
            <tr>
              <th className="px-3 py-2 text-left">ID</th>
              <th className="px-3 py-2 text-left">Type</th>
              <th className="px-3 py-2 text-left">Status</th>
              <th className="px-3 py-2 text-left">Prix</th>
              <th className="px-3 py-2 text-left">Action</th>
            </tr>
          </thead>
          <tbody>
            {(leads ?? []).map((lead) => (
              <tr key={lead.id} className="border-line border-t">
                <td className="text-ink-soft px-3 py-2 text-xs">{lead.id}</td>
                <td className="px-3 py-2">{lead.type}</td>
                <td className="px-3 py-2">{lead.status}</td>
                <td className="px-3 py-2">{lead.price ?? "-"}</td>
                <td className="px-3 py-2">
                  <form
                    action={async () => {
                      "use server";
                      const { supabase } = await requireAdmin(locale);
                      await supabase
                        .from("leads")
                        .update({ status: "converted" })
                        .eq("id", lead.id);
                      await logAuditEvent({
                        action: "admin_convert_lead",
                        targetType: "lead",
                        targetId: lead.id,
                      });
                    }}
                  >
                    <button className="bg-green/15 text-green rounded px-2 py-1 text-xs">
                      Marquer converti
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
