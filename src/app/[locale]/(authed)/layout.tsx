import type { ReactNode } from "react";
import Link from "next/link";

import { UnreadMessagesBadge } from "@/components/features/messages/UnreadMessagesBadge";
import { Logo } from "@/components/shared/Logo";

type Props = {
  children: ReactNode;
  params: Promise<{ locale: string }>;
};

export default async function AuthedLayout({ children, params }: Props) {
  const { locale } = await params;

  return (
    <div className="bg-creme-pale min-h-screen">
      <header className="border-line bg-paper border-b">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3 md:px-6">
          <Link
            href={`/${locale}/dashboard`}
            className="inline-flex items-center"
          >
            <Logo size="md" />
          </Link>
          <nav className="flex items-center gap-2">
            <Link
              href={`/${locale}/dashboard`}
              className="border-line text-ink rounded-full border bg-white px-3 py-1.5 text-xs"
            >
              Dashboard
            </Link>
            <Link
              href={`/${locale}/publish`}
              className="border-line text-ink rounded-full border bg-white px-3 py-1.5 text-xs"
            >
              Publier
            </Link>
            <UnreadMessagesBadge locale={locale} />
          </nav>
        </div>
      </header>
      {children}
    </div>
  );
}
