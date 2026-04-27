import { Check } from "lucide-react";

import { PRO_PLANS } from "@/lib/payments/pricing";

export default function PricingPage() {
  return (
    <main className="bg-creme min-h-screen px-6 py-10">
      <div className="mx-auto max-w-6xl">
        <h1 className="text-encre font-serif text-4xl">Tarifs papimo</h1>
        <p className="text-muted mt-2 text-sm">
          Quatre packs immobiliers pour vendre ou louer en toute simplicité,
          sans commission cachée. Konnect en Tunisie, Stripe à
          l&apos;international.
        </p>

        <section className="mt-8 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {PRO_PLANS.map((plan, index) => (
            <article
              key={plan.id}
              className={`rounded-card shadow-card border bg-white p-6 ${
                index === 2
                  ? "border-corail shadow-card-hover"
                  : "border-bordurewarm-tertiary"
              }`}
            >
              {index === 2 ? (
                <span className="bg-corail rounded-control mb-3 inline-flex px-2 py-1 text-[11px] font-semibold tracking-wide text-white uppercase">
                  Recommandé
                </span>
              ) : null}
              <h2 className="text-encre text-xl font-semibold">{plan.title}</h2>
              <p className="text-corail mt-2 font-serif text-3xl">
                {plan.priceLabel}
              </p>
              <p className="text-muted mt-1 text-sm">{plan.description}</p>
              <ul className="mt-5 space-y-2 text-sm">
                {plan.features.map((feature) => (
                  <li
                    key={feature}
                    className="text-encre flex items-start gap-2"
                  >
                    <Check
                      className="text-corail mt-0.5 h-4 w-4 shrink-0"
                      aria-hidden
                    />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
            </article>
          ))}
        </section>
      </div>
    </main>
  );
}
