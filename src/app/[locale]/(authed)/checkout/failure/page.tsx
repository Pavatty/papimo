import Link from "next/link";
import { AlertTriangle } from "lucide-react";

import { createClient } from "@/data/supabase/server";

type Props = {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ ref?: string }>;
};

export default async function CheckoutFailurePage({
  params,
  searchParams,
}: Props) {
  const [{ locale }, query] = await Promise.all([params, searchParams]);
  const supabase = await createClient();
  const ref = query.ref ?? "";

  const { data: transaction } = ref
    ? await supabase
        .from("transactions")
        .select("id, status, gateway_response")
        .eq("id", ref)
        .maybeSingle()
    : { data: null };

  return (
    <main className="bg-creme min-h-screen px-6 py-10">
      <div className="border-line bg-paper mx-auto max-w-2xl rounded-2xl border p-6 text-center">
        <AlertTriangle className="text-danger mx-auto h-14 w-14" />
        <h1 className="font-display text-ink mt-4 text-2xl font-bold">
          Échec du paiement
        </h1>
        <p className="text-ink-soft mt-2 text-sm">
          Le paiement n&#39;a pas abouti. Vous pouvez réessayer.
        </p>
        {transaction ? (
          <div className="bg-creme-pale mt-5 rounded-xl p-4 text-left text-sm">
            <p>Réf: {transaction.id}</p>
            <p>Statut: {transaction.status}</p>
          </div>
        ) : null}
        <div className="mt-6 flex justify-center gap-2">
          <Link
            href={`/${locale}/checkout`}
            className="bg-corail rounded-xl px-4 py-2.5 text-sm font-semibold text-white"
          >
            Réessayer
          </Link>
          <Link
            href={`/${locale}/messages`}
            className="border-line text-ink rounded-xl border bg-white px-4 py-2.5 text-sm"
          >
            Contacter le support
          </Link>
        </div>
      </div>
    </main>
  );
}
