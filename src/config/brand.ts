// Constantes de marque centralisées (source unique pour l’app et le SEO côté serveur)

export const BRAND_COLORS = {
  bleu: "#1E5A96" as const,
  /** Corail Méditerranée (ex-#E63946) */
  corail: "#EF6F50" as const,
  creme: "#FBF6EC" as const,
} as const;

export const BRAND = {
  name: "papimo" as const,
  logoText: {
    pap: { text: "pap", color: "bleu" },
    imo: { text: "imo", color: "corail" },
  },
  tagline: {
    fr: "L'immobilier entre particuliers" as const,
    en: "Real estate between private owners" as const,
    ar: "العقارات بين الخواص" as const,
  },
  url: "https://papimo.com" as const,
  email: "contact@papimo.com" as const,
  /** À compléter quand le numéro support est définitif */
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
