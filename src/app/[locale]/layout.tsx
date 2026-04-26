import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { NextIntlClientProvider } from "next-intl";
import { getMessages, setRequestLocale } from "next-intl/server";
import { type ReactNode } from "react";

import { AuthProvider } from "@/components/providers/AuthProvider";
import { BRAND } from "@/config/brand";
import { routing } from "@/i18n/routing";
import { getCurrentUser } from "@/lib/auth/session";

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
  const { user, profile } = await getCurrentUser();
  const dir = localeDirs[locale] ?? "ltr";

  return (
    <html lang={locale} dir={dir} className="h-full antialiased">
      <body className="flex min-h-full flex-col">
        <NextIntlClientProvider locale={locale} messages={messages}>
          <AuthProvider initialUser={user} initialProfile={profile}>
            {children}
          </AuthProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
