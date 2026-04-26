"use client";

import { Ban, Flag } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { useTransition } from "react";

import { signalConversation } from "@/app/[locale]/(authed)/messages/actions";

type Props = {
  locale: string;
  conversationId: string;
  listingSlug: string | null;
  peerName: string;
  peerAvatar: string | null;
};

export function ConversationHeader({
  locale,
  conversationId,
  listingSlug,
  peerName,
  peerAvatar,
}: Props) {
  const [isPending, startTransition] = useTransition();
  return (
    <div className="border-line flex items-center justify-between border-b bg-white p-3">
      <div className="flex items-center gap-3">
        <div className="border-line bg-creme h-10 w-10 overflow-hidden rounded-full border">
          {peerAvatar ? (
            <Image
              src={peerAvatar}
              alt={peerName}
              width={40}
              height={40}
              className="h-full w-full object-cover"
            />
          ) : null}
        </div>
        <div>
          <p className="text-ink text-sm font-semibold">{peerName}</p>
          {listingSlug ? (
            <Link
              className="text-bleu text-xs underline-offset-2 hover:underline"
              href={`/${locale}/listings/${listingSlug}`}
            >
              Voir l&#39;annonce
            </Link>
          ) : null}
        </div>
      </div>
      <div className="flex items-center gap-2">
        <button
          type="button"
          className="border-line rounded-lg border px-2 py-1 text-xs"
          onClick={() =>
            startTransition(async () => {
              await signalConversation(conversationId, "conversation_signal");
            })
          }
          disabled={isPending}
        >
          <Flag className="mr-1 inline h-3.5 w-3.5" />
          Signaler
        </button>
        <button
          type="button"
          className="border-line rounded-lg border px-2 py-1 text-xs"
          onClick={() =>
            startTransition(async () => {
              await signalConversation(conversationId, "conversation_block");
            })
          }
          disabled={isPending}
        >
          <Ban className="mr-1 inline h-3.5 w-3.5" />
          Bloquer
        </button>
      </div>
    </div>
  );
}
