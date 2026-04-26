"use server";

import { z } from "zod";

import { moderateMessageAsync } from "@/lib/messages/moderate-message";
import { createClient } from "@/lib/supabase/server";

const sendMessageSchema = z.object({
  conversationId: z.string().uuid(),
  content: z.string().min(1).max(4000),
  attachments: z.array(z.string().url()).max(3).default([]),
});

export async function sendMessage(input: z.infer<typeof sendMessageSchema>) {
  const parsed = sendMessageSchema.safeParse(input);
  if (!parsed.success)
    return { ok: false, error: parsed.error.issues[0]?.message };

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { ok: false, error: "Unauthorized" };

  const { data: convo } = await supabase
    .from("conversations")
    .select("id, buyer_id, seller_id")
    .eq("id", parsed.data.conversationId)
    .single();
  if (!convo || (convo.buyer_id !== user.id && convo.seller_id !== user.id)) {
    return { ok: false, error: "Forbidden" };
  }

  const moderation = await moderateMessageAsync(parsed.data.content);
  const { data: inserted, error } = await supabase
    .from("messages")
    .insert({
      conversation_id: parsed.data.conversationId,
      sender_id: user.id,
      content: parsed.data.content,
      attachments: parsed.data.attachments,
      flagged: moderation.flagged,
      flag_reason: moderation.flagged ? "suspicious_contact_or_payment" : null,
    })
    .select("*")
    .single();

  if (error) return { ok: false, error: error.message };

  await supabase
    .from("conversations")
    .update({ last_message_at: new Date().toISOString() })
    .eq("id", parsed.data.conversationId);

  if (moderation.flagged) {
    const { count } = await supabase
      .from("messages")
      .select("*", { count: "exact", head: true })
      .eq("conversation_id", parsed.data.conversationId)
      .eq("flagged", true);

    if ((count ?? 0) >= 5) {
      await supabase
        .from("conversations")
        .update({ status: "blocked" })
        .eq("id", parsed.data.conversationId);
    }
  }

  return { ok: true, message: inserted };
}

export async function createOrGetConversation(
  listingId: string,
  sellerId: string,
) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { ok: false, error: "Unauthorized" };

  if (user.id === sellerId)
    return { ok: false, error: "Cannot message yourself" };

  const { data: existing } = await supabase
    .from("conversations")
    .select("id")
    .eq("listing_id", listingId)
    .eq("buyer_id", user.id)
    .eq("seller_id", sellerId)
    .maybeSingle();

  if (existing) return { ok: true, conversationId: existing.id };

  const { data: created, error } = await supabase
    .from("conversations")
    .insert({
      listing_id: listingId,
      buyer_id: user.id,
      seller_id: sellerId,
      status: "active",
    })
    .select("id")
    .single();

  if (error) return { ok: false, error: error.message };
  return { ok: true, conversationId: created.id };
}

export async function markConversationAsRead(conversationId: string) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { ok: false, error: "Unauthorized" };

  const { data: convo } = await supabase
    .from("conversations")
    .select("buyer_id, seller_id")
    .eq("id", conversationId)
    .single();
  if (!convo || (convo.buyer_id !== user.id && convo.seller_id !== user.id)) {
    return { ok: false, error: "Forbidden" };
  }

  await supabase
    .from("messages")
    .update({ read_at: new Date().toISOString() })
    .eq("conversation_id", conversationId)
    .neq("sender_id", user.id)
    .is("read_at", null);

  return { ok: true };
}

export async function signalConversation(
  conversationId: string,
  reason: string,
) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { ok: false, error: "Unauthorized" };

  const { data: convo } = await supabase
    .from("conversations")
    .select("buyer_id, seller_id, listing_id")
    .eq("id", conversationId)
    .single();
  if (!convo || (convo.buyer_id !== user.id && convo.seller_id !== user.id)) {
    return { ok: false, error: "Forbidden" };
  }

  await supabase
    .from("conversations")
    .update({ status: "blocked" })
    .eq("id", conversationId);
  await supabase.from("reports").insert({
    listing_id: convo.listing_id,
    reporter_id: user.id,
    reason: reason || "conversation_signal",
    details: "Signalement conversation",
  });

  return { ok: true };
}

export async function uploadMessageAttachment(formData: FormData) {
  const conversationId = String(formData.get("conversationId") ?? "");
  const file = formData.get("file");
  if (!conversationId || !(file instanceof File)) {
    return { ok: false, error: "Missing params" };
  }
  if (!["image/jpeg", "image/png"].includes(file.type)) {
    return { ok: false, error: "Only jpg/png allowed" };
  }
  if (file.size > 5 * 1024 * 1024) {
    return { ok: false, error: "Max file size is 5MB" };
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { ok: false, error: "Unauthorized" };

  const { data: convo } = await supabase
    .from("conversations")
    .select("buyer_id, seller_id")
    .eq("id", conversationId)
    .single();
  if (!convo || (convo.buyer_id !== user.id && convo.seller_id !== user.id)) {
    return { ok: false, error: "Forbidden" };
  }

  const ext = file.name.split(".").pop() ?? "jpg";
  const objectPath = `${conversationId}/${user.id}/${Date.now()}.${ext}`;
  const { error } = await supabase.storage
    .from("messages")
    .upload(objectPath, file, {
      contentType: file.type,
    });
  if (error) return { ok: false, error: error.message };

  const { data } = supabase.storage.from("messages").getPublicUrl(objectPath);
  return { ok: true, url: data.publicUrl };
}
