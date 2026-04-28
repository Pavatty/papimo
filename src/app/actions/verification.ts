"use server";

import { z } from "zod";

import { createClient } from "@/data/supabase/server";
import { getCurrentUser } from "@/data/supabase/session";

const submitSchema = z.object({
  documentType: z.enum(["passport", "id_card", "drivers_license", "selfie"]),
  documentUrl: z.string().url(),
});

export type SubmitVerificationInput = z.infer<typeof submitSchema>;

export async function submitVerification(input: SubmitVerificationInput) {
  const parsed = submitSchema.safeParse(input);
  if (!parsed.success) {
    return {
      ok: false as const,
      error: parsed.error.issues[0]?.message ?? "Invalid input",
    };
  }
  const user = await getCurrentUser();
  if (!user) return { ok: false as const, error: "Non connecté" };

  const supabase = await createClient();
  const { error } = await supabase.from("verification_documents").insert({
    user_id: user.id,
    document_type: parsed.data.documentType,
    document_url: parsed.data.documentUrl,
    status: "pending",
  });

  if (error) return { ok: false as const, error: error.message };
  return { ok: true as const };
}
