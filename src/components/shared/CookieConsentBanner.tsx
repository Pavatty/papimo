"use client";

import { useCallback, useState, useSyncExternalStore } from "react";
import { useTranslations } from "next-intl";

import {
  type CookieConsent,
  readConsent,
  subscribeConsent,
  writeConsent,
} from "@/lib/consent";

// Re-export for legacy callers (will be removed in Session 2 once they all migrate to "@/lib/consent")
export { readConsent };
export type { CookieConsent };

const emptySubscribe = () => () => {};

function subscribeAll(callback: () => void): () => void {
  const unsubConsent = subscribeConsent(callback);
  if (typeof window === "undefined") return unsubConsent;
  window.addEventListener("storage", callback);
  return () => {
    unsubConsent();
    window.removeEventListener("storage", callback);
  };
}

// Snapshot must be a stable PRIMITIVE — returning a fresh object here is what
// caused the React #185 infinite loop in PR #28.
function getNeedsBanner(): boolean {
  return readConsent() === null;
}

const getNeedsBannerServer = () => false;
const getIsClient = () => true;
const getIsClientServer = () => false;

export function CookieConsentBanner() {
  const t = useTranslations("cookies");
  const isClient = useSyncExternalStore(
    emptySubscribe,
    getIsClient,
    getIsClientServer,
  );
  const needsBanner = useSyncExternalStore(
    subscribeAll,
    getNeedsBanner,
    getNeedsBannerServer,
  );

  const [submitting, setSubmitting] = useState(false);
  const [customize, setCustomize] = useState(false);
  const [analytics, setAnalytics] = useState(true);
  const [productAnalytics, setProductAnalytics] = useState(true);

  const save = useCallback(
    (next: CookieConsent) => {
      if (submitting) return;
      setSubmitting(true);
      try {
        writeConsent(next);
      } catch (err) {
        console.error("[cookie-consent] write failed", err);
      } finally {
        setSubmitting(false);
      }
    },
    [submitting],
  );

  if (!isClient || !needsBanner) return null;

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
          type="button"
          disabled={submitting}
          onClick={() => save({ analytics: true, productAnalytics: true })}
          className="bg-corail hover:bg-corail-hover rounded-control px-4 py-2 text-sm font-medium text-white transition disabled:opacity-50"
        >
          {t("acceptAll")}
        </button>
        <button
          type="button"
          disabled={submitting}
          onClick={() => save({ analytics: false, productAnalytics: false })}
          className="bg-creme-foncee hover:bg-bordurewarm-tertiary text-encre rounded-control px-4 py-2 text-sm font-medium transition disabled:opacity-50"
        >
          {t("rejectAll")}
        </button>
        <button
          type="button"
          disabled={submitting}
          onClick={() => {
            if (customize) {
              save({ analytics, productAnalytics });
            } else {
              setCustomize(true);
            }
          }}
          className="text-bleu hover:text-bleu-hover px-4 py-2 text-sm font-medium transition disabled:opacity-50"
        >
          {t("customize")}
        </button>
      </div>
    </aside>
  );
}
