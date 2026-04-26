export function formatSurface(surfaceM2: number | null | undefined) {
  if (!surfaceM2 || surfaceM2 <= 0) return "-";
  return `${new Intl.NumberFormat("fr-FR").format(surfaceM2)} m²`;
}

export function formatListingDate(
  isoDate: string | null | undefined,
  locale = "fr-FR",
) {
  if (!isoDate) return "-";
  const parsed = new Date(isoDate);
  if (Number.isNaN(parsed.getTime())) return "-";
  return new Intl.DateTimeFormat(locale, {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(parsed);
}
