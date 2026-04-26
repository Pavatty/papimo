export function formatPrice(
  value: number,
  currency: "TND" | "EUR" | "USD" | "MAD" | "DZD",
  locale = "fr-TN",
) {
  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency,
    maximumFractionDigits: 0,
  }).format(value);
}
