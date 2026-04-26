"use client";

import { useEffect, useMemo, useState } from "react";

import { createClient } from "@/lib/supabase/client";

export function useRealtimeUnreadCount(userId: string | null) {
  const [count, setCount] = useState(0);
  const supabase = useMemo(() => createClient(), []);

  useEffect(() => {
    if (!userId) return;

    const refresh = async () => {
      const { data: conversations } = await supabase
        .from("conversations")
        .select("id,buyer_id,seller_id")
        .or(`buyer_id.eq.${userId},seller_id.eq.${userId}`);
      const ids = (conversations ?? []).map((c) => c.id);
      if (ids.length === 0) {
        setCount(0);
        return;
      }
      const { count: unread } = await supabase
        .from("messages")
        .select("*", { head: true, count: "exact" })
        .in("conversation_id", ids)
        .neq("sender_id", userId)
        .is("read_at", null);
      setCount(unread ?? 0);
    };

    void refresh();

    const channel = supabase
      .channel(`unread:${userId}`)
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "messages" },
        () => void refresh(),
      )
      .subscribe();

    return () => {
      void supabase.removeChannel(channel);
    };
  }, [supabase, userId]);

  return count;
}
