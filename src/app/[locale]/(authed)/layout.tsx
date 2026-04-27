import {
  CreditCard,
  LayoutGrid,
  LogOut,
  MessageSquare,
  Search,
} from "lucide-react";
import type { ReactNode } from "react";
import { redirect } from "next/navigation";

import { buttonVariants } from "@/components/ui/button";
import { UnreadMessagesBadge } from "@/components/features/messages/UnreadMessagesBadge";
import { Logo } from "@/components/shared/Logo";
import { Link } from "@/i18n/navigation";
import { getCurrentUser } from "@/lib/auth/session";
import { signOut } from "@/lib/auth/actions";
import { cn } from "@/lib/utils";

type Props = {
  children: ReactNode;
  params: Promise<{ locale: string }>;
};

// Layout authentifié : barre de navigation vers les modules (recherche, publier, messages, compte)
export default async function AuthedLayout({ children, params }: Props) {
  const { locale } = await params;
  const { user, profile } = await getCurrentUser();

  if (!user) {
    redirect(`/${locale}/login?redirect_to=/${locale}/dashboard`);
  }

  const displayName = profile?.full_name?.trim() || user.email || "Compte";

  return (
    <div className="bg-creme-pale min-h-screen">
      <header className="border-line bg-paper border-b">
        <div className="mx-auto flex max-w-6xl flex-col gap-3 px-4 py-3 md:flex-row md:items-center md:justify-between md:px-6">
          <div className="flex min-w-0 items-center justify-between gap-3 md:justify-start">
            <Link
              href="/dashboard"
              className="inline-flex shrink-0 items-center"
            >
              <Logo size="md" />
            </Link>
            <p className="text-ink-soft truncate text-right text-xs md:hidden">
              {displayName}
            </p>
          </div>
          <nav
            className="flex flex-wrap items-center justify-end gap-1.5 md:gap-2"
            aria-label="Espace membre"
          >
            <Link
              href="/search"
              className={cn(
                buttonVariants({ variant: "ghost", size: "sm" }),
                "text-ink gap-1 px-2",
              )}
            >
              <Search className="h-3.5 w-3.5" />
              Recherche
            </Link>
            <Link
              href="/publish"
              className={cn(
                buttonVariants({ variant: "default", size: "sm" }),
                "px-2.5",
              )}
            >
              Publier
            </Link>
            <Link
              href="/dashboard/listings"
              className={cn(
                buttonVariants({ variant: "secondary", size: "sm" }),
                "text-ink gap-1 border px-2.5",
              )}
            >
              <LayoutGrid className="h-3.5 w-3.5" />
              Mes annonces
            </Link>
            <Link
              href="/messages"
              className={cn(
                buttonVariants({ variant: "secondary", size: "sm" }),
                "text-ink gap-1 border px-2.5",
              )}
            >
              <MessageSquare className="h-3.5 w-3.5" />
              Messages
            </Link>
            <UnreadMessagesBadge locale={locale} />
            <Link
              href="/dashboard/billing"
              className={cn(
                buttonVariants({ variant: "ghost", size: "sm" }),
                "text-ink gap-1 px-2",
              )}
            >
              <CreditCard className="h-3.5 w-3.5" />
              Facturation
            </Link>
            <Link
              href={`/profile/${user.id}`}
              className="text-bleu text-sm font-medium hover:underline"
            >
              Profil
            </Link>
            <p className="text-ink-soft hidden text-xs md:block">
              {displayName}
            </p>
            <form action={signOut} className="inline">
              <button
                type="submit"
                className="text-ink-soft hover:text-bleu inline-flex items-center gap-1 rounded-md px-2 py-1.5 text-xs"
              >
                <LogOut className="h-3.5 w-3.5" />
                Déconnexion
              </button>
            </form>
          </nav>
        </div>
      </header>
      {children}
    </div>
  );
}
