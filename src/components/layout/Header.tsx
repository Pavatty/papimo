"use client";

import { Menu, X } from "lucide-react";
import { type Locale, useLocale, useTranslations } from "next-intl";
import { useState } from "react";

import { useAuth } from "@/components/providers/AuthProvider";
import { Link, usePathname } from "@/i18n/navigation";
import { IS_BETA } from "@/lib/beta";
import { cn } from "@/lib/utils";

const LOCALES: Locale[] = ["fr", "ar", "en"];

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

export function Header() {
  const t = useTranslations();
  const locale = useLocale() as Locale;
  const pathname = usePathname();
  const { user } = useAuth();
  const [open, setOpen] = useState(false);

  const close = () => setOpen(false);

  return (
    <header
      role="banner"
      className="bg-creme/85 border-bordurewarm-tertiary sticky top-0 z-50 h-16 border-b backdrop-blur"
    >
      <div className="max-w-container mx-auto flex h-full items-center justify-between px-4 md:px-6 lg:px-8">
        <Link
          href="/"
          aria-label={t("common.brandName")}
          className="focus-visible:ring-bleu/40 focus-visible:ring-offset-creme inline-flex items-center rounded focus-visible:ring-2 focus-visible:ring-offset-2"
        >
          <BrandWordmark />
        </Link>

        <nav
          className="hidden items-center gap-6 text-sm font-medium md:flex"
          aria-label={t("a11y.mainMenu")}
        >
          <Link
            href="/search"
            className="text-encre hover:text-bleu transition"
          >
            {t("navigation.search")}
          </Link>
          <Link
            href="/outils"
            className="text-encre hover:text-bleu transition"
          >
            {t("navigation.tools")}
          </Link>
          {!PRICING_HIDDEN ? (
            <Link
              href="/pricing"
              className="text-encre hover:text-bleu transition"
            >
              {t("navigation.pricing")}
            </Link>
          ) : null}
        </nav>

        <div className="hidden items-center gap-3 md:flex">
          <nav
            aria-label={t("a11y.languageMenu")}
            className="border-bordurewarm-tertiary flex items-center gap-1 border-r pr-3"
          >
            {LOCALES.map((l) => (
              <Link
                key={l}
                href={pathname}
                locale={l}
                hrefLang={l}
                className={cn(
                  "rounded-control px-1.5 py-0.5 text-xs font-medium transition",
                  l === locale ? "text-bleu" : "text-muted hover:text-bleu",
                )}
              >
                {l.toUpperCase()}
              </Link>
            ))}
          </nav>
          {user ? (
            <Link
              href="/dashboard"
              className="text-bleu hover:text-bleu-hover text-sm font-medium"
            >
              {t("navigation.profile")}
            </Link>
          ) : (
            <>
              <Link
                href="/login"
                className="text-bleu hover:text-bleu-hover text-sm font-medium"
              >
                {t("navigation.login")}
              </Link>
              <Link
                href="/signup"
                className="bg-corail hover:bg-corail-hover rounded-control px-4 py-2 text-sm font-medium text-white transition"
              >
                {t("navigation.signup")}
              </Link>
            </>
          )}
        </div>

        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          aria-expanded={open}
          aria-controls="header-mobile-menu"
          aria-label={open ? "Close menu" : t("a11y.mainMenu")}
          className="text-encre rounded-control inline-flex h-10 w-10 items-center justify-center md:hidden"
        >
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {open ? (
        <div
          id="header-mobile-menu"
          className="bg-creme border-bordurewarm-tertiary shadow-card absolute inset-x-0 top-16 z-40 border-b md:hidden"
        >
          <nav
            className="max-w-container mx-auto flex flex-col gap-1 px-4 py-4"
            aria-label={t("a11y.mainMenu")}
          >
            <Link
              href="/search"
              onClick={close}
              className="text-encre hover:bg-creme-foncee rounded-control px-3 py-2 text-base"
            >
              {t("navigation.search")}
            </Link>
            <Link
              href="/outils"
              onClick={close}
              className="text-encre hover:bg-creme-foncee rounded-control px-3 py-2 text-base"
            >
              {t("navigation.tools")}
            </Link>
            {!PRICING_HIDDEN ? (
              <Link
                href="/pricing"
                onClick={close}
                className="text-encre hover:bg-creme-foncee rounded-control px-3 py-2 text-base"
              >
                {t("navigation.pricing")}
              </Link>
            ) : null}
            <hr className="border-bordurewarm-tertiary my-2" />
            <div className="flex items-center gap-1 px-3 py-1">
              {LOCALES.map((l) => (
                <Link
                  key={l}
                  href={pathname}
                  locale={l}
                  hrefLang={l}
                  onClick={close}
                  className={cn(
                    "rounded-control px-2 py-1 text-xs font-medium transition",
                    l === locale ? "text-bleu" : "text-muted hover:text-bleu",
                  )}
                >
                  {l.toUpperCase()}
                </Link>
              ))}
            </div>
            <hr className="border-bordurewarm-tertiary my-2" />
            {user ? (
              <Link
                href="/dashboard"
                onClick={close}
                className="text-bleu rounded-control px-3 py-2 text-base font-medium"
              >
                {t("navigation.profile")}
              </Link>
            ) : (
              <>
                <Link
                  href="/login"
                  onClick={close}
                  className="text-bleu rounded-control px-3 py-2 text-base font-medium"
                >
                  {t("navigation.login")}
                </Link>
                <Link
                  href="/signup"
                  onClick={close}
                  className="bg-corail hover:bg-corail-hover rounded-control mt-1 px-3 py-2 text-center text-base font-medium text-white"
                >
                  {t("navigation.signup")}
                </Link>
              </>
            )}
          </nav>
        </div>
      ) : null}
    </header>
  );
}
