import { createClient } from "@/data/supabase/server";

export type LogAuditEventInput = {
  action: string;
  targetType: string;
  targetId?: string | null;
  beforeData?: Record<string, unknown> | null;
  afterData?: Record<string, unknown> | null;
};

// Note: la fonction RPC `log_audit_event` accepte NULL côté Postgres pour les
// 3 derniers paramètres (target_id, before_data, after_data). Les types
// générés par `supabase gen types` les déclarent en non-null à cause du
// schéma SECURITY DEFINER. On garde un payload runtime correct via `?? null`
// et on neutralise la friction TS via `as never` (pattern déjà utilisé sur
// les `update(...)` du même projet).
export async function logAuditEvent(input: LogAuditEventInput) {
  const supabase = await createClient();
  const { data, error } = await supabase.rpc("log_audit_event", {
    p_action: input.action,
    p_target_type: input.targetType,
    p_target_id: (input.targetId ?? null) as never,
    p_before_data: (input.beforeData ?? null) as never,
    p_after_data: (input.afterData ?? null) as never,
  });

  if (error) {
    throw new Error(`logAuditEvent failed: ${error.message}`);
  }

  return data;
}
