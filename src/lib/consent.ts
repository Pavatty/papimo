// Module pur de gestion du consentement cookies (lecture / écriture / abonnement).
// La UI vit dans src/components/shared/CookieConsentBanner.tsx mais ne porte plus
// la logique de stockage. Tout consommateur (banner, AnalyticsBootstrap, tests…)
// lit ici.

export type CookieConsent = {
  analytics: boolean;
  productAnalytics: boolean;
};

const COOKIE_KEY = "papimo_cookie_consent";
const STORAGE_KEY = "papimo_cookie_consent_v1";
const THIRTEEN_MONTHS_SECONDS = 60 * 60 * 24 * 30 * 13;
const CONSENT_EVENT = "papimo:consent-updated";

export function readConsent(): CookieConsent | null {
  if (typeof document === "undefined") return null;
  // 1) cookie (canonical, partagé SSR/CSR si on en a besoin un jour)
  const match = document.cookie
    .split("; ")
    .find((entry) => entry.startsWith(`${COOKIE_KEY}=`));
  if (match) {
    try {
      const raw = match.split("=")[1];
      if (raw !== undefined) {
        return JSON.parse(decodeURIComponent(raw)) as CookieConsent;
      }
    } catch {
      // ignore parse error → fall through to localStorage
    }
  }
  // 2) localStorage (fallback robuste pour navigateurs qui restreignent les cookies)
  try {
    const stored = window.localStorage.getItem(STORAGE_KEY);
    if (stored) {
      const parsed = JSON.parse(stored) as Partial<CookieConsent>;
      if (
        typeof parsed.analytics === "boolean" &&
        typeof parsed.productAnalytics === "boolean"
      ) {
        return {
          analytics: parsed.analytics,
          productAnalytics: parsed.productAnalytics,
        };
      }
    }
  } catch {
    // ignore
  }
  return null;
}

export function writeConsent(consent: CookieConsent): void {
  if (typeof document === "undefined") return;
  const serialized = encodeURIComponent(JSON.stringify(consent));
  document.cookie = `${COOKIE_KEY}=${serialized}; path=/; max-age=${THIRTEEN_MONTHS_SECONDS}; SameSite=Lax`;
  try {
    window.localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({ ...consent, at: new Date().toISOString() }),
    );
  } catch {
    // localStorage may be unavailable (private mode, SSR) — cookie still wins
  }
  try {
    window.dispatchEvent(new CustomEvent(CONSENT_EVENT, { detail: consent }));
  } catch {
    // ignore
  }
}

export function subscribeConsent(callback: () => void): () => void {
  if (typeof window === "undefined") return () => {};
  window.addEventListener(CONSENT_EVENT, callback);
  return () => window.removeEventListener(CONSENT_EVENT, callback);
}
