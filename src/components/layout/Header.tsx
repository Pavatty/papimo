"use client";

import {
  AnimatePresence,
  motion,
  useScroll,
  useTransform,
} from "framer-motion";
import { Menu, X } from "lucide-react";
import { type Locale, useLocale, useTranslations } from "next-intl";
import { useTheme } from "next-themes";
import { useState } from "react";

import { BrandWordmark } from "@/components/layout/BrandWordmark";
import { useAuth } from "@/components/providers/AuthProvider";
import { ThemeSwitcher } from "@/components/theme/ThemeSwitcher";
import { Link, usePathname } from "@/i18n/navigation";
import { IS_BETA } from "@/lib/beta";
import { cn } from "@/lib/utils";

const LOCALES: Locale[] = ["fr", "ar", "en"];

const PRICING_HIDDEN = IS_BETA;

type HeaderProps = {
  brandPart1?: string;
  brandPart2?: string;
};

export function Header({
  brandPart1 = "pap",
  brandPart2 = "imo",
}: HeaderProps = {}) {
  const t = useTranslations();
  const locale = useLocale() as Locale;
  const pathname = usePathname();
  const { user } = useAuth();
  const [open, setOpen] = useState(false);

  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme === "dark";
  const { scrollY } = useScroll();
  const headerBg = useTransform(
    scrollY,
    [0, 80],
    isDark
      ? ["rgba(26, 26, 26, 0.5)", "rgba(31, 31, 31, 0.9)"]
      : ["rgba(251, 246, 236, 0.5)", "rgba(255, 255, 255, 0.9)"],
  );
  const headerBorder = useTransform(scrollY, [0, 80], [0, 1]);

  const close = () => setOpen(false);

  const navLinks = [
    { href: "/search", label: t("navigation.search") },
    { href: "/outils", label: t("navigation.tools") },
    ...(!PRICING_HIDDEN
      ? [{ href: "/pricing", label: t("navigation.pricing") }]
      : []),
  ];

  const isActive = (href: string) => pathname.startsWith(href);

  return (
    <motion.header
      role="banner"
      style={{
        backgroundColor: headerBg,
        borderBottomWidth: headerBorder,
      }}
      className="border-bordurewarm-tertiary dark:border-encre/20 sticky top-0 z-50 h-16 border-b backdrop-blur"
    >
      <div className="max-w-container mx-auto flex h-full items-center justify-between px-4 md:px-6 lg:px-8">
        <Link
          href="/"
          aria-label={t("common.brandName")}
          className="focus-visible:ring-bleu/40 focus-visible:ring-offset-creme inline-flex items-center rounded transition-transform hover:scale-[1.02] focus-visible:ring-2 focus-visible:ring-offset-2"
        >
          <BrandWordmark size="header" part1={brandPart1} part2={brandPart2} />
        </Link>

        <nav
          className="hidden items-center gap-6 text-sm font-medium md:flex"
          aria-label={t("a11y.mainMenu")}
        >
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              aria-current={isActive(link.href) ? "page" : undefined}
              className={cn(
                "relative rounded-sm transition",
                "after:bg-bleu after:absolute after:-bottom-1 after:left-0 after:h-0.5 after:w-0 after:transition-all hover:after:w-full",
                "focus-visible:ring-bleu focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none",
                isActive(link.href)
                  ? "text-bleu after:w-full"
                  : "text-encre dark:text-creme hover:text-bleu dark:hover:text-bleu",
              )}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="hidden items-center gap-3 md:flex">
          <ThemeSwitcher />
          <nav
            aria-label={t("a11y.languageMenu")}
            className="border-bordurewarm-tertiary dark:border-encre/20 flex items-center gap-1 border-r pr-3"
          >
            {LOCALES.map((l) => (
              <Link
                key={l}
                href={pathname}
                locale={l}
                hrefLang={l}
                aria-current={l === locale ? "true" : undefined}
                className={cn(
                  "rounded-control px-1.5 py-0.5 text-xs transition",
                  "focus-visible:ring-bleu focus-visible:ring-2 focus-visible:ring-offset-1 focus-visible:outline-none",
                  l === locale
                    ? "text-bleu font-semibold"
                    : "text-encre/80 hover:text-bleu font-medium",
                )}
              >
                {l.toUpperCase()}
              </Link>
            ))}
          </nav>
          {user ? (
            <Link
              href="/dashboard"
              className="text-bleu hover:text-bleu-hover focus-visible:ring-bleu rounded-sm text-sm font-semibold focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none"
            >
              {t("navigation.profile")}
            </Link>
          ) : (
            <>
              <Link
                href="/login"
                className="text-bleu hover:text-bleu-hover focus-visible:ring-bleu rounded-sm text-sm font-semibold focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none"
              >
                {t("navigation.login")}
              </Link>
              <Link
                href="/signup"
                className="bg-corail hover:bg-corail-hover rounded-control focus-visible:ring-corail px-4 py-2 text-sm font-medium text-white transition focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none"
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
          className="text-encre dark:text-creme rounded-control focus-visible:ring-bleu inline-flex h-10 w-10 items-center justify-center focus-visible:ring-2 focus-visible:outline-none md:hidden"
        >
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      <AnimatePresence>
        {open ? (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              onClick={close}
              className="fixed inset-0 top-16 z-40 bg-black/30 md:hidden"
              aria-hidden="true"
            />
            <motion.div
              id="header-mobile-menu"
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "tween", duration: 0.25, ease: "easeOut" }}
              className="bg-blanc-casse border-bordurewarm-tertiary dark:bg-encre dark:border-encre/20 fixed inset-y-16 right-0 z-50 w-72 max-w-[85%] overflow-y-auto border-l shadow-2xl md:hidden"
            >
              <nav
                className="flex flex-col gap-1 p-5"
                aria-label={t("a11y.mainMenu")}
              >
                {navLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={close}
                    aria-current={isActive(link.href) ? "page" : undefined}
                    className={cn(
                      "rounded-control px-3 py-2 text-base transition",
                      isActive(link.href)
                        ? "text-bleu bg-bleu-pale font-medium"
                        : "text-encre dark:text-creme hover:bg-creme-foncee dark:hover:bg-encre/40",
                    )}
                  >
                    {link.label}
                  </Link>
                ))}
                <hr className="border-bordurewarm-tertiary dark:border-encre/20 my-2" />
                <div className="flex items-center gap-1 px-3 py-1">
                  {LOCALES.map((l) => (
                    <Link
                      key={l}
                      href={pathname}
                      locale={l}
                      hrefLang={l}
                      onClick={close}
                      aria-current={l === locale ? "true" : undefined}
                      className={cn(
                        "rounded-control px-2 py-1 text-xs transition",
                        "focus-visible:ring-bleu focus-visible:ring-2 focus-visible:outline-none",
                        l === locale
                          ? "text-bleu font-semibold"
                          : "text-encre/80 hover:text-bleu font-medium",
                      )}
                    >
                      {l.toUpperCase()}
                    </Link>
                  ))}
                </div>
                <hr className="border-bordurewarm-tertiary dark:border-encre/20 my-2" />
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
            </motion.div>
          </>
        ) : null}
      </AnimatePresence>
    </motion.header>
  );
}
