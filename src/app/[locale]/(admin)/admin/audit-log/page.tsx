import { requireAdmin } from "@/lib/admin/guards";

type Props = {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ action?: string; target_type?: string }>;
};

export default async function AdminAuditLogPage({
  params,
  searchParams,
}: Props) {
  const [{ locale }, query] = await Promise.all([params, searchParams]);
  const { supabase } = await requireAdmin(locale);
  let req = supabase
    .from("audit_log")
    .select("id,action,target_type,target_id,admin_id,created_at")
    .order("created_at", { ascending: false })
    .limit(500);
  if (query.action) req = req.ilike("action", `%${query.action}%`);
  if (query.target_type) req = req.eq("target_type", query.target_type);
  const { data: rows } = await req;

  return (
    <div className="space-y-4">
      <h1 className="font-display text-ink text-2xl font-bold">Audit log</h1>
      <form className="border-line grid gap-2 rounded-xl border bg-white p-4 md:grid-cols-3">
        <input
          name="action"
          defaultValue={query.action}
          placeholder="Filtre action"
          className="border-line rounded border px-2 py-1.5 text-sm"
        />
        <input
          name="target_type"
          defaultValue={query.target_type}
          placeholder="Filtre target_type"
          className="border-line rounded border px-2 py-1.5 text-sm"
        />
        <button className="bg-corail rounded px-3 py-1.5 text-sm text-white">
          Filtrer
        </button>
      </form>
      <div className="border-line overflow-auto rounded-xl border bg-white">
        <table className="w-full min-w-[980px] text-sm">
          <thead className="bg-creme-pale text-ink-soft text-xs">
            <tr>
              <th className="px-3 py-2 text-left">Date</th>
              <th className="px-3 py-2 text-left">Action</th>
              <th className="px-3 py-2 text-left">Type</th>
              <th className="px-3 py-2 text-left">Target</th>
              <th className="px-3 py-2 text-left">Admin</th>
            </tr>
          </thead>
          <tbody>
            {(rows ?? []).map((row) => (
              <tr key={row.id} className="border-line border-t">
                <td className="px-3 py-2">
                  {new Date(row.created_at).toLocaleString("fr-FR")}
                </td>
                <td className="px-3 py-2">{row.action}</td>
                <td className="px-3 py-2">{row.target_type ?? "-"}</td>
                <td className="text-ink-soft px-3 py-2 text-xs">
                  {row.target_id ?? "-"}
                </td>
                <td className="text-ink-soft px-3 py-2 text-xs">
                  {row.admin_id ?? "-"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
