// LODGE — constantes de marque centralisées (source unique pour l'app et le SEO côté serveur).

export const BRAND_COLORS = {
  vert: "#1B5E3F" as const,
  vertHover: "#144A30" as const,
  vertClair: "#3DA876" as const,
  vertFonce: "#0A2A1B" as const,
  terracotta: "#E07B3F" as const,
  creme: "#FAFAF7" as const,
  encre: "#1A1A1A" as const,
} as const;

export const BRAND = {
  name: "LODGE" as const,
  logoText: {
    full: { text: "LODGE", color: "vert" },
  },
  tagline: {
    fr: "L'immobilier entre particuliers" as const,
    en: "Real estate between private owners" as const,
    ar: "العقارات بين الأفراد" as const,
  },
  url: "https://lodge.tn" as const,
  email: "contact@lodge.tn" as const,
  supportPhone: null as null | string,
  supportedCountries: [
    "TN",
    "MA",
    "DZ",
    "FR",
    "BE",
    "CH",
    "CA",
    "AE",
    "QA",
  ] as const,
  supportedCurrencies: ["TND", "EUR", "USD", "MAD", "DZD"] as const,
  defaultLocale: "fr" as const,
  supportedLocales: ["fr", "ar", "en"] as const,
} as const;
