"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const ITEMS = [
  { href: "/admin", label: "Dashboard" },
  { href: "/admin/annonces", label: "Annonces" },
  { href: "/admin/users", label: "Utilisateurs" },
  { href: "/admin/moderation", label: "Modération" },
  { href: "/admin/transactions", label: "Transactions" },
  { href: "/admin/partenaires", label: "Partenaires" },
  { href: "/admin/leads", label: "Leads" },
  { href: "/admin/pubs", label: "Pubs" },
  { href: "/admin/rapports", label: "Rapports" },
  { href: "/admin/reglages", label: "Réglages" },
  { href: "/admin/feature-flags", label: "Feature Flags" },
  { href: "/admin/audit-log", label: "Audit log" },
] as const;

export function AdminSidebar({ locale }: { locale: string }) {
  const pathname = usePathname();
  return (
    <aside className="border-line bg-paper fixed top-0 left-0 h-screen w-[280px] border-r p-4">
      <div className="mb-4">
        <p className="text-ink text-lg font-bold">
          <span className="text-bleu">pap</span>
          <span className="text-corail">imo</span>
        </p>
        <p className="text-ink-soft text-xs">Admin panel</p>
      </div>
      <nav className="space-y-1">
        {ITEMS.map((item) => {
          const href = `/${locale}${item.href}`;
          const active = pathname === href;
          return (
            <Link
              key={item.href}
              href={href}
              className={`block rounded-lg px-3 py-2 text-sm ${
                active
                  ? "bg-bleu-pale text-bleu"
                  : "text-ink hover:bg-creme-pale"
              }`}
            >
              {item.label}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
