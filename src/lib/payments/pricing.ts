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
    title: "Classique",
    priceLabel: "Gratuit",
    monthlyPriceTnd: 0,
    description: "Pour particuliers",
  },
  {
    id: "verified",
    title: "Badge Vérifié",
    priceLabel: "35 DT / mois",
    monthlyPriceTnd: 35,
    description: "Confiance renforcée",
  },
  {
    id: "fleet",
    title: "Flotte Pro",
    priceLabel: "80 DT / véhicule / mois",
    monthlyPriceTnd: 80,
    description: "Gestion multi-biens",
  },
] as const;

export function convertTndToForeign(tnd: number, currency: "EUR" | "USD") {
  const rate = currency === "EUR" ? 0.29 : 0.31;
  return Math.ceil(tnd * rate);
}
