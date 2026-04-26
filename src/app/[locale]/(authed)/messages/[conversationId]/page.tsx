import { notFound, redirect } from "next/navigation";

import { ConversationList } from "@/components/features/messages/ConversationList";
import { ConversationClient } from "@/components/features/messages/ConversationClient";
import { createClient } from "@/lib/supabase/server";

type Props = {
  params: Promise<{ locale: string; conversationId: string }>;
};

export default async function ConversationPage({ params }: Props) {
  const { locale, conversationId } = await params;
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    redirect(
      `/${locale}/login?redirect_to=/${locale}/messages/${conversationId}`,
    );
  }

  const { data: convo } = await supabase
    .from("conversations")
    .select("id, listing_id, buyer_id, seller_id, last_message_at, status")
    .eq("id", conversationId)
    .single();
  if (!convo || (convo.buyer_id !== user.id && convo.seller_id !== user.id))
    notFound();

  const { data: conversations } = await supabase
    .from("conversations")
    .select("id, listing_id, buyer_id, seller_id, last_message_at")
    .or(`buyer_id.eq.${user.id},seller_id.eq.${user.id}`)
    .order("last_message_at", { ascending: false });

  const listingIds = [
    ...new Set((conversations ?? []).map((c) => c.listing_id)),
  ];
  const peerIds = [
    ...new Set(
      (conversations ?? []).map((c) =>
        c.buyer_id === user.id ? c.seller_id : c.buyer_id,
      ),
    ),
  ];
  const [{ data: listings }, { data: peers }] = await Promise.all([
    listingIds.length
      ? supabase.from("listings").select("id,title,slug").in("id", listingIds)
      : Promise.resolve({
          data: [] as Array<{ id: string; title: string; slug: string | null }>,
        }),
    peerIds.length
      ? supabase
          .from("profiles")
          .select("id,full_name,avatar_url")
          .in("id", peerIds)
      : Promise.resolve({
          data: [] as Array<{
            id: string;
            full_name: string | null;
            avatar_url: string | null;
          }>,
        }),
  ]);

  const conversationIds = (conversations ?? []).map((c) => c.id);
  const [{ data: lastMessages }, { data: unreadRows }] = await Promise.all([
    conversationIds.length
      ? supabase
          .from("messages")
          .select("id,conversation_id,content,created_at")
          .in("conversation_id", conversationIds)
          .order("created_at", { ascending: false })
      : Promise.resolve({
          data: [] as Array<{
            id: string;
            conversation_id: string;
            content: string;
            created_at: string;
          }>,
        }),
    conversationIds.length
      ? supabase
          .from("messages")
          .select("conversation_id,sender_id,read_at")
          .in("conversation_id", conversationIds)
          .neq("sender_id", user.id)
          .is("read_at", null)
      : Promise.resolve({
          data: [] as Array<{
            conversation_id: string;
            sender_id: string;
            read_at: string | null;
          }>,
        }),
  ]);

  const unreadMap = new Map<string, number>();
  unreadRows?.forEach((row) =>
    unreadMap.set(
      row.conversation_id,
      (unreadMap.get(row.conversation_id) ?? 0) + 1,
    ),
  );

  const lastMap = new Map<string, { content: string; created_at: string }>();
  lastMessages?.forEach((msg) => {
    if (!lastMap.has(msg.conversation_id)) {
      lastMap.set(msg.conversation_id, {
        content: msg.content,
        created_at: msg.created_at,
      });
    }
  });

  const listItems = (conversations ?? []).map((conversation) => {
    const peerId =
      conversation.buyer_id === user.id
        ? conversation.seller_id
        : conversation.buyer_id;
    const peer = peers?.find((p) => p.id === peerId);
    const listing = listings?.find((l) => l.id === conversation.listing_id);
    const last = lastMap.get(conversation.id);
    return {
      id: conversation.id,
      listingTitle: listing?.title ?? "Annonce",
      peerName: peer?.full_name ?? "Interlocuteur",
      peerAvatar: peer?.avatar_url ?? null,
      lastMessage: last?.content ?? "Aucun message",
      lastMessageAt: last?.created_at ?? conversation.last_message_at,
      unreadCount: unreadMap.get(conversation.id) ?? 0,
    };
  });

  const { data: messages } = await supabase
    .from("messages")
    .select("id,sender_id,content,created_at,read_at,attachments")
    .eq("conversation_id", conversationId)
    .order("created_at", { ascending: true });

  const peerId = convo.buyer_id === user.id ? convo.seller_id : convo.buyer_id;
  const peer = peers?.find((p) => p.id === peerId);
  const listing = listings?.find((l) => l.id === convo.listing_id);

  return (
    <main className="bg-paper min-h-screen px-4 py-6 md:px-6">
      <div className="mx-auto max-w-6xl">
        <h1 className="font-display text-ink mb-4 text-2xl font-bold">
          Messages
        </h1>
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-[360px_1fr]">
          <div className="hidden lg:block">
            <ConversationList
              locale={locale}
              conversations={listItems}
              activeConversationId={conversationId}
            />
          </div>
          <ConversationClient
            locale={locale}
            conversationId={conversationId}
            userId={user.id}
            peerName={peer?.full_name ?? "Interlocuteur"}
            peerAvatar={peer?.avatar_url ?? null}
            listingSlug={listing?.slug ?? null}
            initialMessages={messages ?? []}
          />
        </div>
      </div>
    </main>
  );
}
