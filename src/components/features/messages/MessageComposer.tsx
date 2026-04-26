"use client";

import { Paperclip, SendHorizonal } from "lucide-react";
import { useRef, useState, useTransition } from "react";

import {
  sendMessage,
  uploadMessageAttachment,
} from "@/app/[locale]/(authed)/messages/actions";

type Props = {
  conversationId: string;
  onSent: (message: {
    id: string;
    sender_id: string;
    content: string;
    created_at: string;
    read_at: string | null;
    attachments: unknown;
  }) => void;
};

const suggestions = [
  "Bonjour, je suis intéressé par ce bien.",
  "Le bien est-il toujours disponible ?",
  "Puis-je le visiter ce week-end ?",
];

export function MessageComposer({ conversationId, onSent }: Props) {
  const [text, setText] = useState("");
  const [attachments, setAttachments] = useState<string[]>([]);
  const [isPending, startTransition] = useTransition();
  const fileRef = useRef<HTMLInputElement | null>(null);

  const send = () => {
    const content = text.trim();
    if (!content) return;
    startTransition(async () => {
      const result = await sendMessage({
        conversationId,
        content,
        attachments,
      });
      if (result.ok && result.message) {
        onSent(result.message);
        setText("");
        setAttachments([]);
      }
    });
  };

  return (
    <div className="border-line border-t bg-white p-3">
      <div className="mb-2 flex flex-wrap gap-2">
        {suggestions.map((suggestion) => (
          <button
            key={suggestion}
            type="button"
            className="bg-bleu-pale text-bleu rounded-full px-2.5 py-1 text-xs"
            onClick={() => setText(suggestion)}
          >
            {suggestion}
          </button>
        ))}
      </div>

      {attachments.length > 0 ? (
        <div className="mb-2 flex flex-wrap gap-2">
          {attachments.map((url) => (
            <a
              key={url}
              href={url}
              target="_blank"
              rel="noreferrer"
              className="bg-creme text-ink-soft rounded-full px-2 py-1 text-xs"
            >
              Pièce jointe
            </a>
          ))}
        </div>
      ) : null}

      <div className="flex items-end gap-2">
        <textarea
          value={text}
          rows={2}
          onChange={(event) => {
            setText(event.target.value);
            event.target.style.height = "auto";
            event.target.style.height = `${Math.min(event.target.scrollHeight, 180)}px`;
          }}
          onKeyDown={(event) => {
            if (event.ctrlKey && event.key === "Enter") {
              event.preventDefault();
              send();
            }
          }}
          className="border-line min-h-[44px] flex-1 resize-none rounded-xl border px-3 py-2 text-sm outline-none"
          placeholder="Écrire un message..."
        />
        <input
          ref={fileRef}
          type="file"
          accept="image/jpeg,image/png"
          className="hidden"
          onChange={(event) => {
            const file = event.target.files?.[0];
            if (!file) return;
            startTransition(async () => {
              const formData = new FormData();
              formData.append("conversationId", conversationId);
              formData.append("file", file);
              const res = await uploadMessageAttachment(formData);
              if (res.ok && res.url) {
                setAttachments((prev) => [...prev, res.url as string]);
              }
            });
          }}
        />
        <button
          type="button"
          className="border-line rounded-xl border bg-white p-2"
          onClick={() => fileRef.current?.click()}
          aria-label="Joindre un fichier"
        >
          <Paperclip className="text-ink h-4 w-4" />
        </button>
        <button
          type="button"
          onClick={send}
          disabled={isPending || !text.trim()}
          className="bg-corail rounded-xl p-2 text-white disabled:opacity-60"
          aria-label="Envoyer"
        >
          <SendHorizonal className="h-4 w-4" />
        </button>
      </div>
      <p className="text-ink-soft mt-1 text-[11px]">Ctrl+Entrée pour envoyer</p>
    </div>
  );
}
