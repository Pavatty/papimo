"use client";

import { buttonVariants } from "@/components/ui/button";
import { useAuth } from "@/components/providers/AuthProvider";
import { UnreadMessagesBadge } from "@/components/features/messages/UnreadMessagesBadge";
import { Link, usePathname, useRouter } from "@/i18n/navigation";
import { cn } from "@/lib/utils";
import { type Locale, useLocale, useTranslations } from "next-intl";

import { Logo } from "./Logo";

// Barre de navigation : visiteur = découverte + CTA compte | connecté = recherche, publication, messages, compte
export function Header() {
  const t = useTranslations();
  const pathname = usePathname();
  const locale = useLocale() as Locale;
  const router = useRouter();
  const { user, signOut } = useAuth();
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

        {user ? (
          <nav
            className="text-ink hidden max-w-3xl flex-1 flex-wrap items-center justify-center gap-x-4 gap-y-2 text-sm font-medium lg:flex"
            aria-label={t("a11y.mainMenu")}
          >
            <Link
              href="/search"
              className="text-ink hover:text-bleu focus-visible:ring-bleu/40 transition focus-visible:ring-2 focus-visible:ring-offset-2"
            >
              {t("navigation.search")}
            </Link>
            <Link
              href="/publish"
              className="text-ink hover:text-bleu focus-visible:ring-bleu/40 transition focus-visible:ring-2 focus-visible:ring-offset-2"
            >
              {t("navigation.publish")}
            </Link>
            <div className="inline-flex">
              <UnreadMessagesBadge locale={locale} />
            </div>
            <Link
              href="/dashboard"
              className="text-ink hover:text-bleu focus-visible:ring-bleu/40 transition focus-visible:ring-2 focus-visible:ring-offset-2"
            >
              {t("navigation.profile")}
            </Link>
          </nav>
        ) : (
          <nav
            className="text-ink hidden max-w-3xl flex-1 flex-wrap items-center justify-center gap-x-4 gap-y-2 text-sm font-medium lg:flex"
            aria-label={t("a11y.mainMenu")}
          >
            <Link
              href="/search"
              className="text-ink hover:text-bleu focus-visible:ring-bleu/40 transition focus-visible:ring-2 focus-visible:ring-offset-2"
            >
              {t("navigation.search")}
            </Link>
            <Link
              href="/outils"
              className="text-ink hover:text-bleu focus-visible:ring-bleu/40 transition focus-visible:ring-2 focus-visible:ring-offset-2"
            >
              {t("navigation.tools")}
            </Link>
            <Link
              href="/pricing"
              className="text-ink hover:text-bleu focus-visible:ring-bleu/40 transition focus-visible:ring-2 focus-visible:ring-offset-2"
            >
              {t("navigation.pricing")}
            </Link>
          </nav>
        )}

        <div className="flex items-center gap-2 md:gap-3">
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
          {user ? (
            <button
              type="button"
              onClick={async () => {
                await signOut();
                router.push("/");
                router.refresh();
              }}
              className={cn(
                buttonVariants({ variant: "secondary", size: "default" }),
                "text-ink min-h-9 min-w-0 font-medium",
              )}
            >
              {t("navigation.signOut")}
            </button>
          ) : (
            <>
              <Link
                href="/login"
                className={cn(
                  buttonVariants({ variant: "secondary", size: "default" }),
                  "text-bleu min-h-9 min-w-0 font-medium",
                )}
              >
                {t("navigation.login")}
              </Link>
              <Link
                href="/signup"
                className="text-ink-soft hover:text-bleu hidden min-h-9 text-sm font-medium underline-offset-4 hover:underline min-[420px]:inline"
              >
                {t("navigation.signup")}
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
