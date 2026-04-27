import { getLocale, getTranslations } from "next-intl/server";

import { Link } from "@/i18n/navigation";

import { Logo } from "./Logo";

// Pied de page : 4 colonnes (À propos, Découvrir, Aide, Légal) + copyright
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
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <span className="sr-only">{t("common.brandName")}</span>
            <Logo className="mb-3" size="md" />
            <p className="text-ink mt-1 text-sm font-semibold">
              {t("common.brandName")}
            </p>
            <p className="text-ink-soft max-w-sm text-sm leading-relaxed">
              {tagline}
            </p>
            <p className="text-ink-soft mt-3 text-xs leading-relaxed">
              {t("footer.columnAboutText")}
            </p>
          </div>

          <div>
            <h2 className="font-heading text-ink mb-3 text-sm font-semibold tracking-wide uppercase">
              {t("footer.columnDiscover")}
            </h2>
            <ul className="text-ink-soft space-y-2 text-sm">
              <li>
                <Link
                  className="hover:text-bleu focus-visible:ring-bleu/40 focus-visible:ring-offset-creme-pale rounded-sm focus-visible:ring-2 focus-visible:ring-offset-2"
                  href="/search"
                >
                  {t("footer.searchLink")}
                </Link>
              </li>
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
              <li>
                <Link
                  className="hover:text-bleu focus-visible:ring-bleu/40 focus-visible:ring-offset-creme-pale rounded-sm focus-visible:ring-2 focus-visible:ring-offset-2"
                  href="/outils"
                >
                  {t("navigation.tools")}
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h2 className="font-heading text-ink mb-3 text-sm font-semibold tracking-wide uppercase">
              {t("footer.columnHelp")}
            </h2>
            <ul className="text-ink-soft space-y-2 text-sm">
              <li>
                <Link
                  className="hover:text-bleu focus-visible:ring-bleu/40 focus-visible:ring-offset-creme-pale rounded-sm focus-visible:ring-2 focus-visible:ring-offset-2"
                  href="/faq"
                >
                  {t("footer.faq")}
                </Link>
              </li>
              <li>
                <a
                  className="hover:text-bleu focus-visible:ring-bleu/40 focus-visible:ring-offset-creme-pale rounded-sm focus-visible:ring-2 focus-visible:ring-offset-2"
                  href="mailto:contact@papimo.com"
                >
                  {t("footer.contact")}
                </a>
              </li>
              <li>
                <Link
                  className="hover:text-bleu focus-visible:ring-bleu/40 focus-visible:ring-offset-creme-pale rounded-sm focus-visible:ring-2 focus-visible:ring-offset-2"
                  href="/pricing"
                >
                  {t("footer.pricingLink")}
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h2 className="font-heading text-ink mb-3 text-sm font-semibold tracking-wide uppercase">
              {t("footer.columnLegal")}
            </h2>
            <ul className="text-ink-soft space-y-2 text-sm">
              <li>
                <Link
                  className="hover:text-bleu focus-visible:ring-bleu/40 focus-visible:ring-offset-creme-pale rounded-sm focus-visible:ring-2 focus-visible:ring-offset-2"
                  href="/legal"
                >
                  {t("footer.legalHub")}
                </Link>
              </li>
              <li>
                <Link
                  className="hover:text-bleu focus-visible:ring-bleu/40 focus-visible:ring-offset-creme-pale rounded-sm focus-visible:ring-2 focus-visible:ring-offset-2"
                  href="/legal/cgu"
                >
                  {t("legal.cgu")}
                </Link>
              </li>
              <li>
                <Link
                  className="hover:text-bleu focus-visible:ring-bleu/40 focus-visible:ring-offset-creme-pale rounded-sm focus-visible:ring-2 focus-visible:ring-offset-2"
                  href="/legal/cgv"
                >
                  {t("legal.cgv")}
                </Link>
              </li>
              <li>
                <Link
                  className="hover:text-bleu focus-visible:ring-bleu/40 focus-visible:ring-offset-creme-pale rounded-sm focus-visible:ring-2 focus-visible:ring-offset-2"
                  href="/legal/confidentialite"
                >
                  {t("legal.privacy")}
                </Link>
              </li>
              <li>
                <Link
                  className="hover:text-bleu focus-visible:ring-bleu/40 focus-visible:ring-offset-creme-pale rounded-sm focus-visible:ring-2 focus-visible:ring-offset-2"
                  href="/legal/cookies"
                >
                  {t("legal.cookies")}
                </Link>
              </li>
              <li>
                <Link
                  className="hover:text-bleu focus-visible:ring-bleu/40 focus-visible:ring-offset-creme-pale rounded-sm focus-visible:ring-2 focus-visible:ring-offset-2"
                  href="/legal/mentions-legales"
                >
                  {t("legal.notices")}
                </Link>
              </li>
            </ul>
            <h3 className="text-ink mt-6 text-xs font-semibold tracking-wide uppercase">
              {t("footer.columnLanguages")}
            </h3>
            <p className="text-ink-soft mt-2 text-sm">
              {t("navigation.languages.fr")} · {t("navigation.languages.ar")} ·{" "}
              {t("navigation.languages.en")}
            </p>
          </div>
        </div>
        <p className="text-ink-soft mt-10 text-center text-xs">
          © {year} {t("common.brandName")} — {tagline}
        </p>
      </div>
    </footer>
  );
}
