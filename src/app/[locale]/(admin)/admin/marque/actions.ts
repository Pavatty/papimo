"use server";

import { revalidateTag } from "next/cache";
import { z } from "zod";

import { requireAdmin } from "@/lib/admin/guards";
import { logAuditEvent } from "@/lib/audit/log";

const brandSchema = z.object({
  name: z.string().trim().min(1).max(64),
  logo_part1: z.string().trim().min(1).max(32),
  logo_part2: z.string().trim().min(1).max(32),
  tagline_fr: z.string().trim().min(1).max(200),
  tagline_ar: z.string().trim().min(1).max(200),
  tagline_en: z.string().trim().min(1).max(200),
  contact_email: z.string().trim().email().max(120),
});

export async function saveBrandSettings(
  locale: string,
  raw: unknown,
): Promise<{ ok: boolean; error?: string }> {
  const parsed = brandSchema.safeParse(raw);
  if (!parsed.success) {
    return { ok: false, error: "Champs invalides" };
  }
  const { supabase, user } = await requireAdmin(locale);

  const { error } = await supabase
    .from("app_settings")
    .update({
      value: parsed.data as never,
      updated_at: new Date().toISOString(),
      updated_by: user.id,
    })
    .eq("key", "brand");

  if (error) return { ok: false, error: error.message };

  await logAuditEvent({
    action: "admin_update_brand",
    targetType: "app_setting",
    targetId: "brand",
    afterData: { ...parsed.data, admin_id: user.id },
  });

  revalidateTag("app-settings", "default");
  return { ok: true };
}
