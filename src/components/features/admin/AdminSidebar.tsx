"use client";

import { ArrowLeft, LogOut } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

import { signOut } from "@/lib/auth/actions";

type SidebarItem = { href: string; label: string };
type SidebarSection = { title: string; items: readonly SidebarItem[] };

const SECTIONS: readonly SidebarSection[] = [
  {
    title: "Vue d'ensemble",
    items: [{ href: "/admin", label: "Dashboard" }],
  },
  {
    title: "Contenu",
    items: [
      { href: "/admin/annonces", label: "Annonces" },
      { href: "/admin/moderation", label: "Modération" },
      { href: "/admin/users", label: "Utilisateurs" },
    ],
  },
  {
    title: "Configuration",
    items: [
      { href: "/admin/marque", label: "Marque" },
      { href: "/admin/pricing", label: "Packs tarifaires" },
      { href: "/admin/feature-flags", label: "Feature Flags" },
      { href: "/admin/reglages", label: "Réglages (JSON)" },
    ],
  },
  {
    title: "Taxonomies",
    items: [
      {
        href: "/admin/taxonomies/transaction-types",
        label: "Types transaction",
      },
      { href: "/admin/taxonomies/property-types", label: "Types de bien" },
      { href: "/admin/taxonomies/amenities", label: "Équipements" },
    ],
  },
  {
    title: "Activité",
    items: [
      { href: "/admin/transactions", label: "Transactions" },
      { href: "/admin/leads", label: "Leads" },
      { href: "/admin/partenaires", label: "Partenaires" },
      { href: "/admin/pubs", label: "Pubs" },
      { href: "/admin/rapports", label: "Rapports" },
      { href: "/admin/audit-log", label: "Audit log" },
    ],
  },
];

type AdminUserInfo = {
  full_name: string | null;
  email: string | null;
  avatar_url: string | null;
};

type Props = {
  locale: string;
  user?: AdminUserInfo;
};

export function AdminSidebar({ locale, user }: Props) {
  const pathname = usePathname();
  const initial =
    user?.full_name?.[0]?.toUpperCase() ??
    user?.email?.[0]?.toUpperCase() ??
    "?";

  return (
    <aside className="border-bordurewarm-tertiary bg-blanc-casse dark:border-encre/20 dark:bg-encre fixed top-0 left-0 flex h-screen w-[280px] flex-col overflow-y-auto border-r p-4">
      <div className="mb-6">
        <p className="font-serif text-2xl">
          <span className="text-bleu">pap</span>
          <span className="text-corail">imo</span>
        </p>
        <p className="text-encre/50 dark:text-creme/50 mt-1 text-[10px] tracking-widest uppercase">
          Admin
        </p>
      </div>

      <nav className="space-y-5">
        {SECTIONS.map((section) => (
          <div key={section.title}>
            <p className="text-encre/50 dark:text-creme/50 mb-1.5 px-3 text-[10px] font-medium tracking-widest uppercase">
              {section.title}
            </p>
            <ul className="space-y-0.5">
              {section.items.map((item) => {
                const href = `/${locale}${item.href}`;
                const active = pathname === href;
                return (
                  <li key={item.href}>
                    <Link
                      href={href}
                      aria-current={active ? "page" : undefined}
                      className={`block rounded-lg px-3 py-2 text-sm transition ${
                        active
                          ? "bg-bleu-pale text-bleu font-medium"
                          : "text-encre hover:bg-creme-pale dark:text-creme dark:hover:bg-encre/40"
                      }`}
                    >
                      {item.label}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </nav>

      <div className="flex-1" aria-hidden />

      <div className="border-bordurewarm-tertiary dark:border-encre/20 mt-6 space-y-1 border-t pt-4">
        {user ? (
          <div className="flex items-center gap-2 px-2 py-1.5">
            {user.avatar_url ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={user.avatar_url}
                alt=""
                className="size-7 rounded-full object-cover"
              />
            ) : (
              <div className="bg-bleu/10 text-bleu flex size-7 items-center justify-center rounded-full text-xs font-semibold">
                {initial}
              </div>
            )}
            <div className="min-w-0 flex-1">
              <p className="text-encre dark:text-creme truncate text-xs font-medium">
                {user.full_name ?? user.email ?? "Admin"}
              </p>
              <p className="text-encre/60 dark:text-creme/60 text-[10px]">
                Admin
              </p>
            </div>
          </div>
        ) : null}

        <Link
          href={`/${locale}`}
          className="rounded-control text-encre/70 hover:text-encre focus-visible:ring-bleu dark:text-creme/70 dark:hover:text-creme flex items-center gap-2 px-2 py-1.5 text-sm transition focus-visible:ring-2 focus-visible:outline-none"
        >
          <ArrowLeft className="size-4" aria-hidden="true" />
          Retour au site
        </Link>

        <form action={signOut}>
          <button
            type="submit"
            className="rounded-control flex w-full items-center gap-2 px-2 py-1.5 text-sm text-red-600 transition hover:bg-red-50 focus-visible:ring-2 focus-visible:ring-red-600 focus-visible:outline-none dark:hover:bg-red-950/30"
          >
            <LogOut className="size-4" aria-hidden="true" />
            Déconnexion
          </button>
        </form>
      </div>
    </aside>
  );
}
