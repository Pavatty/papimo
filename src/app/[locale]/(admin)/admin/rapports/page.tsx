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
      <h1 className="font-display text-encre dark:text-creme text-2xl font-bold">
        Rapports
      </h1>
      <div className="space-y-2">
        {(reports ?? []).map((r) => (
          <article
            key={r.id}
            className="border-bordurewarm-tertiary dark:border-encre/20 rounded-xl border bg-white p-4"
          >
            <div className="flex items-start justify-between">
              <div>
                <p className="text-encre dark:text-creme font-medium">
                  {r.reason}
                </p>
                <p className="text-encre/70 dark:text-creme/70 text-xs">
                  {r.status} • {new Date(r.created_at).toLocaleString("fr-FR")}
                </p>
                <p className="text-encre/70 dark:text-creme/70 mt-1 text-sm">
                  {r.details ?? "-"}
                </p>
              </div>
              <div className="flex gap-2 text-xs">
                <form
                  action={async () => {
                    "use server";
                    await approveModerationItemAction(locale, "report", r.id);
                  }}
                >
                  <button className="rounded bg-emerald-600/15 px-2 py-1 text-emerald-600">
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
                  <button className="rounded bg-red-600/15 px-2 py-1 text-red-600">
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
