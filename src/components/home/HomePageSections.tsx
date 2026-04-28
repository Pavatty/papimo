import {
  ArrowRight,
  Briefcase,
  Building,
  Building2,
  CheckCircle2,
  Home,
  Hotel,
  LandPlot,
  MessageCircle,
  Sparkles,
  Store,
  Warehouse,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import Image from "next/image";
import { getLocale, getTranslations } from "next-intl/server";

import { PourquoiPapimo } from "@/components/home/PourquoiPapimo";
import { AnimatedSection } from "@/components/shared/AnimatedSection";
import { buttonVariants } from "@/components/ui/button";
import { getLatestActiveListings } from "@/data/repositories/listings";
import {
  getPropertyTypes,
  getTaxonomyLabel,
  getTransactionTypes,
  type LocaleKey,
} from "@/data/repositories/taxonomies";
import { Link } from "@/i18n/navigation";
import { formatPrice } from "@/lib/listing/format";
import { cn } from "@/lib/utils";

const PROPERTY_TYPE_ICONS: Record<string, LucideIcon> = {
  apartment: Building2,
  house: Home,
  villa: Hotel,
  studio: Building,
  land: LandPlot,
  commercial: Store,
  commercial_space: Store,
  office: Briefcase,
  warehouse: Warehouse,
};

const SEVEN_DAYS_MS = 7 * 24 * 60 * 60 * 1000;

// Sections marketing sous le hero : annonces, parcours, pourquoi, catégories, outils
export async function HomePageSections() {
  const t = await getTranslations("home");
  const locale = await getLocale();
  const localeKey: LocaleKey =
    locale === "ar" || locale === "en" ? (locale as LocaleKey) : "fr";
  const newBadge = t("newBadge");
  const [listings, transactionTypes, propertyTypes] = await Promise.all([
    getLatestActiveListings(8),
    getTransactionTypes(),
    getPropertyTypes(),
  ]);
  const txByCode = new Map(transactionTypes.map((tx) => [tx.code, tx]));
  const featuredPropertyTypes = propertyTypes.slice(0, 8);
  // Freshness threshold computed once per request on the server; safe to
  // capture Date.now here because this whole component runs as a request-
  // scoped server function, not a render-time client closure.
  // eslint-disable-next-line react-hooks/purity
  const nowMs = Date.now();
  const freshnessCutoffMs = nowMs - SEVEN_DAYS_MS;

  return (
    <>
      <AnimatedSection
        className="mx-auto max-w-7xl px-4 py-12 md:px-6 md:py-16"
        aria-labelledby="listings-heading"
      >
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <h2
              id="listings-heading"
              className="text-encre dark:text-creme font-serif text-3xl md:text-4xl"
            >
              {t("sampleListings.title")}
            </h2>
            <p className="text-muted dark:text-creme/60 mt-2 max-w-2xl text-sm md:text-base">
              {t("sampleListings.subtitle")}
            </p>
          </div>
          <Link
            href="/search"
            className="text-bleu hover:text-bleu-hover focus-visible:ring-bleu inline-flex items-center gap-1 rounded-sm text-sm font-semibold transition focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none"
          >
            {t("sampleListings.cta")}
            <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </Link>
        </div>

        {listings.length > 0 ? (
          <ul className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {listings.map((listing) => {
              const photo = listing.mainPhoto ?? listing.photos[0] ?? null;
              const txItem = listing.transactionType
                ? txByCode.get(listing.transactionType)
                : undefined;
              const badge = txItem
                ? getTaxonomyLabel(txItem, localeKey)
                : (listing.transactionType ?? null);
              const priceLabel =
                listing.price == null
                  ? null
                  : formatPrice(
                      listing.price,
                      listing.priceCurrency,
                      listing.transactionType,
                    );
              const href = `/annonce/${listing.slug ?? listing.id}`;
              const localityParts = [
                listing.neighborhood?.trim(),
                listing.city?.trim(),
              ].filter(Boolean);
              const locality = localityParts.join(" · ");
              const isNew = Boolean(
                listing.publishedAt &&
                new Date(listing.publishedAt).getTime() > freshnessCutoffMs,
              );
              return (
                <li key={listing.id} className="flex">
                  <Link
                    href={href}
                    className="border-bordurewarm-tertiary dark:border-encre/20 bg-blanc-casse dark:bg-encre/95 rounded-card shadow-card hover:shadow-card-hover focus-visible:ring-bleu group flex w-full flex-col overflow-hidden border transition focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none"
                  >
                    <div className="bg-creme-foncee dark:bg-encre/40 relative aspect-[4/3] w-full overflow-hidden">
                      {photo ? (
                        <Image
                          src={photo}
                          alt={listing.title}
                          fill
                          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                          className="object-cover transition-transform duration-500 group-hover:scale-[1.04]"
                        />
                      ) : null}
                      {badge ? (
                        <span className="bg-corail rounded-control absolute top-2 left-2 px-2 py-0.5 text-[10px] font-semibold tracking-wide text-white uppercase">
                          {badge}
                        </span>
                      ) : null}
                      {isNew ? (
                        <span className="bg-bleu absolute top-2 right-2 rounded-full px-2 py-1 text-[10px] font-semibold tracking-wider text-white uppercase shadow-md">
                          {newBadge}
                        </span>
                      ) : null}
                    </div>
                    <div className="flex flex-1 flex-col gap-1 p-4">
                      <p className="text-encre dark:text-creme line-clamp-2 text-sm font-semibold">
                        {listing.title}
                      </p>
                      {locality ? (
                        <p className="text-muted dark:text-creme/60 text-xs">
                          {locality}
                        </p>
                      ) : null}
                      {priceLabel ? (
                        <p className="text-corail mt-2 font-serif text-lg">
                          {priceLabel}
                        </p>
                      ) : null}
                    </div>
                  </Link>
                </li>
              );
            })}
          </ul>
        ) : (
          <p className="text-muted dark:text-creme/60 mt-8 text-sm">
            {t("sampleListings.fallback")}
          </p>
        )}
      </AnimatedSection>

      <AnimatedSection
        className="border-bordurewarm-tertiary dark:border-encre/20 border-y bg-white/40 py-16 md:py-20"
        aria-labelledby="how-heading"
      >
        <div className="mx-auto max-w-6xl px-4 md:px-6">
          <h2
            id="how-heading"
            className="font-heading text-encre dark:text-creme text-center text-2xl font-bold tracking-tight md:text-3xl"
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
                  className="border-bordurewarm-tertiary dark:border-encre/20 bg-creme-pale/80 rounded-2xl border p-5 shadow-sm"
                >
                  <Icon className="text-bleu mb-3 h-8 w-8" aria-hidden="true" />
                  <h3 className="text-encre dark:text-creme text-lg font-semibold">
                    {step.title}
                  </h3>
                  <p className="text-encre/70 dark:text-creme/70 mt-2 text-sm leading-relaxed">
                    {step.body}
                  </p>
                </li>
              );
            })}
          </ol>
        </div>
      </AnimatedSection>

      <PourquoiPapimo />

      <AnimatedSection
        className="mx-auto max-w-6xl px-4 py-16 md:px-6 md:py-20"
        aria-labelledby="categories-heading"
      >
        <h2
          id="categories-heading"
          className="text-encre dark:text-creme font-serif text-3xl md:text-4xl"
        >
          Explorer par catégorie
        </h2>
        <p className="text-encre/70 dark:text-creme/70 mt-2 max-w-2xl text-sm md:text-base">
          Trouvez le bien qui vous ressemble — appartements, villas, terrains ou
          locaux commerciaux.
        </p>

        {featuredPropertyTypes.length > 0 ? (
          <ul className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
            {featuredPropertyTypes.map((pt) => {
              const Icon = PROPERTY_TYPE_ICONS[pt.code] ?? Building2;
              const label = getTaxonomyLabel(pt, localeKey);
              return (
                <li key={pt.id}>
                  <Link
                    href={`/search?type=${pt.code}`}
                    className="border-bordurewarm-tertiary dark:border-encre/20 bg-blanc-casse dark:bg-encre/95 hover:border-bleu/30 hover:shadow-card focus-visible:ring-bleu rounded-card group flex flex-col items-start gap-3 border p-4 transition focus-visible:ring-2 focus-visible:outline-none"
                  >
                    <span className="bg-bleu-pale text-bleu rounded-control flex h-10 w-10 items-center justify-center transition group-hover:scale-105">
                      <Icon className="h-5 w-5" aria-hidden="true" />
                    </span>
                    <span className="text-encre dark:text-creme text-sm font-medium">
                      {label}
                    </span>
                  </Link>
                </li>
              );
            })}
          </ul>
        ) : null}
      </AnimatedSection>

      <AnimatedSection
        className="from-bleu/8 border-bordurewarm-tertiary dark:border-encre/20 to-corail/8 border-y bg-gradient-to-br py-16 md:py-20"
        aria-labelledby="tools-heading"
      >
        <div className="mx-auto flex max-w-6xl flex-col items-start gap-4 px-4 md:flex-row md:items-center md:justify-between md:px-6">
          <div>
            <h2
              id="tools-heading"
              className="font-heading text-encre dark:text-creme text-2xl font-bold tracking-tight md:text-3xl"
            >
              {t("tools.title")}
            </h2>
            <p className="text-encre/70 dark:text-creme/70 mt-2 max-w-2xl text-sm md:text-base">
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
            <Sparkles className="h-4 w-4" aria-hidden="true" />
            {t("tools.cta")}
          </Link>
        </div>
      </AnimatedSection>
    </>
  );
}
