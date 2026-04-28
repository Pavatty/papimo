"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

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

export function AdminSidebar({ locale }: { locale: string }) {
  const pathname = usePathname();
  return (
    <aside className="border-bordurewarm-tertiary bg-blanc-casse fixed top-0 left-0 h-screen w-[280px] overflow-y-auto border-r p-4">
      <div className="mb-6">
        <p className="font-serif text-2xl">
          <span className="text-bleu">pap</span>
          <span className="text-corail">imo</span>
        </p>
        <p className="text-encre/50 mt-1 text-[10px] tracking-widest uppercase">
          Admin
        </p>
      </div>
      <nav className="space-y-5">
        {SECTIONS.map((section) => (
          <div key={section.title}>
            <p className="text-encre/50 mb-1.5 px-3 text-[10px] font-medium tracking-widest uppercase">
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
                          : "text-encre hover:bg-creme-pale"
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
    </aside>
  );
}
