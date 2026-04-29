import { useTranslations } from "next-intl";

import { Link } from "@/i18n/navigation";

export function MiniHero() {
  const t = useTranslations("MiniHero");

  return (
    <section className="bg-cream border-b border-gray-200 px-4 py-12 text-center md:py-14">
      <div className="inline-flex flex-wrap justify-center gap-3">
        <Link
          href="/search"
          className="bg-lodge hover:bg-lodge-700 focus-visible:ring-lodge inline-flex items-center gap-2 rounded-full px-7 py-3.5 text-sm font-medium text-white transition-colors focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none"
        >
          {t("rechercher")} <span className="font-mono">→</span>
        </Link>
        <Link
          href="/publish"
          className="text-lodge border-lodge hover:bg-lodge-50 focus-visible:ring-lodge inline-flex items-center rounded-full border-2 bg-white px-7 py-3.5 text-sm font-medium transition-colors focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none"
        >
          {t("publier")}
        </Link>
      </div>
    </section>
  );
}
