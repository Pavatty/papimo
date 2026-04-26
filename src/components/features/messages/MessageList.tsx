"use client";

import { useEffect, useRef } from "react";

type MessageItem = {
  id: string;
  sender_id: string;
  content: string;
  created_at: string;
  read_at: string | null;
  attachments: unknown;
};

type Props = {
  userId: string;
  messages: MessageItem[];
};

export function MessageList({ userId, messages }: Props) {
  const bottomRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages.length]);

  return (
    <div className="bg-creme-pale flex-1 overflow-y-auto p-3">
      <div className="space-y-2">
        {messages.map((message) => {
          const mine = message.sender_id === userId;
          const attachments = Array.isArray(message.attachments)
            ? (message.attachments as string[])
            : [];
          return (
            <div
              key={message.id}
              className={`flex ${mine ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`max-w-[82%] rounded-2xl px-3 py-2 text-sm ${
                  mine ? "bg-bleu text-white" : "bg-corail-soft text-ink"
                }`}
              >
                <p className="whitespace-pre-wrap">{message.content}</p>
                {attachments.length > 0 ? (
                  <div className="mt-2 space-y-1">
                    {attachments.map((url) => (
                      <a
                        key={url}
                        href={url}
                        target="_blank"
                        rel="noreferrer"
                        className={`block text-xs underline ${mine ? "text-white/90" : "text-bleu"}`}
                      >
                        Pièce jointe
                      </a>
                    ))}
                  </div>
                ) : null}
                <p
                  className={`mt-1 text-[11px] ${mine ? "text-white/80" : "text-ink-soft"}`}
                >
                  {new Date(message.created_at).toLocaleTimeString("fr-FR", {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                  {mine ? ` • ${message.read_at ? "lu" : "envoyé"}` : ""}
                </p>
              </div>
            </div>
          );
        })}
        <div ref={bottomRef} />
      </div>
    </div>
  );
}
