import { forbidden, redirect } from "next/navigation";

import { createClient } from "@/data/supabase/server";

export async function requireAdmin(locale?: string) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    if (locale) redirect(`/${locale}/login?reason=unauthorized`);
    throw new Error("Unauthorized");
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("id, role, full_name, email, avatar_url")
    .eq("id", user.id)
    .single();

  if (!profile || profile.role !== "admin") {
    forbidden();
  }

  return { user, profile, supabase };
}
