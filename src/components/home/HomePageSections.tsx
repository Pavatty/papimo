import { getTranslations } from "next-intl/server";
import {
  ArrowRight,
  CheckCircle2,
  Home,
  MessageCircle,
  Sparkles,
} from "lucide-react";

import { buttonVariants } from "@/components/ui/button";
import { Link } from "@/i18n/navigation";
import { cn } from "@/lib/utils";

const MOCK_LISTINGS = [
  {
    title: "Villa avec jardin — La Marsa",
    meta: "Vente · 4 pièces · Jardin",
    price: "1 250 000 TND",
    tag: "Exemple",
  },
  {
    title: "S+2 meublé — Centre-ville Tunis",
    meta: "Location · 2 chambres · Meublé",
    price: "1 200 TND / mois",
    tag: "Exemple",
  },
  {
    title: "Terrain constructible — Hammamet",
    meta: "Terrain · 400 m² · Viabilisé",
    price: "420 000 TND",
    tag: "Exemple",
  },
] as const;

// Sections marketing sous le hero : parcours, extraits, outils — tout en liens vers des routes réelles
export async function HomePageSections() {
  const t = await getTranslations("home");

  return (
    <>
      <section
        className="border-line border-y bg-white/40 py-16 md:py-20"
        aria-labelledby="how-heading"
      >
        <div className="mx-auto max-w-6xl px-4 md:px-6">
          <h2
            id="how-heading"
            className="font-heading text-ink text-center text-2xl font-bold tracking-tight md:text-3xl"
          >
            {t("howItWorks.title")}
          </h2>
          <ol className="mt-10 grid gap-6 md:grid-cols-3">
            {[
              {
                icon: Home,
                title: t("howItWorks.step1Title"),
                body: t("howItWorks.step1"),
              },
              {
                icon: MessageCircle,
                title: t("howItWorks.step2Title"),
                body: t("howItWorks.step2"),
              },
              {
                icon: CheckCircle2,
                title: t("howItWorks.step3Title"),
                body: t("howItWorks.step3"),
              },
            ].map((step) => {
              const Icon = step.icon;
              return (
                <li
                  key={step.title}
                  className="border-line bg-creme-pale/80 rounded-2xl border p-5 shadow-sm"
                >
                  <Icon className="text-bleu mb-3 h-8 w-8" aria-hidden />
                  <h3 className="text-ink text-lg font-semibold">
                    {step.title}
                  </h3>
                  <p className="text-ink-soft mt-2 text-sm leading-relaxed">
                    {step.body}
                  </p>
                </li>
              );
            })}
          </ol>
        </div>
      </section>

      <section
        className="mx-auto max-w-6xl px-4 py-16 md:px-6 md:py-20"
        aria-labelledby="listings-heading"
      >
        <h2
          id="listings-heading"
          className="font-heading text-ink text-2xl font-bold tracking-tight md:text-3xl"
        >
          {t("sampleListings.title")}
        </h2>
        <p className="text-ink-soft mt-2 max-w-2xl text-sm md:text-base">
          {t("sampleListings.subtitle")}
        </p>
        <ul className="mt-8 grid gap-4 md:grid-cols-3">
          {MOCK_LISTINGS.map((item) => (
            <li
              key={item.title}
              className="border-line bg-paper flex flex-col rounded-2xl border p-4"
            >
              <span className="text-ink-soft text-[11px] font-medium uppercase">
                {item.tag}
              </span>
              <p className="text-ink mt-1 font-semibold">{item.title}</p>
              <p className="text-ink-soft mt-1 text-sm">{item.meta}</p>
              <p className="text-corail mt-3 text-sm font-bold">{item.price}</p>
            </li>
          ))}
        </ul>
        <div className="mt-6 flex justify-center">
          <Link
            href="/search"
            className={cn(
              buttonVariants({ variant: "default", size: "lg" }),
              "inline-flex items-center gap-2",
            )}
          >
            {t("sampleListings.cta")}
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </section>

      <section
        className="from-bleu/8 border-line to-corail/8 border-y bg-gradient-to-br py-16 md:py-20"
        aria-labelledby="tools-heading"
      >
        <div className="mx-auto flex max-w-6xl flex-col items-start gap-4 px-4 md:flex-row md:items-center md:justify-between md:px-6">
          <div>
            <h2
              id="tools-heading"
              className="font-heading text-ink text-2xl font-bold tracking-tight md:text-3xl"
            >
              {t("tools.title")}
            </h2>
            <p className="text-ink-soft mt-2 max-w-2xl text-sm md:text-base">
              {t("tools.subtitle")}
            </p>
          </div>
          <Link
            href="/outils"
            className={cn(
              buttonVariants({ variant: "secondary", size: "lg" }),
              "text-bleu border-bleu/20 inline-flex shrink-0 items-center gap-2",
            )}
          >
            <Sparkles className="h-4 w-4" />
            {t("tools.cta")}
          </Link>
        </div>
      </section>
    </>
  );
}
