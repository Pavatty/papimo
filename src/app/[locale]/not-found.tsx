import { Home, Search } from "lucide-react";
import { getLocale, getTranslations } from "next-intl/server";

import { Link } from "@/i18n/navigation";

export default async function NotFound() {
  const t = await getTranslations("notFound");
  const locale = await getLocale();
  const dir = locale === "ar" ? "rtl" : "ltr";

  return (
    <div
      dir={dir}
      className="bg-creme dark:bg-encre flex min-h-[70vh] items-center justify-center px-4"
    >
      <div className="max-w-md space-y-6 text-center">
        <div className="font-serif text-7xl">
          <span className="text-bleu">4</span>
          <span className="text-corail">0</span>
          <span className="text-bleu">4</span>
        </div>
        <div>
          <h1 className="text-encre dark:text-creme mb-2 font-serif text-2xl">
            {t("title")}
          </h1>
          <p className="text-encre/70 dark:text-creme/70">{t("description")}</p>
        </div>
        <div className="flex flex-col justify-center gap-3 sm:flex-row">
          <Link
            href="/"
            className="bg-bleu hover:bg-bleu-hover rounded-control focus-visible:ring-bleu inline-flex items-center justify-center gap-2 px-5 py-2.5 text-sm font-medium text-white transition focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none"
          >
            <Home className="size-4" aria-hidden="true" />
            {t("goHome")}
          </Link>
          <Link
            href="/search"
            className="border-bordurewarm-tertiary text-encre hover:bg-creme-foncee rounded-control focus-visible:ring-bleu dark:border-encre/20 dark:text-creme dark:hover:bg-encre/40 inline-flex items-center justify-center gap-2 border px-5 py-2.5 text-sm font-medium transition focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none"
          >
            <Search className="size-4" aria-hidden="true" />
            {t("exploreListings")}
          </Link>
        </div>
      </div>
    </div>
  );
}
