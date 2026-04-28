import { getAdminStats } from "@/lib/admin/data";

type Props = {
  params: Promise<{ locale: string }>;
};

export default async function AdminPage({ params }: Props) {
  const { locale } = await params;
  const stats = await getAdminStats(locale);
  const topCities =
    (stats.top_10_cities as Array<{ city: string; count: number }>) ?? [];
  const trend = (stats.trend as Array<{ label: string; value: number }>) ?? [];

  return (
    <div className="space-y-6">
      <section className="grid gap-3 md:grid-cols-2 xl:grid-cols-6">
        {[
          ["Annonces totales", stats.listings_total],
          ["Annonces actives", stats.listings_active],
          ["En attente", stats.listings_pending],
          ["Nouveaux users 7j", stats.new_users_7d],
          ["Tx 30j (nb)", stats.transactions_30d_count],
          ["Tx 30j (montant)", `${stats.transactions_30d_amount} TND`],
        ].map(([label, value]) => (
          <article
            key={String(label)}
            className="border-bordurewarm-tertiary rounded-xl border bg-white p-4"
          >
            <p className="text-encre/70 text-xs">{label}</p>
            <p className="text-encre mt-1 text-xl font-semibold">
              {String(value)}
            </p>
          </article>
        ))}
      </section>

      <section className="grid gap-4 lg:grid-cols-2">
        <article className="border-bordurewarm-tertiary rounded-2xl border bg-white p-5">
          <h2 className="text-encre text-lg font-semibold">Top 10 villes</h2>
          <ul className="mt-3 space-y-2 text-sm">
            {topCities.map((row) => (
              <li key={row.city} className="flex items-center justify-between">
                <span className="text-encre/70">{row.city}</span>
                <span className="text-encre font-medium">{row.count}</span>
              </li>
            ))}
          </ul>
        </article>
        <article className="border-bordurewarm-tertiary rounded-2xl border bg-white p-5">
          <h2 className="text-encre text-lg font-semibold">Évolution</h2>
          <div className="mt-4 space-y-2">
            {trend.map((point) => (
              <div key={point.label}>
                <div className="text-encre/70 mb-1 flex justify-between text-xs">
                  <span>{point.label}</span>
                  <span>{point.value}</span>
                </div>
                <div className="bg-bleu-soft h-2 rounded">
                  <div
                    className="bg-bleu h-2 rounded"
                    style={{ width: `${Math.min(100, point.value)}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </article>
      </section>

      <article className="border-bordurewarm-tertiary rounded-2xl border bg-white p-5">
        <p className="text-encre/70 text-sm">
          Taux conversion visite→inscription:{" "}
          <span className="text-encre font-semibold">
            {String(stats.conversion_visit_signup)}%
          </span>
        </p>
      </article>
    </div>
  );
}
