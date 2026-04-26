import {
  approveModerationItemAction,
  rejectModerationItemAction,
} from "@/app/[locale]/(admin)/admin/actions";
import { requireAdmin } from "@/lib/admin/guards";

type Props = {
  params: Promise<{ locale: string }>;
};

export default async function AdminModerationPage({ params }: Props) {
  const { locale } = await params;
  const { supabase } = await requireAdmin(locale);

  const [pendingListings, flaggedMessages, openReports] = await Promise.all([
    supabase
      .from("listings")
      .select("id,title,city,created_at")
      .eq("status", "pending")
      .order("created_at", { ascending: false })
      .limit(50),
    supabase
      .from("messages")
      .select("id,content,flag_reason,created_at")
      .eq("flagged", true)
      .order("created_at", { ascending: false })
      .limit(50),
    supabase
      .from("reports")
      .select("id,reason,details,status,created_at")
      .in("status", ["open", "reviewing"])
      .order("created_at", { ascending: false })
      .limit(50),
  ]);

  return (
    <div className="space-y-6">
      <h1 className="font-display text-ink text-2xl font-bold">
        File de modération
      </h1>

      <section className="border-line rounded-xl border bg-white p-4">
        <h2 className="text-ink mb-3 text-lg font-semibold">
          Annonces pending
        </h2>
        <div className="space-y-2">
          {(pendingListings.data ?? []).map((item) => (
            <div
              key={item.id}
              className="border-line flex items-start justify-between rounded-lg border p-3"
            >
              <div>
                <p className="text-ink font-medium">{item.title}</p>
                <p className="text-ink-soft text-xs">{item.city}</p>
              </div>
              <div className="flex gap-2 text-xs">
                <form
                  action={async () => {
                    "use server";
                    await approveModerationItemAction(
                      locale,
                      "listing",
                      item.id,
                    );
                  }}
                >
                  <button className="bg-green/15 text-green rounded px-2 py-1">
                    Approve
                  </button>
                </form>
                <form
                  action={async () => {
                    "use server";
                    await rejectModerationItemAction(
                      locale,
                      "listing",
                      item.id,
                      "Rejet modération",
                    );
                  }}
                >
                  <button className="bg-danger/15 text-danger rounded px-2 py-1">
                    Reject
                  </button>
                </form>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="border-line rounded-xl border bg-white p-4">
        <h2 className="text-ink mb-3 text-lg font-semibold">
          Messages flaggés
        </h2>
        <div className="space-y-2">
          {(flaggedMessages.data ?? []).map((item) => (
            <div
              key={item.id}
              className="border-line flex items-start justify-between rounded-lg border p-3"
            >
              <div>
                <p className="text-ink line-clamp-2 text-sm">{item.content}</p>
                <p className="text-ink-soft text-xs">
                  {item.flag_reason ?? "-"}
                </p>
              </div>
              <div className="flex gap-2 text-xs">
                <form
                  action={async () => {
                    "use server";
                    await approveModerationItemAction(
                      locale,
                      "message",
                      item.id,
                    );
                  }}
                >
                  <button className="bg-green/15 text-green rounded px-2 py-1">
                    Approve
                  </button>
                </form>
                <form
                  action={async () => {
                    "use server";
                    await rejectModerationItemAction(
                      locale,
                      "message",
                      item.id,
                      "Message suspect confirmé",
                    );
                  }}
                >
                  <button className="bg-danger/15 text-danger rounded px-2 py-1">
                    Reject
                  </button>
                </form>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="border-line rounded-xl border bg-white p-4">
        <h2 className="text-ink mb-3 text-lg font-semibold">
          Reports utilisateurs
        </h2>
        <div className="space-y-2">
          {(openReports.data ?? []).map((item) => (
            <div
              key={item.id}
              className="border-line flex items-start justify-between rounded-lg border p-3"
            >
              <div>
                <p className="text-ink text-sm">Raison: {item.reason}</p>
                <p className="text-ink-soft text-xs">{item.details ?? "-"}</p>
              </div>
              <div className="flex gap-2 text-xs">
                <form
                  action={async () => {
                    "use server";
                    await approveModerationItemAction(
                      locale,
                      "report",
                      item.id,
                    );
                  }}
                >
                  <button className="bg-green/15 text-green rounded px-2 py-1">
                    Approve
                  </button>
                </form>
                <form
                  action={async () => {
                    "use server";
                    await rejectModerationItemAction(
                      locale,
                      "report",
                      item.id,
                      "Signalement rejeté",
                    );
                  }}
                >
                  <button className="bg-danger/15 text-danger rounded px-2 py-1">
                    Reject
                  </button>
                </form>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
