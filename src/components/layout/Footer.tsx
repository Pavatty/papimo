import { getLocale, getTranslations } from "next-intl/server";

import { Link } from "@/i18n/navigation";
import { IS_BETA } from "@/lib/beta";
import { cn } from "@/lib/utils";

const PRICING_HIDDEN = IS_BETA;

function BrandWordmark({ className }: { className?: string }) {
  return (
    <span
      className={cn(
        "inline-flex font-serif text-2xl leading-none select-none",
        className,
      )}
    >
      <span className="text-bleu" aria-hidden>
        pap
      </span>
      <span className="text-corail" aria-hidden>
        imo
      </span>
    </span>
  );
}

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
    <footer
      role="contentinfo"
      className="bg-creme-foncee border-bordurewarm-tertiary border-t py-12 md:py-16"
    >
      <div className="max-w-container mx-auto px-4 md:px-6 lg:px-8">
        <div className="mb-10 max-w-2xl">
          <Link href="/" aria-label={t("common.brandName")}>
            <BrandWordmark />
          </Link>
          <p className="text-encre mt-3 font-serif text-xl">{tagline}</p>
          <p className="text-muted mt-2 text-sm leading-relaxed">
            {t("footer.columnAboutText")}
          </p>
        </div>

        <div className="grid gap-10 md:grid-cols-3">
          <div>
            <h2 className="text-encre mb-3 text-sm font-semibold tracking-wide uppercase">
              {t("footer.columnDiscover")}
            </h2>
            <ul className="text-muted space-y-2 text-sm">
              <li>
                <Link href="/search" className="hover:text-bleu">
                  {t("footer.searchLink")}
                </Link>
              </li>
              <li>
                <Link href="/achat" className="hover:text-bleu">
                  {t("navigation.buy")}
                </Link>
              </li>
              <li>
                <Link href="/location" className="hover:text-bleu">
                  {t("navigation.rent")}
                </Link>
              </li>
              <li>
                <Link href="/outils" className="hover:text-bleu">
                  {t("navigation.tools")}
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h2 className="text-encre mb-3 text-sm font-semibold tracking-wide uppercase">
              {t("footer.columnHelp")}
            </h2>
            <ul className="text-muted space-y-2 text-sm">
              <li>
                <Link href="/faq" className="hover:text-bleu">
                  {t("footer.faq")}
                </Link>
              </li>
              <li>
                <a href="mailto:contact@papimo.com" className="hover:text-bleu">
                  {t("footer.contact")}
                </a>
              </li>
              {!PRICING_HIDDEN ? (
                <li>
                  <Link href="/pricing" className="hover:text-bleu">
                    {t("footer.pricingLink")}
                  </Link>
                </li>
              ) : null}
            </ul>
          </div>

          <div>
            <h2 className="text-encre mb-3 text-sm font-semibold tracking-wide uppercase">
              {t("footer.columnLegal")}
            </h2>
            <ul className="text-muted space-y-2 text-sm">
              <li>
                <Link href="/legal" className="hover:text-bleu">
                  {t("footer.legalHub")}
                </Link>
              </li>
              <li>
                <Link href="/legal/cgu" className="hover:text-bleu">
                  {t("legal.cgu")}
                </Link>
              </li>
              <li>
                <Link href="/legal/cgv" className="hover:text-bleu">
                  {t("legal.cgv")}
                </Link>
              </li>
              <li>
                <Link href="/legal/confidentialite" className="hover:text-bleu">
                  {t("legal.privacy")}
                </Link>
              </li>
              <li>
                <Link href="/legal/cookies" className="hover:text-bleu">
                  {t("legal.cookies")}
                </Link>
              </li>
              <li>
                <Link
                  href="/legal/mentions-legales"
                  className="hover:text-bleu"
                >
                  {t("legal.notices")}
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-bordurewarm-tertiary mt-10 flex flex-col items-start gap-3 border-t pt-6 md:flex-row md:items-center md:justify-between">
          <p className="text-muted text-sm">
            {t("navigation.languages.fr")} · {t("navigation.languages.ar")} ·{" "}
            {t("navigation.languages.en")}
          </p>
          <p className="text-muted text-xs">
            © {year} {t("common.brandName")} - {tagline}
          </p>
        </div>
      </div>
    </footer>
  );
}
