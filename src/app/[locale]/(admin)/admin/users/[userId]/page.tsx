import { requireAdmin } from "@/lib/admin/guards";

type Props = {
  params: Promise<{ locale: string; userId: string }>;
};

export default async function AdminUserDetailPage({ params }: Props) {
  const { locale, userId } = await params;
  const { supabase } = await requireAdmin(locale);

  const [
    { data: profile },
    { data: listings },
    { data: txs },
    { data: flaggedMessages },
    { data: audit },
  ] = await Promise.all([
    supabase.from("profiles").select("*").eq("id", userId).single(),
    supabase
      .from("listings")
      .select("id,title,status,created_at")
      .eq("owner_id", userId)
      .order("created_at", { ascending: false })
      .limit(10),
    supabase
      .from("transactions")
      .select("id,amount,currency,status,created_at")
      .eq("user_id", userId)
      .order("created_at", { ascending: false })
      .limit(10),
    supabase
      .from("messages")
      .select("id,content,created_at,flag_reason")
      .eq("sender_id", userId)
      .eq("flagged", true)
      .order("created_at", { ascending: false })
      .limit(10),
    supabase
      .from("audit_log")
      .select("id,action,target_type,target_id,created_at")
      .eq("target_id", userId)
      .order("created_at", { ascending: false })
      .limit(20),
  ]);

  return (
    <div className="space-y-4">
      <h1 className="font-display text-encre text-2xl font-bold">
        Détail utilisateur
      </h1>
      <section className="border-bordurewarm-tertiary rounded-2xl border bg-white p-5">
        <h2 className="text-encre text-lg font-semibold">Profil</h2>
        <p className="text-encre/70 text-sm">
          {profile?.full_name} • {profile?.email} • role {profile?.role}
        </p>
      </section>
      <section className="grid gap-4 lg:grid-cols-2">
        <article className="border-bordurewarm-tertiary rounded-2xl border bg-white p-5">
          <h3 className="text-encre mb-2 text-sm font-semibold">Annonces</h3>
          <ul className="space-y-1 text-sm">
            {(listings ?? []).map((l) => (
              <li key={l.id} className="flex justify-between">
                <span>{l.title}</span>
                <span className="text-encre/70">{l.status}</span>
              </li>
            ))}
          </ul>
        </article>
        <article className="border-bordurewarm-tertiary rounded-2xl border bg-white p-5">
          <h3 className="text-encre mb-2 text-sm font-semibold">
            Transactions
          </h3>
          <ul className="space-y-1 text-sm">
            {(txs ?? []).map((t) => (
              <li key={t.id} className="flex justify-between">
                <span>
                  {t.amount} {t.currency}
                </span>
                <span className="text-encre/70">{t.status}</span>
              </li>
            ))}
          </ul>
        </article>
      </section>
      <section className="grid gap-4 lg:grid-cols-2">
        <article className="border-bordurewarm-tertiary rounded-2xl border bg-white p-5">
          <h3 className="text-encre mb-2 text-sm font-semibold">
            Messages flaggés
          </h3>
          <ul className="space-y-1 text-sm">
            {(flaggedMessages ?? []).map((m) => (
              <li key={m.id}>
                <p className="line-clamp-2">{m.content}</p>
                <p className="text-encre/70 text-xs">{m.flag_reason ?? "-"}</p>
              </li>
            ))}
          </ul>
        </article>
        <article className="border-bordurewarm-tertiary rounded-2xl border bg-white p-5">
          <h3 className="text-encre mb-2 text-sm font-semibold">Audit log</h3>
          <ul className="space-y-1 text-sm">
            {(audit ?? []).map((a) => (
              <li key={a.id} className="flex justify-between">
                <span>{a.action}</span>
                <span className="text-encre/70 text-xs">
                  {new Date(a.created_at).toLocaleString("fr-FR")}
                </span>
              </li>
            ))}
          </ul>
        </article>
      </section>
    </div>
  );
}
