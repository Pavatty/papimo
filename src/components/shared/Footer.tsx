import { getLocale, getTranslations } from "next-intl/server";

import { Link } from "@/i18n/navigation";

import { Logo } from "./Logo";

// Pied de page : 4 colonnes (marque, particuliers, à propos, langues) + copyright
export async function Footer() {
  const t = await getTranslations();
  const locale = await getLocale();
  const year = new Date().getFullYear();

  const tagline =
    locale === "fr"
      ? t("common.tagline.fr")
      : locale === "ar"
        ? t("common.tagline.ar")
        : t("common.tagline.en");

  return (
    <footer className="border-line bg-creme-pale border-t" role="contentinfo">
      <div className="mx-auto max-w-6xl px-4 py-12 md:px-6">
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
          <div>
            <span className="sr-only">{t("common.brandName")}</span>
            <Logo className="mb-3" size="md" />
            <p className="text-ink-soft max-w-xs text-sm">{tagline}</p>
          </div>
          <div>
            <h2 className="font-heading text-ink mb-3 text-sm font-semibold tracking-wide uppercase">
              {t("footer.columnIndividuals")}
            </h2>
            <ul className="text-ink-soft space-y-2 text-sm">
              <li>
                <Link
                  className="hover:text-bleu focus-visible:ring-bleu/40 focus-visible:ring-offset-creme-pale rounded-sm focus-visible:ring-2 focus-visible:ring-offset-2"
                  href="/achat"
                >
                  {t("navigation.buy")}
                </Link>
              </li>
              <li>
                <Link
                  className="hover:text-bleu focus-visible:ring-bleu/40 focus-visible:ring-offset-creme-pale rounded-sm focus-visible:ring-2 focus-visible:ring-offset-2"
                  href="/location"
                >
                  {t("navigation.rent")}
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h2 className="font-heading text-ink mb-3 text-sm font-semibold tracking-wide uppercase">
              {t("footer.columnAbout")}
            </h2>
            <ul className="text-ink-soft space-y-2 text-sm">
              <li>
                <a
                  className="hover:text-bleu focus-visible:ring-bleu/40 focus-visible:ring-offset-creme-pale rounded-sm focus-visible:ring-2 focus-visible:ring-offset-2"
                  href="https://papimo.com"
                >
                  papimo.com
                </a>
              </li>
              <li>
                <Link
                  className="hover:text-bleu focus-visible:ring-bleu/40 focus-visible:ring-offset-creme-pale rounded-sm focus-visible:ring-2 focus-visible:ring-offset-2"
                  href="/legal/mentions-legales"
                >
                  {t("footer.legalNotice")}
                </Link>
              </li>
              <li>
                <Link
                  className="hover:text-bleu focus-visible:ring-bleu/40 focus-visible:ring-offset-creme-pale rounded-sm focus-visible:ring-2 focus-visible:ring-offset-2"
                  href="/legal/confidentialite"
                >
                  {t("footer.privacy")}
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h2 className="font-heading text-ink mb-3 text-sm font-semibold tracking-wide uppercase">
              {t("footer.columnLanguages")}
            </h2>
            <ul className="text-ink-soft space-y-2 text-sm">
              <li>
                <span>{t("navigation.languages.fr")}</span>
                {" · "}
                <span>{t("navigation.languages.ar")}</span>
                {" · "}
                <span>{t("navigation.languages.en")}</span>
              </li>
            </ul>
          </div>
        </div>
        <p className="text-ink-soft mt-10 text-center text-xs">
          © {year} {t("common.brandName")} — {tagline}
        </p>
      </div>
    </footer>
  );
}
