"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { createClient } from "@/data/supabase/server";

export async function updateProfile(formData: FormData) {
  const supabase = await createClient();
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();
  if (authError || !user) redirect("/fr/login");

  const accountType = (formData.get("account_type") as string) || "individual";
  const isPro = accountType === "professional";
  const updates = {
    full_name: formData.get("full_name") as string,
    phone: formData.get("phone") as string,
    bio: formData.get("bio") as string,
    preferred_language: formData.get("preferred_language") as string,
    notifications_email: formData.get("notifications_email") === "on",
    notifications_push: formData.get("notifications_push") === "on",
    account_type: accountType,
    company_name: isPro
      ? ((formData.get("company_name") as string) ?? null)
      : null,
    tax_id: isPro ? ((formData.get("tax_id") as string) ?? null) : null,
    sector: isPro ? ((formData.get("sector") as string) ?? null) : null,
    pro_address: isPro
      ? ((formData.get("pro_address") as string) ?? null)
      : null,
    pro_rib: isPro ? ((formData.get("pro_rib") as string) ?? null) : null,
    updated_at: new Date().toISOString(),
  };

  const { error } = await supabase
    .from("profiles")
    .update(updates as never)
    .eq("id", user.id);

  if (error) {
    return { success: false, error: error.message };
  }

  revalidatePath("/fr/profile/edit");
  revalidatePath("/fr/dashboard");
  return { success: true };
}

export async function uploadAvatar(formData: FormData) {
  const supabase = await createClient();
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();
  if (authError || !user) redirect("/fr/login");

  const file = formData.get("avatar") as File;
  if (!file || file.size === 0) {
    return { success: false, error: "No file" };
  }

  const ext = file.name.split(".").pop();
  const path = `${user.id}/avatar.${ext}`;

  const { error: uploadError } = await supabase.storage
    .from("avatars")
    .upload(path, file, { upsert: true, cacheControl: "3600" });

  if (uploadError) {
    return { success: false, error: uploadError.message };
  }

  const {
    data: { publicUrl },
  } = supabase.storage.from("avatars").getPublicUrl(path);

  const { error: updateError } = await supabase
    .from("profiles")
    .update({ avatar_url: publicUrl, updated_at: new Date().toISOString() })
    .eq("id", user.id);

  if (updateError) {
    return { success: false, error: updateError.message };
  }

  revalidatePath("/fr/profile/edit");
  revalidatePath("/fr/dashboard");
  return { success: true, url: publicUrl };
}
