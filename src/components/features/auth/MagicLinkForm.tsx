"use client";

import { Loader2, MailCheck } from "lucide-react";
import { useState, useTransition } from "react";

import { sendMagicLink } from "@/lib/auth/actions";

export function MagicLinkForm() {
  const [email, setEmail] = useState("");
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const onSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);

    startTransition(async () => {
      const result = await sendMagicLink(email);
      if (!result.ok) {
        // UX volontairement neutre pour ne pas exposer d'information sur les comptes.
        setError(result.error ?? null);
      }
      setSuccess(true);
    });
  };

  if (success) {
    return (
      <div className="border-line bg-paper rounded-2xl border p-6 text-center">
        <MailCheck className="text-bleu mx-auto mb-3 h-10 w-10" />
        <h3 className="font-display text-ink text-xl font-semibold">
          Vérifiez votre boîte mail
        </h3>
        <p className="text-ink-soft mt-2 text-sm">
          Un lien de connexion LODGE vient d&#39;être envoyé.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className="space-y-3">
      <label className="text-ink text-sm font-medium" htmlFor="email">
        Email
      </label>
      <input
        id="email"
        type="email"
        value={email}
        onChange={(event) => setEmail(event.target.value)}
        className="border-line focus:border-bleu w-full rounded-xl border bg-white px-4 py-3 outline-none"
        placeholder="prenom@exemple.com"
        required
      />
      {error ? <p className="text-danger text-sm">{error}</p> : null}
      <button
        type="submit"
        disabled={isPending}
        className="bg-corail hover:bg-corail/90 inline-flex w-full items-center justify-center rounded-xl px-4 py-3 text-sm font-semibold text-white disabled:opacity-60"
      >
        {isPending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
        Continuer
      </button>
    </form>
  );
}
