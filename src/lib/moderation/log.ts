import { createClient } from "@/data/supabase/server";

type LogInput = {
  listingId: string;
  userId: string;
  decision: "approved" | "rejected" | "manual_review" | "pending";
  source: "ai_claude" | "rules" | "admin";
  reasons: string[];
  aiScore?: number | null;
  aiRaw?: string | null;
};

export async function logModeration(input: LogInput): Promise<void> {
  const supabase = await createClient();
  await supabase.from("moderation_logs").insert({
    listing_id: input.listingId,
    user_id: input.userId,
    decision: input.decision,
    source: input.source,
    reasons: input.reasons,
    ai_score: input.aiScore ?? null,
    ai_raw_response: input.aiRaw ?? null,
  });
}
