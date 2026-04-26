import { createClient } from "@/lib/supabase/server";

export type LogAuditEventInput = {
  action: string;
  targetType: string;
  targetId?: string | null;
  beforeData?: Record<string, unknown> | null;
  afterData?: Record<string, unknown> | null;
};

export async function logAuditEvent(input: LogAuditEventInput) {
  const supabase = await createClient();
  const { data, error } = await supabase.rpc("log_audit_event", {
    p_action: input.action,
    p_target_type: input.targetType,
    p_target_id: input.targetId ?? null,
    p_before_data: input.beforeData ?? null,
    p_after_data: input.afterData ?? null,
  });

  if (error) {
    throw new Error(`logAuditEvent failed: ${error.message}`);
  }

  return data;
}
