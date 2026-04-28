"use client";

import { Plus } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import Link from "next/link";
import { useEffect, useState } from "react";

export function StickyPublishCTA() {
  const [visible, setVisible] = useState(false);
  const locale = useLocale();
  const t = useTranslations("home");

  useEffect(() => {
    const handler = () => setVisible(window.scrollY > 600);
    handler();
    window.addEventListener("scroll", handler, { passive: true });
    return () => window.removeEventListener("scroll", handler);
  }, []);

  return (
    <Link
      href={`/${locale}/publish`}
      aria-label={t("publishCta")}
      aria-hidden={!visible}
      tabIndex={visible ? 0 : -1}
      className={`bg-corail hover:bg-corail-hover focus-visible:ring-corail fixed right-6 bottom-6 z-40 inline-flex items-center gap-2 rounded-full px-5 py-3 text-sm font-medium text-white shadow-xl transition-all duration-300 focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none ${
        visible
          ? "translate-y-0 opacity-100"
          : "pointer-events-none translate-y-8 opacity-0"
      }`}
    >
      <Plus className="size-4" aria-hidden="true" />
      <span className="hidden sm:inline">{t("publishCta")}</span>
    </Link>
  );
}
