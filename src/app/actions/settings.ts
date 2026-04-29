"use server";

import { revalidateTag } from "next/cache";
import { z } from "zod";

import { requireAdmin } from "@/lib/admin/guards";

const updateSchema = z.object({
  key: z.string().min(3).max(100),
  value: z.string().max(10000),
});

type JsonScalar = string | number | boolean | null;
type JsonValue = JsonScalar | JsonValue[] | { [key: string]: JsonValue };

function tryParseJson(value: string): JsonValue {
  const trimmed = value.trim();
  if (trimmed === "true") return true;
  if (trimmed === "false") return false;
  if (trimmed === "null") return null;
  if (/^-?\d+(\.\d+)?$/.test(trimmed)) return Number(trimmed);
  if (
    (trimmed.startsWith("{") && trimmed.endsWith("}")) ||
    (trimmed.startsWith("[") && trimmed.endsWith("]"))
  ) {
    try {
      return JSON.parse(trimmed) as JsonValue;
    } catch {
      return value;
    }
  }
  return value;
}

export async function updateSetting(input: { key: string; value: string }) {
  const parsed = updateSchema.safeParse(input);
  if (!parsed.success) {
    return {
      ok: false as const,
      error: parsed.error.issues[0]?.message ?? "Invalid input",
    };
  }

  const { supabase, user } = await requireAdmin();

  const jsonValue = tryParseJson(parsed.data.value);

  const { error } = await supabase
    .from("app_settings")
    .update({
      value: jsonValue,
      updated_at: new Date().toISOString(),
      updated_by: user.id,
    })
    .eq("key", parsed.data.key);

  if (error) {
    return { ok: false as const, error: error.message };
  }

  revalidateTag("app_settings", "default");
  return { ok: true as const };
}
