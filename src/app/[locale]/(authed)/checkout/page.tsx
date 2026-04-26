type Props = {
  searchParams: Promise<{ type?: string; listingId?: string }>;
};

export default async function CheckoutPage({ searchParams }: Props) {
  const params = await searchParams;
  return (
    <main className="bg-creme min-h-screen px-6 py-10">
      <div className="border-line bg-paper mx-auto max-w-2xl rounded-2xl border p-6">
        <h1 className="font-display text-ink text-2xl font-bold">Checkout</h1>
        <p className="text-ink-soft mt-2 text-sm">
          À venir avec le module paiements.
        </p>
        <p className="text-ink-soft mt-4 text-xs">
          type: {params.type ?? "-"} | listingId: {params.listingId ?? "-"}
        </p>
      </div>
    </main>
  );
}
