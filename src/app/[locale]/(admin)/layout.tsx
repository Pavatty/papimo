import type { ReactNode } from "react";

import { AdminHeader } from "@/components/features/admin/AdminHeader";
import { AdminSidebar } from "@/components/features/admin/AdminSidebar";
import { requireAdmin } from "@/lib/admin/guards";

type AdminLayoutProps = {
  children: ReactNode;
  params: Promise<{ locale: string }>;
};

export default async function AdminLayout({
  children,
  params,
}: AdminLayoutProps) {
  const { locale } = await params;
  const { supabase, profile } = await requireAdmin(locale);

  const [
    { count: pendingListings },
    { count: pendingReports },
    { count: flaggedMessages },
  ] = await Promise.all([
    supabase
      .from("listings")
      .select("*", { head: true, count: "exact" })
      .eq("status", "pending"),
    supabase
      .from("reports")
      .select("*", { head: true, count: "exact" })
      .in("status", ["open", "reviewing"]),
    supabase
      .from("messages")
      .select("*", { head: true, count: "exact" })
      .eq("flagged", true),
  ]);

  const pendingTasks =
    (pendingListings ?? 0) + (pendingReports ?? 0) + (flaggedMessages ?? 0);

  return (
    <div className="bg-creme-pale dark:bg-encre/95 min-h-screen">
      <AdminSidebar
        locale={locale}
        user={{
          full_name: profile.full_name ?? null,
          email: profile.email ?? null,
          avatar_url: profile.avatar_url ?? null,
        }}
      />
      <div className="ml-[280px] min-h-screen">
        <AdminHeader
          adminName={profile.full_name ?? profile.email ?? "Admin"}
          pendingTasks={pendingTasks}
        />
        <main id="main-content" className="p-6">
          {children}
        </main>
      </div>
    </div>
  );
}
