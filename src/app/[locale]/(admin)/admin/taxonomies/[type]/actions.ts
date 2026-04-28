"use server";

import { revalidateTag } from "next/cache";
import { z } from "zod";

import { requireAdmin } from "@/lib/admin/guards";
import { logAuditEvent } from "@/lib/audit/log";

import type { TaxonomyKind } from "./TaxonomyCrudClient";

const VALID_KINDS = [
  "transaction_types",
  "property_types",
  "amenities",
] as const;

function isValidKind(k: string): k is TaxonomyKind {
  return (VALID_KINDS as readonly string[]).includes(k);
}

const updateSchema = z.object({
  label_fr: z.string().trim().min(1).max(120).optional(),
  label_ar: z.string().trim().min(1).max(120).optional(),
  label_en: z.string().trim().min(1).max(120).optional(),
  sort_order: z.number().int().min(0).max(10000).optional(),
});

export async function updateTaxonomyRow(
  locale: string,
  kind: string,
  id: string,
  data: unknown,
): Promise<{ ok: boolean; error?: string }> {
  if (!isValidKind(kind)) return { ok: false, error: "Invalid table" };
  const parsed = updateSchema.safeParse(data);
  if (!parsed.success) return { ok: false, error: "Champs invalides" };

  const { supabase, user } = await requireAdmin(locale);
  const payload: Record<string, unknown> = {
    updated_at: new Date().toISOString(),
  };
  if (parsed.data.label_fr !== undefined)
    payload.label_fr = parsed.data.label_fr;
  if (parsed.data.label_ar !== undefined)
    payload.label_ar = parsed.data.label_ar;
  if (parsed.data.label_en !== undefined)
    payload.label_en = parsed.data.label_en;
  if (parsed.data.sort_order !== undefined)
    payload.sort_order = parsed.data.sort_order;

  const { error } =
    kind === "transaction_types"
      ? await supabase
          .from("transaction_types")
          .update(payload as never)
          .eq("id", id)
      : kind === "property_types"
        ? await supabase
            .from("property_types")
            .update(payload as never)
            .eq("id", id)
        : await supabase
            .from("amenities")
            .update(payload as never)
            .eq("id", id);

  if (error) return { ok: false, error: error.message };

  await logAuditEvent({
    action: "admin_update_taxonomy",
    targetType: kind,
    targetId: id,
    afterData: { ...parsed.data, admin_id: user.id },
  });

  revalidateTag("taxonomies", "default");
  revalidateTag(kind.replace("_", "-"), "default");
  return { ok: true };
}

export async function toggleTaxonomyActive(
  locale: string,
  kind: string,
  id: string,
  active: boolean,
): Promise<{ ok: boolean; error?: string }> {
  if (!isValidKind(kind)) return { ok: false, error: "Invalid table" };
  const { supabase, user } = await requireAdmin(locale);

  const payload = { is_active: active, updated_at: new Date().toISOString() };

  const { error } =
    kind === "transaction_types"
      ? await supabase.from("transaction_types").update(payload).eq("id", id)
      : kind === "property_types"
        ? await supabase.from("property_types").update(payload).eq("id", id)
        : await supabase.from("amenities").update(payload).eq("id", id);

  if (error) return { ok: false, error: error.message };

  await logAuditEvent({
    action: "admin_toggle_taxonomy",
    targetType: kind,
    targetId: id,
    afterData: { is_active: active, admin_id: user.id },
  });

  revalidateTag("taxonomies", "default");
  revalidateTag(kind.replace("_", "-"), "default");
  return { ok: true };
}
