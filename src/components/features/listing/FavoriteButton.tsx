"use client";

import { Heart } from "lucide-react";
import { useTranslations } from "next-intl";
import { useState, useTransition, type MouseEvent } from "react";
import { toast } from "sonner";

import { toggleFavorite } from "@/app/[locale]/(authed)/dashboard/favoris/actions";

interface Props {
  listingId: string;
  initialFavorited?: boolean;
  isAuthenticated: boolean;
}

export function FavoriteButton({
  listingId,
  initialFavorited = false,
  isAuthenticated,
}: Props) {
  const [favorited, setFavorited] = useState(initialFavorited);
  const [pending, startTransition] = useTransition();
  const t = useTranslations("common");

  const handleClick = (e: MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!isAuthenticated) {
      toast.error(t("loginToFavorite"));
      return;
    }
    const newState = !favorited;
    setFavorited(newState);
    startTransition(async () => {
      const result = await toggleFavorite(listingId);
      if (!result.ok) {
        setFavorited(!newState);
        toast.error(result.error ?? t("saveError"));
      }
    });
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={pending}
      aria-label={favorited ? t("removeFavorite") : t("addFavorite")}
      aria-pressed={favorited}
      className={`focus-visible:ring-corail absolute top-3 left-3 z-10 inline-flex size-9 items-center justify-center rounded-full backdrop-blur-sm transition focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none ${
        favorited
          ? "bg-corail text-white"
          : "bg-blanc-casse/90 text-encre dark:bg-encre/80 dark:text-creme hover:bg-corail/10 hover:text-corail"
      }`}
    >
      <Heart className={`size-4 ${favorited ? "fill-current" : ""}`} />
    </button>
  );
}
