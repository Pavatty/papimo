import { PRO_PLANS } from "@/lib/payments/pricing";

export default function PricingPage() {
  return (
    <main className="bg-creme min-h-screen px-6 py-10">
      <div className="mx-auto max-w-6xl">
        <h1 className="font-display text-ink text-3xl font-bold">
          Tarifs papimo
        </h1>
        <p className="text-ink-soft mt-2 text-sm">
          Konnect pour la Tunisie, Stripe pour l&#39;international.
        </p>

        <section className="mt-8 grid gap-4 md:grid-cols-3">
          {PRO_PLANS.map((plan, index) => (
            <article
              key={plan.id}
              className={`border-line rounded-2xl border bg-white p-5 ${
                index === 1 ? "border-corail shadow-sm" : ""
              }`}
            >
              {index === 1 ? (
                <span className="bg-corail mb-3 inline-flex rounded-full px-2 py-1 text-[11px] text-white">
                  Recommandé
                </span>
              ) : null}
              <h2 className="text-ink text-xl font-semibold">{plan.title}</h2>
              <p className="text-bleu mt-2 text-2xl font-bold">
                {plan.priceLabel}
              </p>
              <p className="text-ink-soft mt-1 text-sm">{plan.description}</p>
              <p className="bg-bleu-pale text-bleu mt-4 rounded-full px-2 py-1 text-xs">
                Économisez 20% sur abonnement annuel
              </p>
            </article>
          ))}
        </section>
      </div>
    </main>
  );
}
