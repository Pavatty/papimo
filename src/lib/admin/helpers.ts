// LODGE admin helpers (Phase 9.6 Foundation).
// Lit/écrit dans `admin_permissions` + `admin_activity_log` + utilise les
// helpers SQL is_admin / get_admin_role / is_user_banned.
// Note : `requireAdmin(locale?)` reste dans @/lib/admin/guards (legacy, gate UI).
// Ces helpers sont pour la nouvelle RBAC table-driven.

import { createClient } from "@/data/supabase/server";

import type { AdminRole } from "@/config/admin";

export async function getAdminRole(userId: string): Promise<AdminRole | null> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("admin_permissions")
    .select("role")
    .eq("user_id", userId)
    .maybeSingle();

  if (error || !data) return null;
  return data.role as AdminRole;
}

export async function isAdmin(userId: string): Promise<boolean> {
  const role = await getAdminRole(userId);
  return role !== null;
}

export async function requireAdminUser(userId: string): Promise<AdminRole> {
  const role = await getAdminRole(userId);
  if (!role) throw new Error("Unauthorized: admin access required");
  return role;
}

export async function logAdminActivity(params: {
  adminId: string;
  action: string;
  entityType?: string;
  entityId?: string;
  details?: Record<string, unknown>;
}): Promise<void> {
  const supabase = await createClient();
  await supabase.from("admin_activity_log").insert({
    admin_id: params.adminId,
    action: params.action,
    ...(params.entityType ? { entity_type: params.entityType } : {}),
    ...(params.entityId ? { entity_id: params.entityId } : {}),
    details: (params.details ?? {}) as never,
  });
}

export async function isUserBanned(userId: string): Promise<boolean> {
  const supabase = await createClient();
  const { data } = await supabase.rpc("is_user_banned", {
    check_user_id: userId,
  });
  return data === true;
}
