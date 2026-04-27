import Link from "next/link";
import { CheckCircle2 } from "lucide-react";

import { createClient } from "@/data/supabase/server";

type Props = {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ ref?: string }>;
};

export default async function CheckoutSuccessPage({
  params,
  searchParams,
}: Props) {
  const [{ locale }, query] = await Promise.all([params, searchParams]);
  const supabase = await createClient();
  const ref = query.ref ?? "";

  const { data: transaction } = ref
    ? await supabase
        .from("transactions")
        .select("id, amount, currency, status, created_at, metadata")
        .eq("id", ref)
        .maybeSingle()
    : { data: null };

  return (
    <main className="bg-creme min-h-screen px-6 py-10">
      <div className="border-line bg-paper mx-auto max-w-2xl rounded-2xl border p-6 text-center">
        <CheckCircle2 className="text-green mx-auto h-14 w-14" />
        <h1 className="font-display text-ink mt-4 text-2xl font-bold">
          Paiement confirmé
        </h1>
        <p className="text-ink-soft mt-2 text-sm">
          Votre transaction a été vérifiée côté serveur.
        </p>
        {transaction ? (
          <div className="bg-creme-pale mt-5 rounded-xl p-4 text-left text-sm">
            <p>Réf: {transaction.id}</p>
            <p>
              Montant: {transaction.amount} {transaction.currency}
            </p>
            <p>Statut: {transaction.status}</p>
          </div>
        ) : null}

        <Link
          href={`/${locale}/dashboard`}
          className="bg-corail mt-6 inline-flex rounded-xl px-4 py-2.5 text-sm font-semibold text-white"
        >
          Voir mon annonce
        </Link>
      </div>
    </main>
  );
}
