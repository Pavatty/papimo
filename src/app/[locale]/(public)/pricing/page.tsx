import { Check } from "lucide-react";
import { getLocale } from "next-intl/server";

import { getPricingPacks } from "@/data/repositories/pricing-packs";
import {
  getTaxonomyLabel,
  type LocaleKey,
} from "@/data/repositories/taxonomies";

function formatPackPrice(price: number, locale: string): string {
  if (price === 0)
    return locale === "ar" ? "مجاني" : locale === "en" ? "Free" : "0 DT";
  const formatted = new Intl.NumberFormat(
    locale === "ar" ? "ar-TN" : "fr-FR",
  ).format(price);
  const suffix =
    locale === "ar"
      ? "د.ت / شهر"
      : locale === "en"
        ? "DT / month"
        : "DT / mois";
  return `${formatted} ${suffix}`;
}

export default async function PricingPage() {
  const locale = await getLocale();
  const localeKey: LocaleKey =
    locale === "ar" || locale === "en" ? (locale as LocaleKey) : "fr";
  const packs = await getPricingPacks();

  return (
    <main className="bg-creme dark:bg-encre min-h-screen px-6 py-10">
      <div className="mx-auto max-w-6xl">
        <h1 className="text-encre dark:text-creme font-serif text-4xl">
          Tarifs LODGE
        </h1>
        <p className="text-muted dark:text-creme/60 mt-2 text-sm">
          Quatre packs immobiliers pour vendre ou louer en toute simplicité,
          sans commission cachée. Konnect ou Stripe selon votre pays.
        </p>

        <section className="mt-8 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {packs.map((plan) => {
            const features = Array.isArray(plan.features)
              ? (plan.features as string[])
              : [];
            return (
              <article
                key={plan.code}
                className={`rounded-card shadow-card border bg-white p-6 ${
                  plan.is_recommended
                    ? "border-corail shadow-card-hover"
                    : "border-bordurewarm-tertiary dark:border-encre/20"
                }`}
              >
                {plan.is_recommended ? (
                  <span className="bg-corail rounded-control mb-3 inline-flex px-2 py-1 text-[11px] font-semibold tracking-wide text-white uppercase">
                    Recommandé
                  </span>
                ) : null}
                <h2 className="text-encre dark:text-creme text-xl font-semibold">
                  {getTaxonomyLabel(plan, localeKey)}
                </h2>
                <p className="text-corail mt-2 font-serif text-3xl">
                  {formatPackPrice(Number(plan.price_monthly_tnd), locale)}
                </p>
                <p className="text-muted dark:text-creme/60 mt-1 text-sm">
                  {plan.max_active_listings} annonce
                  {plan.max_active_listings > 1 ? "s" : ""} ·{" "}
                  {plan.max_photos_per_listing} photos · {plan.active_days}{" "}
                  jours
                </p>
                <ul className="mt-5 space-y-2 text-sm">
                  {features.map((feature) => (
                    <li
                      key={feature}
                      className="text-encre dark:text-creme flex items-start gap-2"
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
            );
          })}
        </section>
      </div>
    </main>
  );
}
