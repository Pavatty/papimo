import type { SupabaseClient } from "@supabase/supabase-js";
import {
  ArrowRight,
  CheckCircle2,
  Home,
  MessageCircle,
  Sparkles,
} from "lucide-react";
import Image from "next/image";
import { getTranslations } from "next-intl/server";

import { buttonVariants } from "@/components/ui/button";
import { Link } from "@/i18n/navigation";
import { createClient } from "@/lib/supabase/server";
import { cn } from "@/lib/utils";

type LatestListing = {
  id: string;
  slug: string | null;
  title: string;
  price: number | null;
  price_currency: string | null;
  city: string | null;
  neighborhood: string | null;
  photos: string[] | null;
  main_photo: string | null;
  transaction_type: string | null;
  surface_area: number | null;
  rooms_total: number | null;
};

const TRANSACTION_BADGE: Record<string, string> = {
  sale: "Vente",
  rent: "Location",
  seasonal_rent: "Saisonnier",
  colocation: "Colocation",
};

function formatPrice(price: number | null, currency: string | null) {
  if (!price) return null;
  return `${Math.round(price).toLocaleString("fr-FR")} ${currency ?? "TND"}`;
}

async function fetchLatestListings(): Promise<LatestListing[]> {
  try {
    const supabase = (await createClient()) as unknown as SupabaseClient;
    const { data } = await supabase
      .from("listings")
      .select(
        "id, slug, title, price, price_currency, city, neighborhood, photos, main_photo, transaction_type, surface_area, rooms_total",
      )
      .eq("status", "active")
      .order("published_at", { ascending: false, nullsFirst: false })
      .limit(4);
    return (data ?? []) as LatestListing[];
  } catch {
    return [];
  }
}

// Sections marketing sous le hero : parcours, dernières annonces, outils
export async function HomePageSections() {
  const t = await getTranslations("home");
  const listings = await fetchLatestListings();

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
          className="text-encre font-serif text-3xl md:text-4xl"
        >
          {t("sampleListings.title")}
        </h2>
        <p className="text-muted mt-2 max-w-2xl text-sm md:text-base">
          {t("sampleListings.subtitle")}
        </p>

        {listings.length > 0 ? (
          <ul className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {listings.map((listing) => {
              const photo = listing.main_photo ?? listing.photos?.[0] ?? null;
              const badge = listing.transaction_type
                ? (TRANSACTION_BADGE[listing.transaction_type] ??
                  listing.transaction_type)
                : null;
              const priceLabel = formatPrice(
                listing.price,
                listing.price_currency,
              );
              const href = `/listings/${listing.slug ?? listing.id}`;
              const localityParts = [
                listing.neighborhood?.trim(),
                listing.city?.trim(),
              ].filter(Boolean);
              const locality = localityParts.join(" · ");
              return (
                <li key={listing.id} className="flex">
                  <Link
                    href={href}
                    className="border-bordurewarm-tertiary bg-blanc-casse rounded-card shadow-card hover:shadow-card-hover flex w-full flex-col overflow-hidden border transition"
                  >
                    <div className="bg-creme-foncee relative aspect-[4/3] w-full overflow-hidden">
                      {photo ? (
                        <Image
                          src={photo}
                          alt={listing.title}
                          fill
                          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                          className="object-cover"
                        />
                      ) : null}
                      {badge ? (
                        <span className="bg-corail rounded-control absolute top-2 left-2 px-2 py-0.5 text-[10px] font-semibold tracking-wide text-white uppercase">
                          {badge}
                        </span>
                      ) : null}
                    </div>
                    <div className="flex flex-1 flex-col gap-1 p-4">
                      <p className="text-encre line-clamp-2 text-sm font-semibold">
                        {listing.title}
                      </p>
                      {locality ? (
                        <p className="text-muted text-xs">{locality}</p>
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
          <p className="text-muted mt-8 text-sm">
            {t("sampleListings.fallback")}
          </p>
        )}

        <div className="mt-8 flex justify-center">
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
