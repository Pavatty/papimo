"use client";

import { Search } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { useMemo, useState } from "react";

type ConversationItem = {
  id: string;
  listingTitle: string;
  peerName: string;
  peerAvatar: string | null;
  lastMessage: string;
  lastMessageAt: string;
  unreadCount: number;
};

type Props = {
  locale: string;
  conversations: ConversationItem[];
  activeConversationId?: string;
};

export function ConversationList({
  locale,
  conversations,
  activeConversationId,
}: Props) {
  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return conversations;
    return conversations.filter(
      (c) =>
        c.peerName.toLowerCase().includes(q) ||
        c.listingTitle.toLowerCase().includes(q) ||
        c.lastMessage.toLowerCase().includes(q),
    );
  }, [conversations, query]);

  return (
    <div className="border-line bg-paper flex h-full flex-col rounded-2xl border">
      <div className="border-line border-b p-3">
        <div className="relative">
          <Search className="text-ink-soft pointer-events-none absolute top-2.5 left-2.5 h-4 w-4" />
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            className="border-line w-full rounded-lg border bg-white py-2 pr-3 pl-8 text-sm outline-none"
            placeholder="Rechercher une conversation"
          />
        </div>
      </div>

      <div className="overflow-y-auto">
        {filtered.map((conversation) => (
          <Link
            key={conversation.id}
            href={`/${locale}/messages/${conversation.id}`}
            className={`border-line flex items-start gap-3 border-b px-3 py-3 ${
              conversation.id === activeConversationId
                ? "bg-bleu-pale"
                : "hover:bg-creme-pale"
            }`}
          >
            <div className="border-line bg-creme h-10 w-10 overflow-hidden rounded-full border">
              {conversation.peerAvatar ? (
                <Image
                  src={conversation.peerAvatar}
                  alt={conversation.peerName}
                  width={40}
                  height={40}
                  className="h-full w-full object-cover"
                />
              ) : null}
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex items-center justify-between gap-2">
                <p className="text-ink truncate text-sm font-semibold">
                  {conversation.peerName}
                </p>
                <span className="text-ink-soft text-xs">
                  {new Date(conversation.lastMessageAt).toLocaleTimeString(
                    "fr-FR",
                    {
                      hour: "2-digit",
                      minute: "2-digit",
                    },
                  )}
                </span>
              </div>
              <p className="text-ink-soft truncate text-xs">
                {conversation.lastMessage}
              </p>
              <p className="text-ink-soft truncate text-[11px]">
                {conversation.listingTitle}
              </p>
            </div>
            {conversation.unreadCount > 0 ? (
              <span className="bg-corail rounded-full px-2 py-0.5 text-xs text-white">
                {conversation.unreadCount}
              </span>
            ) : null}
          </Link>
        ))}
      </div>
    </div>
  );
}
