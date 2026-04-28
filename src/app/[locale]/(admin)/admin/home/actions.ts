"use server";

import { revalidateTag } from "next/cache";

import { requireAdmin } from "@/lib/admin/guards";
import { logAuditEvent } from "@/lib/audit/log";

type SupabaseCmsClient = {
  from: (table: "cms_home_sections") => {
    update: (payload: Record<string, unknown>) => {
      eq: (
        col: string,
        value: string,
      ) => Promise<{
        error: { message: string } | null;
      }>;
    };
  };
};

export async function updateHomeSection(
  locale: string,
  id: string,
  payload: {
    content_json?: Record<string, unknown>;
    sort_order?: number;
    active?: boolean;
  },
): Promise<{ ok: boolean; error?: string }> {
  const { supabase, user } = await requireAdmin(locale);
  const cms = supabase as unknown as SupabaseCmsClient;
  const updatePayload: Record<string, unknown> = {
    updated_at: new Date().toISOString(),
  };
  if (payload.content_json !== undefined)
    updatePayload.content_json = payload.content_json;
  if (payload.sort_order !== undefined)
    updatePayload.sort_order = payload.sort_order;
  if (payload.active !== undefined) updatePayload.active = payload.active;

  const { error } = await cms
    .from("cms_home_sections")
    .update(updatePayload)
    .eq("id", id);

  if (error) return { ok: false, error: error.message };

  await logAuditEvent({
    action: "admin_update_cms_home_section",
    targetType: "cms_home_section",
    targetId: id,
    afterData: { ...payload, admin_id: user.id },
  });

  revalidateTag("cms_home", "default");
  return { ok: true };
}

export async function toggleHomeSectionActive(
  locale: string,
  id: string,
  active: boolean,
): Promise<{ ok: boolean; error?: string }> {
  return updateHomeSection(locale, id, { active });
}
