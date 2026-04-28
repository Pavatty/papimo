import { createClient } from "@/data/supabase/server";

const DEFAULT_PUBLISH_PER_DAY = 3;

async function getDailyLimit(): Promise<number> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("app_settings")
    .select("value")
    .eq("key", "rate_limit_publish_per_day")
    .maybeSingle();
  const raw = data?.value;
  if (typeof raw === "number" && Number.isFinite(raw) && raw > 0) return raw;
  return DEFAULT_PUBLISH_PER_DAY;
}

export type RateLimitCheck =
  | { allowed: true; remaining: number; limit: number }
  | { allowed: false; remaining: 0; limit: number };

export async function checkPublishRateLimit(
  userId: string,
): Promise<RateLimitCheck> {
  const supabase = await createClient();
  const limit = await getDailyLimit();
  const today = new Date().toISOString().slice(0, 10);

  const { data: row } = await supabase
    .from("user_rate_limits")
    .select("publish_count")
    .eq("user_id", userId)
    .eq("day", today)
    .maybeSingle();

  const used = row?.publish_count ?? 0;
  if (used >= limit) {
    return { allowed: false, remaining: 0, limit };
  }
  return { allowed: true, remaining: limit - used, limit };
}

export async function incrementPublishCount(userId: string): Promise<void> {
  const supabase = await createClient();
  const today = new Date().toISOString().slice(0, 10);

  const { data: existing } = await supabase
    .from("user_rate_limits")
    .select("publish_count")
    .eq("user_id", userId)
    .eq("day", today)
    .maybeSingle();

  if (existing) {
    await supabase
      .from("user_rate_limits")
      .update({
        publish_count: existing.publish_count + 1,
        last_publish_at: new Date().toISOString(),
      })
      .eq("user_id", userId)
      .eq("day", today);
  } else {
    await supabase.from("user_rate_limits").insert({
      user_id: userId,
      day: today,
      publish_count: 1,
      last_publish_at: new Date().toISOString(),
    });
  }
}
