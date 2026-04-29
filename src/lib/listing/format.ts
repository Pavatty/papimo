type TransactionType = string | null | undefined;

export interface FormatPriceOptions {
  locale?: string;
  rentSuffix?: string;
  fallback?: string;
}

// Source de vérité unique pour l'affichage des prix d'annonce immobilière.
// Format compact : "450 000 TND" pour vente, "1 200 TND / mois" pour location.
export function formatPrice(
  price: number | null | undefined,
  currency: string | null | undefined,
  transactionType: TransactionType = null,
  options: FormatPriceOptions = {},
): string {
  const {
    locale = "fr-FR",
    rentSuffix = " / mois",
    fallback = "Prix sur demande",
  } = options;
  if (price == null) return fallback;
  const formatted = new Intl.NumberFormat(locale).format(price);
  // Le suffixe " / mois" s'applique aux locations longue durée (Immobilier),
  // y compris la location meublée 1-12 mois. Les Séjours utilisent base_price_per_night.
  const isRent =
    transactionType === "rent" || transactionType === "furnished_rent";
  const suffix = isRent ? rentSuffix : "";
  return `${formatted} ${currency ?? "TND"}${suffix}`;
}

export const TRANSACTION_BADGES: Record<string, string> = {
  sale: "À vendre",
  rent: "À louer",
  furnished_rent: "Location meublée",
  colocation: "Colocation",
};

export function getTransactionBadge(
  transactionType: string | null | undefined,
): string | null {
  if (!transactionType) return null;
  return TRANSACTION_BADGES[transactionType] ?? transactionType;
}
