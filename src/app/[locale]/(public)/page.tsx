import type { Metadata } from "next";

import { ImmobilierSection } from "@/components/home/ImmobilierSection";
import { MiniHero } from "@/components/home/MiniHero";
import { SejoursSection } from "@/components/home/SejoursSection";
import { buildPageMetadata } from "@/lib/seo/metadata";

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  return buildPageMetadata({
    locale,
    pathnameWithoutLocale: "",
    title: "LODGE | L'immobilier entre particuliers",
    description:
      "Plateforme immobilière entre particuliers : achat, location, location meublée, séjours courte durée et publication d'annonces.",
  });
}

export const revalidate = 900;

export default async function HomePage() {
  return (
    <>
      <MiniHero />
      <main className="bg-cream min-h-screen">
        <div className="mx-auto max-w-7xl px-4 py-14 md:px-6">
          <ImmobilierSection />
          <hr className="my-14 border-gray-200" />
          <SejoursSection />
        </div>
      </main>
    </>
  );
}
