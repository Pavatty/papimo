"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";

export type CookieConsent = {
  analytics: boolean;
  productAnalytics: boolean;
};

const COOKIE_KEY = "papimo_cookie_consent";
const THIRTEEN_MONTHS_SECONDS = 60 * 60 * 24 * 30 * 13;

function writeConsent(consent: CookieConsent) {
  const serialized = encodeURIComponent(JSON.stringify(consent));
  document.cookie = `${COOKIE_KEY}=${serialized}; path=/; max-age=${THIRTEEN_MONTHS_SECONDS}; SameSite=Lax`;
}

export function readConsent(): CookieConsent | null {
  if (typeof document === "undefined") return null;
  const match = document.cookie
    .split("; ")
    .find((entry) => entry.startsWith(`${COOKIE_KEY}=`));
  if (!match) return null;
  try {
    const raw = match.split("=")[1];
    if (raw === undefined) return null;
    return JSON.parse(decodeURIComponent(raw)) as CookieConsent;
  } catch {
    return null;
  }
}

export function CookieConsentBanner() {
  const t = useTranslations("cookies");
  const [open, setOpen] = useState(true);
  const [customize, setCustomize] = useState(false);
  const [analytics, setAnalytics] = useState(true);
  const [productAnalytics, setProductAnalytics] = useState(true);

  const save = (consent: CookieConsent) => {
    writeConsent(consent);
    window.dispatchEvent(new CustomEvent("papimo:consent-updated"));
    setOpen(false);
  };

  if (!open) return null;

  return (
    <aside
      role="dialog"
      aria-label="Gestion des cookies"
      className="border-line fixed right-3 bottom-3 left-3 z-50 rounded-xl border bg-white p-4 shadow-lg md:left-auto md:w-[560px]"
    >
      <p className="text-ink text-sm font-semibold">{t("title")}</p>
      <p className="text-ink-soft mt-1 text-xs">{t("description")}</p>

      {customize ? (
        <div className="border-line mt-3 space-y-2 rounded-lg border p-3">
          <label className="text-ink flex items-center justify-between text-sm">
            <span>Plausible (analytics web)</span>
            <input
              type="checkbox"
              checked={analytics}
              onChange={(e) => setAnalytics(e.target.checked)}
            />
          </label>
          <label className="text-ink flex items-center justify-between text-sm">
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
          className="bg-corail hover:bg-corail-hover rounded-control px-3 py-1.5 text-xs font-medium text-white transition"
        >
          {t("acceptAll")}
        </button>
        <button
          onClick={() => save({ analytics: false, productAnalytics: false })}
          className="bg-creme text-ink rounded px-3 py-1.5 text-xs"
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
          className="border-line text-ink rounded border bg-white px-3 py-1.5 text-xs"
        >
          {t("customize")}
        </button>
      </div>
    </aside>
  );
}
