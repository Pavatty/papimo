"use client";

import Link from "next/link";
import { useTranslations } from "next-intl";

import { useAuth } from "@/components/providers/AuthProvider";
import { useRealtimeUnreadCount } from "@/hooks/useRealtimeUnreadCount";

type Props = {
  locale: string;
};

export function UnreadMessagesBadge({ locale }: Props) {
  const t = useTranslations();
  const { user } = useAuth();
  const unread = useRealtimeUnreadCount(user?.id ?? null);

  if (!user) return null;

  return (
    <Link
      href={`/${locale}/messages`}
      className="border-line text-ink relative rounded-full border bg-white px-3 py-1.5 text-xs"
    >
      {t("navigation.messages")}
      {unread > 0 ? (
        <span className="bg-corail absolute -top-2 -right-2 rounded-full px-1.5 py-0.5 text-[10px] text-white">
          {unread > 99 ? "99+" : unread}
        </span>
      ) : null}
    </Link>
  );
}
