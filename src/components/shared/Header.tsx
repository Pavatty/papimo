"use client";

import { buttonVariants } from "@/components/ui/button";
import { Link, usePathname } from "@/i18n/navigation";
import { cn } from "@/lib/utils";
import { type Locale, useLocale, useTranslations } from "next-intl";
import { UnreadMessagesBadge } from "@/components/features/messages/UnreadMessagesBadge";

import { Logo } from "./Logo";

// Barre de navigation : liens de découverte, i18n, CTA (connexion = secondaire, publication = corail)
export function Header() {
  const t = useTranslations();
  const pathname = usePathname();
  const locale = useLocale() as Locale;
  const locales: Locale[] = ["fr", "ar", "en"];

  return (
    <header
      className="border-line bg-creme-pale/80 border-b backdrop-blur"
      role="banner"
    >
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3 md:px-6">
        <Link
          href="/"
          className="focus-visible:ring-bleu/40 focus-visible:ring-offset-creme flex items-center gap-2 rounded-sm focus-visible:ring-2 focus-visible:ring-offset-2"
          aria-label={t("common.brandName")}
        >
          <Logo size="md" />
        </Link>

        <nav
          className="text-ink hidden flex-1 items-center justify-center gap-6 text-sm font-medium md:flex"
          aria-label={t("a11y.mainMenu")}
        >
          <Link
            href="/acheter"
            className="text-ink hover:text-bleu focus-visible:ring-bleu/40 transition focus-visible:ring-2 focus-visible:ring-offset-2"
          >
            {t("navigation.buy")}
          </Link>
          <Link
            href="/louer"
            className="text-ink hover:text-bleu focus-visible:ring-bleu/40 transition focus-visible:ring-2 focus-visible:ring-offset-2"
          >
            {t("navigation.rent")}
          </Link>
          <Link
            href="/estimer"
            className="text-ink hover:text-bleu focus-visible:ring-bleu/40 transition focus-visible:ring-2 focus-visible:ring-offset-2"
          >
            {t("navigation.estimate")}
          </Link>
          <Link
            href="/outils"
            className="text-ink hover:text-bleu focus-visible:ring-bleu/40 transition focus-visible:ring-2 focus-visible:ring-offset-2"
          >
            {t("navigation.tools")}
          </Link>
        </nav>

        <div className="flex items-center gap-2 md:gap-3">
          <UnreadMessagesBadge locale={locale} />
          <nav
            className="border-line flex items-center gap-1 border-r pr-2 md:pr-3"
            aria-label={t("a11y.languageMenu")}
          >
            {locales.map((l) => {
              const langLabel =
                l === "fr"
                  ? t("navigation.languages.fr")
                  : l === "ar"
                    ? t("navigation.languages.ar")
                    : t("navigation.languages.en");
              return (
                <Link
                  key={l}
                  href={pathname}
                  locale={l}
                  className={cn(
                    "rounded-sm px-1.5 py-0.5 text-xs font-medium transition focus-visible:ring-2 focus-visible:ring-offset-2",
                    l === locale
                      ? "text-bleu"
                      : "text-ink-soft hover:text-bleu focus-visible:ring-bleu/40",
                  )}
                  hrefLang={l}
                  title={langLabel}
                >
                  {l.toUpperCase()}
                </Link>
              );
            })}
          </nav>
          <Link
            href="/connexion"
            className={cn(
              buttonVariants({ variant: "secondary", size: "default" }),
              "text-bleu min-h-9 min-w-[7rem] font-medium",
            )}
          >
            {t("navigation.login")}
          </Link>
          <Link
            href="/publier"
            className={cn(
              buttonVariants({ variant: "default", size: "default" }),
              "min-h-9 min-w-0",
            )}
          >
            {t("navigation.publishMyProperty")}
          </Link>
        </div>
      </div>
    </header>
  );
}
