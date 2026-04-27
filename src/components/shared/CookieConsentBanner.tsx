"use client";

import { useState, useSyncExternalStore } from "react";
import { useTranslations } from "next-intl";

export type CookieConsent = {
  analytics: boolean;
  productAnalytics: boolean;
};

const COOKIE_KEY = "papimo_cookie_consent";
const STORAGE_KEY = "papimo_cookie_consent_v1";
const THIRTEEN_MONTHS_SECONDS = 60 * 60 * 24 * 30 * 13;

function writeConsent(consent: CookieConsent) {
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
}

export function readConsent(): CookieConsent | null {
  if (typeof document === "undefined") return null;
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
      // fall through to localStorage
    }
  }
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

function subscribe(callback: () => void) {
  window.addEventListener("papimo:consent-updated", callback);
  return () => window.removeEventListener("papimo:consent-updated", callback);
}

export function CookieConsentBanner() {
  const t = useTranslations("cookies");
  const consent = useSyncExternalStore(
    subscribe,
    () => readConsent(),
    () => null,
  );
  const [customize, setCustomize] = useState(false);
  const [analytics, setAnalytics] = useState(true);
  const [productAnalytics, setProductAnalytics] = useState(true);

  const save = (next: CookieConsent) => {
    writeConsent(next);
    window.dispatchEvent(new CustomEvent("papimo:consent-updated"));
  };

  if (consent !== null) return null;

  return (
    <aside
      role="dialog"
      aria-label="Gestion des cookies"
      className="bg-blanc-casse border-bordurewarm-secondary shadow-card-hover rounded-card fixed right-3 bottom-3 left-3 z-[60] border p-5 md:left-auto md:w-[560px]"
    >
      <h2 className="text-encre font-serif text-lg">{t("title")}</h2>
      <p className="text-encre/80 mt-1 text-sm">{t("description")}</p>

      {customize ? (
        <div className="border-bordurewarm-tertiary rounded-control mt-3 space-y-2 border p-3">
          <label className="text-encre flex items-center justify-between text-sm">
            <span>Plausible (analytics web)</span>
            <input
              type="checkbox"
              checked={analytics}
              onChange={(e) => setAnalytics(e.target.checked)}
            />
          </label>
          <label className="text-encre flex items-center justify-between text-sm">
            <span>Posthog (events produit)</span>
            <input
              type="checkbox"
              checked={productAnalytics}
              onChange={(e) => setProductAnalytics(e.target.checked)}
            />
          </label>
        </div>
      ) : null}

      <div className="mt-4 flex flex-wrap gap-2">
        <button
          onClick={() => save({ analytics: true, productAnalytics: true })}
          className="bg-corail hover:bg-corail-hover rounded-control px-4 py-2 text-sm font-medium text-white transition"
        >
          {t("acceptAll")}
        </button>
        <button
          onClick={() => save({ analytics: false, productAnalytics: false })}
          className="bg-creme-foncee hover:bg-bordurewarm-tertiary text-encre rounded-control px-4 py-2 text-sm font-medium transition"
        >
          {t("rejectAll")}
        </button>
        <button
          onClick={() => {
            if (customize) {
              save({ analytics, productAnalytics });
            } else {
              setCustomize(true);
            }
          }}
          className="text-bleu hover:text-bleu-hover px-4 py-2 text-sm font-medium transition"
        >
          {t("customize")}
        </button>
      </div>
    </aside>
  );
}
