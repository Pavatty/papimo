import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { NextIntlClientProvider } from "next-intl";
import {
  getMessages,
  getTranslations,
  setRequestLocale,
} from "next-intl/server";
import { type ReactNode } from "react";

import { AuthProvider } from "@/components/providers/AuthProvider";
import { BRAND } from "@/config/brand";
import { routing } from "@/i18n/routing";
import { getCurrentUser } from "@/lib/auth/session";
import { localeAlternates } from "@/lib/seo/metadata";

const localeDirs: Record<string, "ltr" | "rtl"> = {
  fr: "ltr",
  en: "ltr",
  ar: "rtl",
};

export function generateStaticParams() {
  return routing.locales.map((loc) => ({ locale: loc }));
}

type LocaleLayoutProps = {
  children: ReactNode;
  params: Promise<{ locale: string }>;
};

export async function generateMetadata(
  props: LocaleLayoutProps,
): Promise<Metadata> {
  const { locale } = await props.params;
  const tagline =
    BRAND.tagline[locale as keyof typeof BRAND.tagline] ?? BRAND.tagline.fr;
  return {
    title: {
      default: `${BRAND.name} — ${tagline}`,
      template: `%s | ${BRAND.name}`,
    },
    description: tagline,
    metadataBase: new URL(BRAND.url),
    alternates: localeAlternates(""),
    openGraph: {
      title: `${BRAND.name} — ${tagline}`,
      description: tagline,
      locale,
      type: "website",
      images: [{ url: "/og-default.png" }],
    },
    twitter: {
      card: "summary_large_image",
      title: `${BRAND.name} — ${tagline}`,
      description: tagline,
    },
  };
}

export default async function LocaleLayout({
  children,
  params,
}: LocaleLayoutProps) {
  const { locale } = await params;

  if (!routing.locales.includes(locale as (typeof routing.locales)[number])) {
    notFound();
  }

  setRequestLocale(locale);

  const messages = await getMessages();
  const t = await getTranslations();
  const { user, profile } = await getCurrentUser();
  const dir = localeDirs[locale] ?? "ltr";

  return (
    <div lang={locale} dir={dir} className="flex min-h-full flex-col">
      <a
        href="#main-content"
        className="bg-bleu focus-visible:ring-bleu sr-only z-50 rounded px-3 py-2 text-white focus:not-sr-only focus:absolute focus:top-2 focus:left-2 focus-visible:ring-2"
      >
        {t("common.skipToContent")}
      </a>
      <NextIntlClientProvider locale={locale} messages={messages}>
        <AuthProvider initialUser={user} initialProfile={profile}>
          <div className="bg-papimo-coral px-4 py-2 text-center text-sm font-medium text-white">
            {t("beta.banner")}
          </div>
          {children}
        </AuthProvider>
      </NextIntlClientProvider>
    </div>
  );
}
