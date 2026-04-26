import { refundTransactionAction } from "@/app/[locale]/(admin)/admin/actions";
import { requireAdmin } from "@/lib/admin/guards";
import type { Database } from "@/types/database";

type TxRow = Database["public"]["Tables"]["transactions"]["Row"];

type Props = {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{
    status?: string;
    gateway?: string;
    type?: string;
    from?: string;
    to?: string;
  }>;
};

export default async function AdminTransactionsPage({
  params,
  searchParams,
}: Props) {
  const [{ locale }, query] = await Promise.all([params, searchParams]);
  const { supabase } = await requireAdmin(locale);

  let req = supabase
    .from("transactions")
    .select("id,user_id,amount,currency,status,gateway,type,created_at")
    .order("created_at", { ascending: false })
    .limit(200);
  if (query.status) req = req.eq("status", query.status as TxRow["status"]);
  if (query.gateway)
    req = req.eq("gateway", query.gateway as NonNullable<TxRow["gateway"]>);
  if (query.type) req = req.eq("type", query.type as TxRow["type"]);
  if (query.from) req = req.gte("created_at", `${query.from}T00:00:00.000Z`);
  if (query.to) req = req.lte("created_at", `${query.to}T23:59:59.999Z`);

  const { data: transactions } = await req;
  const totalAmount = (transactions ?? []).reduce(
    (acc, it) => acc + Number(it.amount ?? 0),
    0,
  );

  const csv = [
    "id,user_id,amount,currency,status,gateway,type,created_at",
    ...(transactions ?? []).map(
      (it) =>
        `${it.id},${it.user_id},${it.amount},${it.currency},${it.status},${it.gateway ?? ""},${it.type},${it.created_at}`,
    ),
  ].join("\n");
  const csvHref = `data:text/csv;charset=utf-8,${encodeURIComponent(csv)}`;

  return (
    <div className="space-y-4">
      <h1 className="font-display text-ink text-2xl font-bold">Transactions</h1>
      <form className="border-line grid gap-2 rounded-xl border bg-white p-4 md:grid-cols-6">
        <input
          name="status"
          defaultValue={query.status}
          placeholder="status"
          className="border-line rounded-lg border px-2 py-1.5 text-sm"
        />
        <input
          name="gateway"
          defaultValue={query.gateway}
          placeholder="gateway"
          className="border-line rounded-lg border px-2 py-1.5 text-sm"
        />
        <input
          name="type"
          defaultValue={query.type}
          placeholder="type"
          className="border-line rounded-lg border px-2 py-1.5 text-sm"
        />
        <input
          type="date"
          name="from"
          defaultValue={query.from}
          className="border-line rounded-lg border px-2 py-1.5 text-sm"
        />
        <input
          type="date"
          name="to"
          defaultValue={query.to}
          className="border-line rounded-lg border px-2 py-1.5 text-sm"
        />
        <button className="bg-corail rounded-lg px-3 py-1.5 text-sm text-white">
          Filtrer
        </button>
      </form>

      <div className="border-line flex items-center justify-between rounded-xl border bg-white p-3">
        <p className="text-ink text-sm">
          Total cumulé visible:{" "}
          <span className="font-semibold">{totalAmount}</span>
        </p>
        <a
          href={csvHref}
          download="transactions.csv"
          className="bg-bleu rounded-lg px-3 py-1.5 text-sm text-white"
        >
          Export CSV
        </a>
      </div>

      <div className="border-line overflow-auto rounded-xl border bg-white">
        <table className="w-full min-w-[1100px] text-sm">
          <thead className="bg-creme-pale text-ink-soft text-xs">
            <tr>
              <th className="px-3 py-2 text-left">ID</th>
              <th className="px-3 py-2 text-left">Montant</th>
              <th className="px-3 py-2 text-left">Statut</th>
              <th className="px-3 py-2 text-left">Gateway</th>
              <th className="px-3 py-2 text-left">Type</th>
              <th className="px-3 py-2 text-left">Date</th>
              <th className="px-3 py-2 text-left">Action</th>
            </tr>
          </thead>
          <tbody>
            {(transactions ?? []).map((tx) => (
              <tr key={tx.id} className="border-line border-t">
                <td className="text-ink-soft px-3 py-2 text-xs">{tx.id}</td>
                <td className="px-3 py-2">
                  {tx.amount} {tx.currency}
                </td>
                <td className="px-3 py-2">{tx.status}</td>
                <td className="px-3 py-2">{tx.gateway ?? "-"}</td>
                <td className="px-3 py-2">{tx.type}</td>
                <td className="px-3 py-2">
                  {new Date(tx.created_at).toLocaleString("fr-FR")}
                </td>
                <td className="px-3 py-2">
                  <form
                    action={async () => {
                      "use server";
                      await refundTransactionAction(locale, tx.id);
                    }}
                  >
                    <button className="bg-danger/15 text-danger rounded px-2 py-1 text-xs">
                      Rembourser
                    </button>
                  </form>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
