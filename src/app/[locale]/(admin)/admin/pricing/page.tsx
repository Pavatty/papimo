import { requireAdmin } from "@/lib/admin/guards";

type Props = { params: Promise<{ locale: string }> };

export default async function AdminPricingPage({ params }: Props) {
  const { locale } = await params;
  const { supabase } = await requireAdmin(locale);
  const { data } = await supabase
    .from("pricing_packs")
    .select(
      "id, code, label_fr, price_monthly_tnd, price_yearly_tnd, active_days, max_active_listings, max_photos_per_listing, is_active, is_recommended, sort_order",
    )
    .order("sort_order", { ascending: true });

  const packs = data ?? [];

  return (
    <div className="space-y-4">
      <div>
        <h1 className="font-display text-ink text-2xl font-bold">
          Packs tarifaires
        </h1>
        <p className="text-ink-soft mt-1 text-sm">
          {packs.length} pack{packs.length > 1 ? "s" : ""} configuré
          {packs.length > 1 ? "s" : ""} (lecture seule).
        </p>
      </div>
      <div className="grid gap-3 md:grid-cols-2">
        {packs.map((pack) => (
          <article
            key={pack.id}
            className={`border-line rounded-xl border bg-white p-5 ${pack.is_recommended ? "ring-bleu/30 ring-2" : ""} ${pack.is_active ? "" : "opacity-50"}`}
          >
            <div className="mb-3 flex items-start justify-between gap-3">
              <div>
                <p className="text-ink text-lg font-semibold">
                  {pack.label_fr}
                </p>
                <p className="text-ink-soft text-xs">code: {pack.code}</p>
              </div>
              {pack.is_recommended ? (
                <span className="bg-bleu rounded px-2 py-0.5 text-xs font-medium text-white">
                  Recommandé
                </span>
              ) : null}
            </div>
            <dl className="text-ink space-y-1.5 text-sm">
              <div className="flex justify-between">
                <dt className="text-ink-soft">Prix mensuel</dt>
                <dd className="font-medium">{pack.price_monthly_tnd} TND</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-ink-soft">Prix annuel</dt>
                <dd className="font-medium">{pack.price_yearly_tnd} TND</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-ink-soft">Annonces actives max</dt>
                <dd className="font-medium">{pack.max_active_listings}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-ink-soft">Photos / annonce</dt>
                <dd className="font-medium">{pack.max_photos_per_listing}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-ink-soft">Durée annonce (jours)</dt>
                <dd className="font-medium">{pack.active_days}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-ink-soft">Statut</dt>
                <dd className="font-medium">
                  {pack.is_active ? "Actif" : "Inactif"}
                </dd>
              </div>
            </dl>
          </article>
        ))}
      </div>
      <p className="text-ink-soft mt-2 text-xs">
        Modification des prix : ouvrir{" "}
        <code className="bg-creme-pale rounded px-1">{`/${locale}/admin/reglages`}</code>{" "}
        et éditer la clé JSON du pack.
      </p>
    </div>
  );
}
