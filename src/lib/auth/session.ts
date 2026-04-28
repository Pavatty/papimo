import { createClient } from "@/data/supabase/server";
import type { User } from "@supabase/supabase-js";
import type { Database } from "@/types/database";

type ProfileUpsertClient = {
  from: Awaited<ReturnType<typeof createClient>>["from"];
};

export async function upsertProfileForUser(
  supabase: ProfileUpsertClient,
  user: User,
) {
  const email = user.email ?? null;
  const fullName =
    typeof user.user_metadata?.full_name === "string" &&
    user.user_metadata.full_name.trim().length > 0
      ? user.user_metadata.full_name.trim()
      : email;

  // Two-step pattern so existing rows keep their role (admins were getting
  // downgraded to "user" on every login because the previous upsert always
  // re-sent role: "user"). New rows still default to role="user" via the DB
  // column default; the explicit role on insert is a belt-and-suspenders.
  const insertPayload: Database["public"]["Tables"]["profiles"]["Insert"] = {
    id: user.id,
    email,
    full_name: fullName,
    role: "user",
  };

  await supabase
    .from("profiles")
    .upsert(insertPayload, { onConflict: "id", ignoreDuplicates: true });

  await supabase
    .from("profiles")
    .update({ email, full_name: fullName })
    .eq("id", user.id);
}

export async function ensureProfile() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { user: null, profile: null };
  }

  await upsertProfileForUser(supabase, user);

  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single();

  return { user, profile };
}

export async function getCurrentUser() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { user: null, profile: null };
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single();

  return { user, profile };
}
