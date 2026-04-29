"use client";

import { Menu, X } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import { useState } from "react";

import { Link, usePathname } from "@/i18n/navigation";
import { cn } from "@/lib/utils";

export function Header() {
  const t = useTranslations("Header");
  const locale = useLocale();
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const close = () => setOpen(false);

  const isImmoActive =
    pathname === "/" ||
    pathname === "" ||
    pathname.startsWith("/search") ||
    pathname.startsWith("/immobilier") ||
    pathname.startsWith("/achat") ||
    pathname.startsWith("/location");
  const isSejActive = pathname.startsWith("/sejours");
  const isAgencesActive = pathname.startsWith("/agences");

  return (
    <header
      role="banner"
      className="sticky top-0 z-50 border-b border-gray-200 bg-white"
    >
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 md:px-6">
        <Link
          href="/"
          aria-label={t("brandAria")}
          className="text-lodge focus-visible:ring-lodge text-2xl font-semibold tracking-tight focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none"
        >
          LODGE
        </Link>

        <nav
          className="hidden items-center gap-8 md:flex"
          aria-label={t("navAria")}
        >
          <Link
            href="/search"
            className={cn(
              "text-sm font-medium transition-colors",
              isImmoActive ? "text-ink" : "hover:text-ink text-gray-500",
            )}
          >
            {t("immobilier")}
          </Link>
          <Link
            href="/sejours"
            className={cn(
              "text-sm font-medium transition-colors",
              isSejActive ? "text-ink" : "hover:text-ink text-gray-500",
            )}
          >
            {t("sejours")}
          </Link>
          <Link
            href="/agences"
            className={cn(
              "text-sm font-medium transition-colors",
              isAgencesActive ? "text-ink" : "hover:text-ink text-gray-500",
            )}
          >
            {t("agences")}
          </Link>
        </nav>

        <div className="hidden items-center gap-3 md:flex">
          <Link
            href="/publish"
            className="bg-lodge hover:bg-lodge-700 focus-visible:ring-lodge rounded-full px-5 py-2 text-sm font-medium text-white transition-colors focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none"
          >
            {t("publier")}
          </Link>
          <Link
            href="/dashboard"
            className="text-ink hidden rounded-full border border-gray-200 px-4 py-2 text-sm font-medium transition-colors hover:bg-gray-50 sm:inline-flex"
          >
            {t("monEspace")}
          </Link>
          <nav
            aria-label={t("languagesAria")}
            className="ml-2 flex items-center gap-1 border-l border-gray-200 pl-3"
          >
            {(["fr", "ar", "en"] as const).map((l) => (
              <Link
                key={l}
                href={pathname}
                locale={l}
                hrefLang={l}
                aria-current={l === locale ? "true" : undefined}
                className={cn(
                  "rounded px-1.5 py-0.5 text-xs font-medium transition",
                  l === locale ? "text-lodge" : "hover:text-ink text-gray-400",
                )}
              >
                {l.toUpperCase()}
              </Link>
            ))}
          </nav>
        </div>

        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          aria-expanded={open}
          aria-label={open ? t("close") : t("menu")}
          className="text-ink focus-visible:ring-lodge inline-flex h-10 w-10 items-center justify-center rounded focus-visible:ring-2 focus-visible:outline-none md:hidden"
        >
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {open ? (
        <div
          id="mobile-menu"
          className="absolute right-0 left-0 z-40 border-b border-gray-200 bg-white px-4 pb-4 shadow-md md:hidden"
        >
          <nav aria-label={t("navAria")} className="flex flex-col gap-1 pt-2">
            <Link
              href="/search"
              onClick={close}
              className="text-ink rounded-md px-3 py-2 text-base hover:bg-gray-50"
            >
              {t("immobilier")}
            </Link>
            <Link
              href="/sejours"
              onClick={close}
              className="text-ink rounded-md px-3 py-2 text-base hover:bg-gray-50"
            >
              {t("sejours")}
            </Link>
            <Link
              href="/agences"
              onClick={close}
              className="text-ink rounded-md px-3 py-2 text-base hover:bg-gray-50"
            >
              {t("agences")}
            </Link>
            <hr className="my-2 border-gray-200" />
            <Link
              href="/publish"
              onClick={close}
              className="bg-lodge hover:bg-lodge-700 rounded-full px-4 py-2 text-center text-sm font-medium text-white"
            >
              {t("publier")}
            </Link>
            <Link
              href="/dashboard"
              onClick={close}
              className="text-ink rounded-full border border-gray-200 px-4 py-2 text-center text-sm font-medium hover:bg-gray-50"
            >
              {t("monEspace")}
            </Link>
            <div className="mt-2 flex items-center justify-center gap-2 border-t border-gray-200 pt-3">
              {(["fr", "ar", "en"] as const).map((l) => (
                <Link
                  key={l}
                  href={pathname}
                  locale={l}
                  hrefLang={l}
                  onClick={close}
                  aria-current={l === locale ? "true" : undefined}
                  className={cn(
                    "rounded px-2 py-1 text-xs",
                    l === locale ? "text-lodge font-semibold" : "text-gray-500",
                  )}
                >
                  {l.toUpperCase()}
                </Link>
              ))}
            </div>
          </nav>
        </div>
      ) : null}
    </header>
  );
}
