import { createClient } from "@/data/supabase/server";
import { generateInvoice } from "@/lib/payments/actions";

type Props = {
  params: Promise<{ locale: string }>;
};

export default async function BillingPage({ params }: Props) {
  await params;
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return null;
  }

  const { data: transactions } = await supabase
    .from("transactions")
    .select("id, amount, currency, status, created_at, gateway")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false })
    .limit(50);

  return (
    <main className="bg-creme-pale min-h-screen px-6 py-8">
      <div className="mx-auto max-w-5xl">
        <h1 className="font-display text-ink text-3xl font-bold">Billing</h1>
        <p className="text-ink-soft mt-2 text-sm">
          Historique de vos transactions et factures.
        </p>
        <div className="border-line mt-6 overflow-hidden rounded-2xl border bg-white">
          <table className="w-full text-sm">
            <thead className="bg-creme-pale text-ink-soft text-xs uppercase">
              <tr>
                <th className="px-4 py-3 text-left">Date</th>
                <th className="px-4 py-3 text-left">Montant</th>
                <th className="px-4 py-3 text-left">Passerelle</th>
                <th className="px-4 py-3 text-left">Statut</th>
                <th className="px-4 py-3 text-left">Facture</th>
              </tr>
            </thead>
            <tbody>
              {(transactions ?? []).map((transaction) => (
                <tr key={transaction.id} className="border-line border-t">
                  <td className="px-4 py-3">
                    {new Date(transaction.created_at).toLocaleDateString(
                      "fr-FR",
                    )}
                  </td>
                  <td className="px-4 py-3">
                    {transaction.amount} {transaction.currency}
                  </td>
                  <td className="px-4 py-3">{transaction.gateway ?? "-"}</td>
                  <td className="px-4 py-3">{transaction.status}</td>
                  <td className="px-4 py-3">
                    <form
                      action={async () => {
                        "use server";
                        await generateInvoice(transaction.id);
                      }}
                    >
                      <button
                        type="submit"
                        className="text-bleu text-xs underline"
                      >
                        Générer PDF
                      </button>
                    </form>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </main>
  );
}
