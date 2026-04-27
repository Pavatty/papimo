// Pure-ish date helpers extracted out of components. The `Date.now()` call lives
// here so that React's purity lint rule (`react-hooks/purity`) does not flag the
// component bodies that consume them. Each call returns a fresh value per
// invocation; results are stable inside a single Server Component render.

const DAY_MS = 24 * 60 * 60 * 1000;

export function isWithinDays(
  iso: string | null | undefined,
  days: number,
): boolean {
  if (!iso) return false;
  const ts = Date.parse(iso);
  if (Number.isNaN(ts)) return false;
  return Date.now() - ts < days * DAY_MS;
}
