import { SearchX } from "lucide-react";

import { Link } from "@/i18n/navigation";

type Props = {
  hasFilters: boolean;
};

export function SejoursEmptyState({ hasFilters }: Props) {
  return (
    <div className="bg-blanc-casse dark:bg-encre/95 sejours-shadow-sm animate-sejours-fadeIn rounded-2xl p-12 text-center">
      <div className="bg-sejours-sky text-sejours-turquoise mx-auto mb-5 inline-flex h-20 w-20 items-center justify-center rounded-full">
        <SearchX className="h-10 w-10" aria-hidden />
      </div>
      <h3 className="text-encre dark:text-creme mb-2 text-2xl font-bold">
        Aucun séjour trouvé
      </h3>
      <p className="text-encre/70 dark:text-creme/70 mx-auto mb-6 max-w-md text-sm">
        {hasFilters
          ? "Essayez d'élargir vos critères de recherche ou explorez d'autres destinations en Tunisie."
          : "Les premières annonces arrivent bientôt. Revenez vite !"}
      </p>
      {hasFilters ? (
        <Link
          href="/sejours"
          className="sejours-gradient-turquoise hover:sejours-shadow-lg focus-visible:ring-sejours-turquoise inline-flex items-center gap-2 rounded-xl px-5 py-3 text-sm font-bold text-white transition-all focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none"
        >
          🏖️ Voir toutes les annonces
        </Link>
      ) : null}
    </div>
  );
}
