import {
  ChevronDown,
  CreditCard,
  LayoutDashboard,
  LayoutGrid,
  LogOut,
  MessageSquare,
  Search,
  User,
} from "lucide-react";
import { getTranslations } from "next-intl/server";
import type { ReactNode } from "react";
import { redirect } from "next/navigation";

import { buttonVariants } from "@/components/ui/button";
import { Logo } from "@/components/shared/Logo";
import { getIsAdmin } from "@/data/supabase/session";
import { Link } from "@/i18n/navigation";
import { getCurrentUser } from "@/lib/auth/session";
import { signOut } from "@/lib/auth/actions";
import { IS_BETA } from "@/lib/beta";
import { cn } from "@/lib/utils";

type Props = {
  children: ReactNode;
  params: Promise<{ locale: string }>;
};

// Layout authentifié : barre de navigation vers les modules (recherche, publier, messages, compte)
export default async function AuthedLayout({ children, params }: Props) {
  const { locale } = await params;
  const [{ user, profile }, isAdmin, t] = await Promise.all([
    getCurrentUser(),
    getIsAdmin(),
    getTranslations("common"),
  ]);

  if (!user) {
    redirect(`/${locale}/login?redirect_to=/${locale}/dashboard`);
  }

  const displayName = profile?.full_name?.trim() || user.email || "Compte";

  return (
    <div className="bg-creme-pale min-h-screen">
      <header className="border-line bg-paper border-b">
        <div className="mx-auto flex max-w-6xl flex-col gap-3 px-4 py-3 md:flex-row md:items-center md:justify-between md:px-6">
          <div className="flex min-w-0 items-center justify-between gap-3 md:justify-start">
            <Link href="/" className="inline-flex shrink-0 items-center">
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
            {!IS_BETA ? (
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
            ) : null}
            <details className="relative">
              <summary className="border-line text-ink flex cursor-pointer list-none items-center gap-2 rounded-lg border bg-white px-2.5 py-1.5 text-sm">
                {profile?.avatar_url ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={profile.avatar_url}
                    alt={displayName}
                    className="h-6 w-6 rounded-full object-cover"
                  />
                ) : (
                  <User className="h-4 w-4" />
                )}
                <span className="max-w-28 truncate">{displayName}</span>
                <ChevronDown className="h-3.5 w-3.5" />
              </summary>
              <div className="border-line absolute right-0 z-20 mt-2 w-56 rounded-xl border bg-white p-2 shadow-md">
                {isAdmin ? (
                  <>
                    <Link
                      href="/admin"
                      className="text-bleu hover:bg-bleu-pale focus-visible:ring-bleu flex items-center gap-2 rounded-md px-2 py-1.5 text-sm font-semibold focus-visible:ring-2 focus-visible:outline-none"
                    >
                      <LayoutDashboard
                        className="h-3.5 w-3.5"
                        aria-hidden="true"
                      />
                      {t("adminDashboard")}
                    </Link>
                    <div className="bg-line my-1 h-px" />
                  </>
                ) : null}
                <Link
                  href="/profile/edit"
                  className="hover:bg-creme-pale block rounded-md px-2 py-1.5 text-sm"
                >
                  Mon profil
                </Link>
                <Link
                  href="/dashboard/listings"
                  className="hover:bg-creme-pale block rounded-md px-2 py-1.5 text-sm"
                >
                  Mes annonces
                </Link>
                {!IS_BETA ? (
                  <Link
                    href="/dashboard/billing"
                    className="hover:bg-creme-pale block rounded-md px-2 py-1.5 text-sm"
                  >
                    Facturation
                  </Link>
                ) : null}
                <form action={signOut} className="mt-1">
                  <button
                    type="submit"
                    className="hover:bg-creme-pale text-danger w-full rounded-md px-2 py-1.5 text-left text-sm"
                  >
                    Déconnexion
                  </button>
                </form>
              </div>
            </details>
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
