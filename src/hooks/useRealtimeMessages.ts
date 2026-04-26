"use client";

import { useEffect } from "react";

import { createClient } from "@/lib/supabase/client";
import type { Tables } from "@/types/database";

type MessageRow = Tables<"messages">;

export function useRealtimeMessages(
  conversationId: string,
  onNewMessage: (message: MessageRow) => void,
) {
  useEffect(() => {
    const supabase = createClient();
    const channel = supabase
      .channel(`messages:conversation_id=${conversationId}`)
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "messages",
          filter: `conversation_id=eq.${conversationId}`,
        },
        (payload) => onNewMessage(payload.new as MessageRow),
      )
      .subscribe();

    return () => {
      void supabase.removeChannel(channel);
    };
  }, [conversationId, onNewMessage]);
}
