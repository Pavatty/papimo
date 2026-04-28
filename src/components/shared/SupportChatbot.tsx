"use client";

import { AnimatePresence, motion } from "framer-motion";
import { MessageCircle, Send, X } from "lucide-react";
import { useState } from "react";

import { sendChatbotMessage } from "@/app/actions/chatbot";
import type { ChatMessage } from "@/lib/chatbot/support";
import { cn } from "@/lib/utils";

const INITIAL_GREETING: ChatMessage = {
  role: "assistant",
  content:
    "Bonjour ! Je suis l'assistant LODGE. Je peux vous aider sur la publication d'annonces, la sécurité, les plans, ou les outils. Que souhaitez-vous savoir ?",
};

export function SupportChatbot() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([INITIAL_GREETING]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const send = async () => {
    const text = input.trim();
    if (!text || loading) return;
    const userMsg: ChatMessage = { role: "user", content: text };
    const nextHistory = [...messages, userMsg];
    setMessages(nextHistory);
    setInput("");
    setLoading(true);
    setError(null);

    const result = await sendChatbotMessage({
      history: messages,
      message: text,
    });
    setLoading(false);
    if (result.ok) {
      setMessages([
        ...nextHistory,
        { role: "assistant", content: result.reply },
      ]);
    } else {
      setError(result.error);
    }
  };

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-label={open ? "Fermer l'assistant" : "Ouvrir l'assistant"}
        className="bg-vert hover:bg-vert/90 focus-visible:ring-vert fixed right-4 bottom-4 z-40 inline-flex h-14 w-14 items-center justify-center rounded-full text-white shadow-lg transition focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none"
      >
        {open ? (
          <X className="h-6 w-6" />
        ) : (
          <MessageCircle className="h-6 w-6" />
        )}
      </button>

      <AnimatePresence>
        {open ? (
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 16 }}
            transition={{ duration: 0.18 }}
            role="dialog"
            aria-label="Assistant LODGE"
            className="bg-blanc-casse dark:bg-encre rounded-card border-bordurewarm-tertiary dark:border-encre/40 fixed right-4 bottom-20 z-40 flex h-[28rem] w-[22rem] max-w-[92vw] flex-col overflow-hidden border shadow-2xl"
          >
            <div className="bg-vert flex items-center justify-between px-4 py-3 text-white">
              <p className="text-sm font-semibold">Assistant LODGE</p>
              <span className="text-[10px] font-medium opacity-80">
                IA · 24/7
              </span>
            </div>

            <div className="flex-1 space-y-3 overflow-y-auto px-3 py-3">
              {messages.map((m, i) => (
                <div
                  key={i}
                  className={cn(
                    "flex",
                    m.role === "user" ? "justify-end" : "justify-start",
                  )}
                >
                  <p
                    className={cn(
                      "rounded-2xl px-3 py-2 text-sm leading-relaxed",
                      "max-w-[80%] whitespace-pre-line",
                      m.role === "user"
                        ? "bg-vert text-white"
                        : "bg-creme-foncee text-encre dark:bg-encre/40 dark:text-creme",
                    )}
                  >
                    {m.content}
                  </p>
                </div>
              ))}
              {loading ? (
                <div className="flex justify-start">
                  <p className="bg-creme-foncee text-encre/60 dark:bg-encre/40 dark:text-creme/60 rounded-2xl px-3 py-2 text-xs italic">
                    L&apos;assistant tape…
                  </p>
                </div>
              ) : null}
              {error ? (
                <p className="bg-coeur-soft text-coeur rounded-md px-3 py-2 text-xs">
                  {error}
                </p>
              ) : null}
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                void send();
              }}
              className="border-bordurewarm-tertiary dark:border-encre/40 flex items-center gap-2 border-t p-3"
            >
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Posez votre question…"
                maxLength={1000}
                disabled={loading}
                className="border-bordurewarm-tertiary text-encre placeholder:text-encre/40 focus:border-vert dark:border-encre/40 dark:bg-encre/30 dark:text-creme flex-1 rounded-md border bg-white px-3 py-2 text-sm focus:outline-none disabled:opacity-50"
              />
              <button
                type="submit"
                disabled={loading || !input.trim()}
                aria-label="Envoyer"
                className="bg-vert hover:bg-vert/90 inline-flex h-9 w-9 items-center justify-center rounded-md text-white transition disabled:opacity-50"
              >
                <Send className="h-4 w-4" />
              </button>
            </form>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </>
  );
}
