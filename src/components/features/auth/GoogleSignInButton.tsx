"use client";

import { Globe, Loader2 } from "lucide-react";
import { useTransition } from "react";

import { signInWithGoogleAction } from "@/lib/auth/actions";

export function GoogleSignInButton() {
  const [isPending, startTransition] = useTransition();

  return (
    <button
      type="button"
      onClick={() =>
        startTransition(async () => {
          const result = await signInWithGoogleAction();
          if (result.ok && result.url) {
            window.location.href = result.url;
          }
        })
      }
      className="border-line text-ink inline-flex w-full items-center justify-center rounded-xl border bg-white px-4 py-3 text-sm font-medium"
      disabled={isPending}
    >
      {isPending ? (
        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
      ) : (
        <Globe className="mr-2 h-4 w-4" />
      )}
      Continuer avec Google
    </button>
  );
}
