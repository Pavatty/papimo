import type { Metadata } from "next";

import { HomePageSections } from "@/components/home/HomePageSections";
import { QuickFilters } from "@/components/home/QuickFilters";
import { StickyPublishCTA } from "@/components/home/StickyPublishCTA";
import { TrustSignals } from "@/components/home/TrustSignals";
import { HeroSection } from "@/components/shared/HeroSection";
import { getFeatureFlags } from "@/data/repositories/feature-flags";
import { buildPageMetadata } from "@/lib/seo/metadata";

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  return buildPageMetadata({
    locale,
    pathnameWithoutLocale: "",
    title: "LODGE | L'immobilier entre particuliers",
    description:
      "Plateforme immobilière entre particuliers: achat, location, publication d'annonces et messagerie sécurisée.",
  });
}

export const revalidate = 900;

export default async function HomePage() {
  const flags = await getFeatureFlags();
  const showTrust = flags.show_trust_signals !== false;
  const showQuickFilters = flags.show_quick_filters !== false;
  const showStickyCta = flags.show_sticky_publish_cta !== false;

  return (
    <>
      <HeroSection />
      <HomePageSections />
      {showTrust ? <TrustSignals /> : null}
      {showQuickFilters ? <QuickFilters /> : null}
      {showStickyCta ? <StickyPublishCTA /> : null}
    </>
  );
}
