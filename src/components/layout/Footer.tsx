import { getLocale, getTranslations } from "next-intl/server";

import { Link } from "@/i18n/navigation";

export async function Footer() {
  const t = await getTranslations("Footer");
  const locale = await getLocale();
  const year = new Date().getFullYear();

  return (
    <footer className="bg-ink text-white">
      <div className="mx-auto max-w-7xl px-6 py-12 md:px-7">
        <div className="mb-10 grid grid-cols-1 gap-8 md:grid-cols-4">
          <div className="md:col-span-1">
            <Link href="/" className="mb-4 inline-block">
              <span className="text-2xl font-semibold tracking-tight text-white">
                LODGE
              </span>
            </Link>
            <p className="text-sm leading-relaxed text-white/60">
              {t("description")}
            </p>
          </div>

          <div>
            <h3 className="mb-4 text-xs font-medium tracking-wider text-white/50 uppercase">
              {t("discover")}
            </h3>
            <ul className="space-y-2">
              <li>
                <Link
                  href="/search"
                  className="text-sm text-white/80 hover:text-white"
                >
                  {t("immobilier")}
                </Link>
              </li>
              <li>
                <Link
                  href="/sejours"
                  className="text-sm text-white/80 hover:text-white"
                >
                  {t("sejours")}
                </Link>
              </li>
              <li>
                <Link
                  href="/agences"
                  className="text-sm text-white/80 hover:text-white"
                >
                  {t("agences")}
                </Link>
              </li>
              <li>
                <Link
                  href="/publish"
                  className="text-sm text-white/80 hover:text-white"
                >
                  {t("publish")}
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="mb-4 text-xs font-medium tracking-wider text-white/50 uppercase">
              {t("legal")}
            </h3>
            <ul className="space-y-2">
              <li>
                <Link
                  href="/legal/cgv"
                  className="text-sm text-white/80 hover:text-white"
                >
                  {t("cgu")}
                </Link>
              </li>
              <li>
                <Link
                  href="/legal/confidentialite"
                  className="text-sm text-white/80 hover:text-white"
                >
                  {t("privacy")}
                </Link>
              </li>
              <li>
                <Link
                  href="/legal/cookies"
                  className="text-sm text-white/80 hover:text-white"
                >
                  {t("cookies")}
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="mb-4 text-xs font-medium tracking-wider text-white/50 uppercase">
              {t("contact")}
            </h3>
            <a
              href="mailto:contact@lodge.tn"
              className="text-sm text-white/80 hover:text-white"
            >
              contact@lodge.tn
            </a>
          </div>
        </div>

        <div className="flex flex-col gap-4 border-t border-white/10 pt-6 text-xs text-white/50 md:flex-row md:justify-between">
          <div className="flex gap-3">
            <Link
              href="/"
              locale="fr"
              className={locale === "fr" ? "text-white" : "hover:text-white"}
            >
              Français
            </Link>
            <span>·</span>
            <Link
              href="/"
              locale="ar"
              className={locale === "ar" ? "text-white" : "hover:text-white"}
            >
              العربية
            </Link>
            <span>·</span>
            <Link
              href="/"
              locale="en"
              className={locale === "en" ? "text-white" : "hover:text-white"}
            >
              English
            </Link>
          </div>
          <p>© {year} LODGE</p>
        </div>
      </div>
    </footer>
  );
}
