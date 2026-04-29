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
      <div className="bg-lodge-50 rounded-xl p-6 text-center">
        <MailCheck className="text-lodge mx-auto mb-3 h-10 w-10" />
        <h3 className="text-ink text-lg font-medium">
          Vérifiez votre boîte mail
        </h3>
        <p className="mt-2 text-sm text-gray-500">
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
        className="focus:border-lodge focus:ring-lodge w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-sm outline-none focus:ring-1"
        placeholder="prenom@exemple.com"
        required
      />
      {error ? <p className="text-coeur text-sm">{error}</p> : null}
      <button
        type="submit"
        disabled={isPending}
        className="bg-lodge hover:bg-lodge-700 inline-flex w-full items-center justify-center rounded-full px-4 py-3 text-sm font-medium text-white transition-colors disabled:opacity-60"
      >
        {isPending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
        Continuer
      </button>
    </form>
  );
}
