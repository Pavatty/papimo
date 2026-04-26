import { redirect } from "next/navigation";

import { startListingPackCheckoutAction } from "@/lib/payments/actions";
import { LISTING_PACK_PRICES_TND } from "@/lib/payments/pricing";
import { createClient } from "@/lib/supabase/server";

type Props = {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ type?: string; listingId?: string }>;
};

export default async function CheckoutPage({ params, searchParams }: Props) {
  const [{ locale }, query] = await Promise.all([params, searchParams]);
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect(`/${locale}/login?redirect_to=/${locale}/checkout`);

  const listingId = query.listingId ?? "";
  if (query.type !== "listing-pack" || !listingId) {
    return (
      <main className="bg-creme min-h-screen px-6 py-10">
        <div className="border-line bg-paper mx-auto max-w-2xl rounded-2xl border p-6">
          <h1 className="font-display text-ink text-2xl font-bold">Checkout</h1>
          <p className="text-ink-soft mt-2 text-sm">
            Type de checkout non supporté pour le moment.
          </p>
        </div>
      </main>
    );
  }

  const { data: listing } = await supabase
    .from("listings")
    .select("id, title, pack, status, owner_id")
    .eq("id", listingId)
    .eq("owner_id", user.id)
    .single();
  if (!listing) redirect(`/${locale}/checkout/failure`);

  const pack = listing.pack;
  if (pack === "free") {
    redirect(`/${locale}/dashboard`);
  }

  const amountTnd = LISTING_PACK_PRICES_TND[pack];

  return (
    <main className="bg-creme min-h-screen px-6 py-10">
      <div className="mx-auto grid max-w-4xl gap-6 md:grid-cols-2">
        <section className="border-line bg-paper rounded-2xl border p-6">
          <h1 className="font-display text-ink text-2xl font-bold">Checkout</h1>
          <p className="text-ink-soft mt-2 text-sm">
            Récapitulatif de votre pack pour publication.
          </p>
          <div className="mt-5 space-y-3 text-sm">
            <div className="flex justify-between">
              <span className="text-ink-soft">Annonce</span>
              <span className="text-ink font-medium">{listing.title}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-ink-soft">Pack</span>
              <span className="text-ink font-medium capitalize">{pack}</span>
            </div>
            <div className="flex justify-between border-t pt-3">
              <span className="text-ink-soft">Montant</span>
              <span className="text-bleu text-xl font-bold">
                {amountTnd} DT
              </span>
            </div>
          </div>
        </section>

        <section className="border-line bg-paper rounded-2xl border p-6">
          <h2 className="text-ink text-lg font-semibold">Paiement</h2>
          <p className="text-ink-soft mt-2 text-sm">
            Konnect est utilisé en priorité en Tunisie, Stripe pour la diaspora.
          </p>
          <form action={startListingPackCheckoutAction} className="mt-6">
            <input type="hidden" name="listingId" value={listing.id} />
            <input type="hidden" name="pack" value={pack} />
            <button
              type="submit"
              className="bg-corail w-full rounded-xl px-4 py-3 text-sm font-semibold text-white"
            >
              Payer
            </button>
          </form>
        </section>
      </div>
    </main>
  );
}
