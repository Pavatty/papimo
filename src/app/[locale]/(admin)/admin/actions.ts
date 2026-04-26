"use server";

import { z } from "zod";

import { requireAdmin } from "@/lib/admin/guards";
import { logAuditEvent } from "@/lib/audit/log";
import type { Enums } from "@/types/database";

export async function approveListingAction(locale: string, listingId: string) {
  const { supabase, user } = await requireAdmin(locale);
  await supabase
    .from("listings")
    .update({ status: "active" })
    .eq("id", listingId);
  await logAuditEvent({
    action: "admin_approve_listing",
    targetType: "listing",
    targetId: listingId,
    afterData: { status: "active", admin_id: user.id },
  });
  return { ok: true };
}

export async function rejectListingAction(
  locale: string,
  listingId: string,
  reason: string,
) {
  const { supabase, user } = await requireAdmin(locale);
  await supabase
    .from("listings")
    .update({ status: "rejected" })
    .eq("id", listingId);
  await logAuditEvent({
    action: "admin_reject_listing",
    targetType: "listing",
    targetId: listingId,
    afterData: { status: "rejected", reason, admin_id: user.id },
  });
  return { ok: true };
}

export async function suspendListingAction(locale: string, listingId: string) {
  const { supabase, user } = await requireAdmin(locale);
  await supabase
    .from("listings")
    .update({ status: "expired" })
    .eq("id", listingId);
  await logAuditEvent({
    action: "admin_suspend_listing",
    targetType: "listing",
    targetId: listingId,
    afterData: { status: "expired", admin_id: user.id },
  });
  return { ok: true };
}

export async function boostListingForFreeAction(
  locale: string,
  listingId: string,
) {
  const { supabase, user } = await requireAdmin(locale);
  const now = new Date();
  const endsAt = new Date(now);
  endsAt.setDate(endsAt.getDate() + 7);
  await supabase.from("boosts").insert({
    listing_id: listingId,
    type: "top_list",
    starts_at: now.toISOString(),
    ends_at: endsAt.toISOString(),
  });
  await logAuditEvent({
    action: "admin_boost_listing_free",
    targetType: "listing",
    targetId: listingId,
    afterData: { boost: "top_list", admin_id: user.id },
  });
  return { ok: true };
}

export async function softDeleteListingAction(
  locale: string,
  listingId: string,
) {
  const { supabase, user } = await requireAdmin(locale);
  await supabase
    .from("listings")
    .update({ status: "rejected" })
    .eq("id", listingId);
  await logAuditEvent({
    action: "admin_soft_delete_listing",
    targetType: "listing",
    targetId: listingId,
    afterData: { admin_id: user.id },
  });
  return { ok: true };
}

export async function bulkListingStatusAction(
  locale: string,
  listingIds: string[],
  status: Enums<"listing_status">,
) {
  const { supabase, user } = await requireAdmin(locale);
  if (listingIds.length === 0) return { ok: true };
  await supabase.from("listings").update({ status }).in("id", listingIds);
  await logAuditEvent({
    action: "admin_bulk_listing_status",
    targetType: "listing",
    afterData: { listingIds, status, admin_id: user.id },
  });
  return { ok: true };
}

export async function updateUserRoleAction(
  locale: string,
  userId: string,
  role: Enums<"user_role">,
) {
  const { supabase, user } = await requireAdmin(locale);
  await supabase.from("profiles").update({ role }).eq("id", userId);
  await logAuditEvent({
    action: "admin_update_user_role",
    targetType: "profile",
    targetId: userId,
    afterData: { role, admin_id: user.id },
  });
  return { ok: true };
}

export async function verifyKycAction(locale: string, userId: string) {
  const { supabase, user } = await requireAdmin(locale);
  await supabase
    .from("profiles")
    .update({ kyc_status: "verified", is_verified: true })
    .eq("id", userId);
  await logAuditEvent({
    action: "admin_verify_kyc",
    targetType: "profile",
    targetId: userId,
    afterData: { kyc_status: "verified", admin_id: user.id },
  });
  return { ok: true };
}

export async function suspendUserAction(locale: string, userId: string) {
  const { supabase, user } = await requireAdmin(locale);
  await supabase.from("profiles").update({ role: "user" }).eq("id", userId);
  await logAuditEvent({
    action: "admin_suspend_user",
    targetType: "profile",
    targetId: userId,
    afterData: { admin_id: user.id },
  });
  return { ok: true };
}

