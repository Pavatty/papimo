import type { Metadata } from "next";

import { HomePageSections } from "@/components/home/HomePageSections";
import { HeroSection } from "@/components/shared/HeroSection";
import { buildPageMetadata } from "@/lib/seo/metadata";

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  return buildPageMetadata({
    locale,
    pathnameWithoutLocale: "",
    title: "papimo | L'immobilier entre particuliers",
    description:
      "Plateforme immobilière entre particuliers: achat, location, publication d'annonces et messagerie sécurisée.",
  });
}

export const revalidate = 900;

// Page d’accueil publique : coquille marketing (Header/Footer fournis par le layout (public))
export default function HomePage() {
  return (
    <>
      <HeroSection />
      <HomePageSections />
    </>
  );
}
