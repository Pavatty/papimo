import type { Enums } from "@/types/database";

export const LISTING_PACK_PRICES_TND: Record<Enums<"listing_pack">, number> = {
  free: 0,
  essential: 29,
  comfort: 69,
  premium: 149,
};

export const BOOST_CONFIG: Record<
  Enums<"boost_type">,
  { priceTnd: number; durationDays: number }
> = {
  top_list: { priceTnd: 25, durationDays: 30 },
  highlight: { priceTnd: 10, durationDays: 14 },
  refresh: { priceTnd: 5, durationDays: 3 },
  coup_de_coeur: { priceTnd: 20, durationDays: 21 },
  urgent: { priceTnd: 8, durationDays: 7 },
  exclusif: { priceTnd: 15, durationDays: 14 },
};

export const PRO_PLANS = [
  {
    id: "free",
    title: "Free",
    priceLabel: "0 DT",
    monthlyPriceTnd: 0,
    description: "Pour particuliers",
    features: ["1 annonce active", "5 photos", "Visible 30 jours"],
  },
  {
    id: "essential",
    title: "Essential",
    priceLabel: "29 DT / mois",
    monthlyPriceTnd: 29,
    description: "Pour vendeurs réguliers",
    features: [
      "3 annonces actives",
      "12 photos par annonce",
      "Visible 60 jours",
      "Statistiques de vues",
    ],
  },
  {
    id: "comfort",
    title: "Comfort",
    priceLabel: "69 DT / mois",
    monthlyPriceTnd: 69,
    description: "Pour vendeurs ambitieux",
    features: [
      "5 annonces actives",
      "20 photos par annonce",
      "Vidéo de présentation",
      "Top liste 7 jours",
    ],
  },
  {
    id: "premium",
    title: "Premium",
    priceLabel: "149 DT / mois",
    monthlyPriceTnd: 149,
    description: "Pour pros de l'immobilier",
    features: [
      "Annonces illimitées",
      "30 photos par annonce",
      "Top accueil",
      "Support prioritaire",
    ],
  },
] as const;

export function convertTndToForeign(tnd: number, currency: "EUR" | "USD") {
  const rate = currency === "EUR" ? 0.29 : 0.31;
  return Math.ceil(tnd * rate);
}