export async function resetUserPasswordAction(locale: string, email: string) {
  const { supabase, user } = await requireAdmin(locale);
  const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";
  await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${appUrl}/fr/login`,
  });
  await logAuditEvent({
    action: "admin_reset_password",
    targetType: "profile",
    afterData: { email, admin_id: user.id },
  });
  return { ok: true };
}

export async function approveModerationItemAction(
  locale: string,
  kind: "listing" | "message" | "report",
  id: string,
) {
  const { supabase, user } = await requireAdmin(locale);
  if (kind === "listing") {
    await supabase.from("listings").update({ status: "active" }).eq("id", id);
  }
  if (kind === "message") {
    await supabase
      .from("messages")
      .update({ flagged: false, flag_reason: null })
      .eq("id", id);
  }
  if (kind === "report") {
    await supabase
      .from("reports")
      .update({ status: "resolved", resolved_at: new Date().toISOString() })
      .eq("id", id);
  }
  await logAuditEvent({
    action: "admin_moderation_approve",
    targetType: kind,
    targetId: id,
    afterData: { admin_id: user.id },
  });
  return { ok: true };
}

export async function rejectModerationItemAction(
  locale: string,
  kind: "listing" | "message" | "report",
  id: string,
  reason: string,
) {
  const { supabase, user } = await requireAdmin(locale);
  if (kind === "listing") {
    await supabase.from("listings").update({ status: "rejected" }).eq("id", id);
  }
  if (kind === "message") {
    await supabase
      .from("messages")
      .update({ flagged: true, flag_reason: reason })
      .eq("id", id);
  }
  if (kind === "report") {
    await supabase
      .from("reports")
      .update({ status: "rejected", resolution: reason })
      .eq("id", id);
  }
  await logAuditEvent({
    action: "admin_moderation_reject",
    targetType: kind,
    targetId: id,
    afterData: { reason, admin_id: user.id },
  });
  return { ok: true };
}

const jsonSettingSchema = z.object({
  key: z.string().min(1),
  value: z.string().min(1),
});

export async function updateSettingAction(
  locale: string,
  key: string,
  rawValue: string,
) {
  const parsed = jsonSettingSchema.safeParse({ key, value: rawValue });
  if (!parsed.success) return { ok: false, error: "Invalid input" };
  const { supabase, user } = await requireAdmin(locale);

  let value: unknown;
  try {
    value = JSON.parse(rawValue);
  } catch {
    return { ok: false, error: "JSON invalide" };
  }

  await supabase.from("settings").upsert({
    key,
    value: value as never,
    updated_by: user.id,
    updated_at: new Date().toISOString(),
  });
  await logAuditEvent({
    action: "admin_update_setting",
    targetType: "setting",
    targetId: key,
    afterData: { value, admin_id: user.id },
  });
  return { ok: true };
}

export async function toggleFeatureFlagAction(
  locale: string,
  flagKey: string,
  enabled: boolean,
) {
  const { supabase } = await requireAdmin(locale);
  const { data: row } = await supabase
    .from("settings")
    .select("value")
    .eq("key", "feature_flags")
    .maybeSingle();
  const existing = (row?.value as Record<string, boolean> | null) ?? {};
  const next = { ...existing, [flagKey]: enabled };
  return updateSettingAction(locale, "feature_flags", JSON.stringify(next));
}

export async function refundTransactionAction(
  locale: string,
  transactionId: string,
) {
  const { supabase, user } = await requireAdmin(locale);
  const { data: tx } = await supabase
    .from("transactions")
    .select("id, gateway, gateway_ref")
    .eq("id", transactionId)
    .single();
  if (!tx) return { ok: false, error: "Transaction not found" };

  // Placeholder refunds: provider-specific API integrations can be plugged in here.
  await supabase
    .from("transactions")
    .update({ status: "refunded" })
    .eq("id", transactionId);
  await logAuditEvent({
    action: "admin_refund_transaction",
    targetType: "transaction",
    targetId: transactionId,
    afterData: {
      gateway: tx.gateway,
      gateway_ref: tx.gateway_ref,
      admin_id: user.id,
    },
  });
  return { ok: true };
}
