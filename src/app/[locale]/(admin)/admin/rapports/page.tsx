import {
  approveModerationItemAction,
  rejectModerationItemAction,
} from "@/app/[locale]/(admin)/admin/actions";
import { requireAdmin } from "@/lib/admin/guards";

type Props = { params: Promise<{ locale: string }> };

export default async function AdminReportsPage({ params }: Props) {
  const { locale } = await params;
  const { supabase } = await requireAdmin(locale);
  const { data: reports } = await supabase
    .from("reports")
    .select("id,reason,status,details,created_at,listing_id")
    .order("created_at", { ascending: false })
    .limit(200);

  return (
    <div className="space-y-4">
      <h1 className="font-display text-ink text-2xl font-bold">Rapports</h1>
      <div className="space-y-2">
        {(reports ?? []).map((r) => (
          <article
            key={r.id}
            className="border-line rounded-xl border bg-white p-4"
          >
            <div className="flex items-start justify-between">
              <div>
                <p className="text-ink font-medium">{r.reason}</p>
                <p className="text-ink-soft text-xs">
                  {r.status} • {new Date(r.created_at).toLocaleString("fr-FR")}
                </p>
                <p className="text-ink-soft mt-1 text-sm">{r.details ?? "-"}</p>
              </div>
              <div className="flex gap-2 text-xs">
                <form
                  action={async () => {
                    "use server";
                    await approveModerationItemAction(locale, "report", r.id);
                  }}
                >
                  <button className="bg-green/15 text-green rounded px-2 py-1">
                    Résoudre
                  </button>
                </form>
                <form
                  action={async () => {
                    "use server";
                    await rejectModerationItemAction(
                      locale,
                      "report",
                      r.id,
                      "Report rejeté par admin",
                    );
                  }}
                >
                  <button className="bg-danger/15 text-danger rounded px-2 py-1">
                    Rejeter
                  </button>
                </form>
              </div>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
