import { getTranslations } from "next-intl/server";

// Page tableau de bord (placeholder) — contenu authentifié à implémenter plus tard
export default async function DashboardPage() {
  const t = await getTranslations();
  return (
    <div className="p-6">
      <h1 className="font-heading text-ink text-2xl font-bold">
        {t("common.brandName")}
      </h1>
      <p className="text-ink-soft mt-2">Tableau de bord (à connecter)</p>
    </div>
  );
}
