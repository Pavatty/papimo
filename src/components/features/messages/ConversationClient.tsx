"use client";

import { useCallback, useEffect, useState } from "react";

import { markConversationAsRead } from "@/app/[locale]/(authed)/messages/actions";
import { useRealtimeMessages } from "@/hooks/useRealtimeMessages";

import { ConversationHeader } from "./ConversationHeader";
import { MessageComposer } from "./MessageComposer";
import { MessageList } from "./MessageList";

type MessageItem = {
  id: string;
  sender_id: string;
  content: string;
  created_at: string;
  read_at: string | null;
  attachments: unknown;
};

type Props = {
  locale: string;
  conversationId: string;
  userId: string;
  peerName: string;
  peerAvatar: string | null;
  listingSlug: string | null;
  initialMessages: MessageItem[];
};

export function ConversationClient({
  locale,
  conversationId,
  userId,
  peerName,
  peerAvatar,
  listingSlug,
  initialMessages,
}: Props) {
  const [messages, setMessages] = useState(initialMessages);

  useEffect(() => {
    void markConversationAsRead(conversationId);
  }, [conversationId]);

  const onNewRealtimeMessage = useCallback((message: MessageItem) => {
    setMessages((prev) =>
      prev.some((msg) => msg.id === message.id) ? prev : [...prev, message],
    );
  }, []);
  useRealtimeMessages(conversationId, onNewRealtimeMessage);

  return (
    <div className="border-line bg-paper flex h-[calc(100vh-8rem)] flex-col overflow-hidden rounded-2xl border">
      <ConversationHeader
        locale={locale}
        conversationId={conversationId}
        listingSlug={listingSlug}
        peerName={peerName}
        peerAvatar={peerAvatar}
      />
      <MessageList userId={userId} messages={messages} />
      <MessageComposer
        conversationId={conversationId}
        onSent={(message) => setMessages((prev) => [...prev, message])}
      />
    </div>
  );
}
