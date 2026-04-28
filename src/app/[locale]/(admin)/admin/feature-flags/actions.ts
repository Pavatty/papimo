"use server";

import { revalidateTag } from "next/cache";

import { requireAdmin } from "@/lib/admin/guards";
import { logAuditEvent } from "@/lib/audit/log";

export async function toggleFeatureFlag(
  locale: string,
  key: string,
  enabled: boolean,
): Promise<{ ok: boolean; error?: string }> {
  const { supabase, user } = await requireAdmin(locale);

  const { error } = await supabase
    .from("feature_flags")
    .update({
      enabled,
      updated_at: new Date().toISOString(),
      updated_by: user.id,
    })
    .eq("key", key);

  if (error) return { ok: false, error: error.message };

  await logAuditEvent({
    action: "admin_toggle_feature_flag",
    targetType: "feature_flag",
    targetId: key,
    afterData: { enabled, admin_id: user.id },
  });

  revalidateTag("feature-flags", "default");
  return { ok: true };
}
