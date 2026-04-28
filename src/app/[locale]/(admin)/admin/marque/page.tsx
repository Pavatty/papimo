import { getBrandSettings } from "@/data/repositories/app-settings";
import { requireAdmin } from "@/lib/admin/guards";

import { BrandSettingsClient } from "./BrandSettingsClient";

type Props = { params: Promise<{ locale: string }> };

const FALLBACK = {
  name: "papimo",
  logo_part1: "pap",
  logo_part2: "imo",
  tagline_fr: "L'immobilier entre particuliers",
  tagline_ar: "العقارات بين الأفراد",
  tagline_en: "Real estate, peer to peer",
  contact_email: "contact@papimo.com",
};

export default async function BrandSettingsPage({ params }: Props) {
  const { locale } = await params;
  await requireAdmin(locale);
  const dbBrand = await getBrandSettings();

  const initial = {
    name: dbBrand?.name ?? FALLBACK.name,
    logo_part1: dbBrand?.logo_part1 ?? FALLBACK.logo_part1,
    logo_part2: dbBrand?.logo_part2 ?? FALLBACK.logo_part2,
    tagline_fr: dbBrand?.tagline_fr ?? FALLBACK.tagline_fr,
    tagline_ar: dbBrand?.tagline_ar ?? FALLBACK.tagline_ar,
    tagline_en: dbBrand?.tagline_en ?? FALLBACK.tagline_en,
    contact_email: dbBrand?.contact_email ?? FALLBACK.contact_email,
  };

  return (
    <div className="space-y-4">
      <div>
        <h1 className="font-display text-ink text-2xl font-bold">
          Identité de marque
        </h1>
        <p className="text-ink-soft mt-1 text-sm">
          Le nom commercial et le slogan visibles sur le site.
        </p>
      </div>
      <BrandSettingsClient initial={initial} locale={locale} />
    </div>
  );
}
