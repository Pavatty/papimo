"use server";

import { askChatbot, type ChatMessage } from "@/lib/chatbot/support";
import { isFlagEnabled } from "@/data/repositories/feature-flags";

export async function sendChatbotMessage(input: {
  history: ChatMessage[];
  message: string;
}) {
  const enabled = await isFlagEnabled("chatbot_enabled");
  if (!enabled) {
    return {
      ok: false as const,
      error: "Le chatbot est désactivé. Contactez-nous à contact@lodge.tn.",
    };
  }

  const safeHistory = Array.isArray(input.history)
    ? input.history.filter(
        (m): m is ChatMessage =>
          (m.role === "user" || m.role === "assistant") &&
          typeof m.content === "string",
      )
    : [];

  return askChatbot(safeHistory, input.message);
}
